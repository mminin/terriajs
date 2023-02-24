var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, toJS } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import Sortable from "react-anything-sortable";
import { Trans, useTranslation, withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import combine from "terriajs-cesium/Source/Core/combine";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import { Category, StoryAction } from "../../Core/AnalyticEvents/analyticEvents";
import triggerResize from "../../Core/triggerResize";
import Box from "../../Styled/Box";
import Button, { RawButton } from "../../Styled/Button";
import Icon, { StyledIcon } from "../../Styled/Icon";
import Spacing from "../../Styled/Spacing";
import Text, { TextSpan } from "../../Styled/Text";
import BadgeBar from "../BadgeBar";
import measureElement from "../HOCs/measureElement";
import VideoGuide from "../Map/Panels/HelpPanel/VideoGuide";
import { getShareData } from "../Map/Panels/SharePanel/BuildShareLink";
import SharePanel from "../Map/Panels/SharePanel/SharePanel";
import { withViewState } from "../StandardUserInterface/ViewStateContext";
import Story from "./Story";
import Styles from "./story-builder.scss";
import StoryEditor from "./StoryEditor.jsx";
const dataStoriesImg = require("../../../wwwroot/images/data-stories-getting-started.jpg");
const STORY_VIDEO = "storyVideo";
let StoryBuilder = class StoryBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.storiesWrapperRef = React.createRef();
        this.removeStory = (index, story) => {
            this.setState({
                isSharing: false,
                isRemoving: true,
                storyToRemove: story,
                storyRemoveIndex: index
            });
        };
        this.toggleRemoveDialog = () => {
            this.setState({
                isSharing: false,
                isRemoving: !this.state.isRemoving,
                storyToRemove: undefined,
                storyRemoveIndex: undefined
            });
        };
        this.resetReCaptureStatus = () => {
            this.setState({
                recaptureSuccessId: undefined
            });
        };
        this.closeShareRemoving = () => {
            this.setState({
                isRemoving: false,
                isSharing: false
            });
        };
        this.runStories = () => {
            this.closeShareRemoving();
            this.props.viewState.runStories();
        };
        this.toggleSharePanel = () => {
            this.setState({
                isRemoving: false,
                isSharing: !this.state.isSharing
            });
        };
        this.onClickCapture = () => {
            this.setState({
                editingMode: true,
                currentStory: undefined
            });
        };
        this.hideStoryBuilder = () => {
            this.props.viewState.toggleStoryBuilder();
            this.props.viewState.terria.currentViewer.notifyRepaintRequired();
            // Allow any animations to finish, then trigger a resize.
            setTimeout(function () {
                triggerResize();
            }, this.props.animationDuration || 1);
            this.props.viewState.toggleFeaturePrompt("story", false, true);
        };
        this.state = {
            editingMode: false,
            currentStory: undefined,
            recaptureSuccessId: undefined,
            clearRecaptureSuccessTimeout: undefined,
            showVideoGuide: false,
            isRemoving: false,
            isSharing: false,
            storyToRemove: undefined,
            storyRemoveIndex: undefined,
            storyWithOpenMenuId: undefined
        };
    }
    removeAction() {
        if (this.state.storyToRemove && this.state.storyRemoveIndex !== undefined) {
            this.props.viewState.terria.stories =
                this.props.viewState.terria.stories.filter((st) => st.id !== this.state.storyToRemove.id);
            if (this.state.storyRemoveIndex < this.props.viewState.currentStoryId) {
                this.props.viewState.currentStoryId -= 1;
            }
        }
        else {
            this.removeAllStories();
        }
        this.setState({
            storyToRemove: undefined,
            storyRemoveIndex: undefined
        });
    }
    removeAllStories() {
        this.props.viewState.terria.stories = [];
    }
    onSave(_story) {
        var _a;
        const story = {
            title: _story.title,
            text: _story.text,
            id: _story.id ? _story.id : createGuid()
        };
        (_a = this.props.viewState.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.story, StoryAction.saveStory, JSON.stringify(story));
        const storyIndex = (this.props.viewState.terria.stories || []).findIndex((story) => story.id === _story.id);
        if (storyIndex >= 0) {
            const oldStory = this.props.viewState.terria.stories[storyIndex];
            // replace the old story, we need to replace the stories array so that
            // it is observable
            this.props.viewState.terria.stories = [
                ...this.props.viewState.terria.stories.slice(0, storyIndex),
                combine(story, oldStory),
                ...this.props.viewState.terria.stories.slice(storyIndex + 1)
            ];
        }
        else {
            this.captureStory(story);
        }
        this.setState({
            editingMode: false
        });
    }
    captureStory(story) {
        const shareData = toJS(getShareData(this.props.viewState.terria, this.props.viewState, {
            includeStories: false
        }));
        this.props.viewState.terria.stories.push({ ...story, shareData });
    }
    recaptureScene(story) {
        var _a;
        const { t } = this.props;
        this.closeShareRemoving();
        (_a = this.clearRecaptureSuccessTimeout) === null || _a === void 0 ? void 0 : _a.call(this);
        const storyIndex = (this.props.viewState.terria.stories || []).findIndex((st) => st.id === story.id);
        if (storyIndex >= 0) {
            story.shareData = JSON.parse(JSON.stringify(getShareData(this.props.viewState.terria, this.props.viewState, {
                includeStories: false
            })));
            this.props.viewState.terria.stories = [
                ...this.props.viewState.terria.stories.slice(0, storyIndex),
                story,
                ...this.props.viewState.terria.stories.slice(storyIndex + 1)
            ];
            this.setState({
                recaptureSuccessId: story.id
            });
            const timeout = setTimeout(this.resetReCaptureStatus, 2000);
            this.clearRecaptureSuccessTimeout = () => clearTimeout(timeout);
        }
        else {
            throw new Error(t("story.doesNotExist"));
        }
    }
    editStory(story) {
        this.closeShareRemoving();
        this.props.viewState.storyShown = false;
        this.setState({
            editingMode: true,
            currentStory: story
        });
    }
    viewStory(index) {
        this.closeShareRemoving();
        this.props.viewState.currentStoryId = index;
        this.runStories();
    }
    onSort(sortedArray, _currentDraggingSortData, _currentDraggingIndex) {
        this.props.viewState.terria.stories = sortedArray;
    }
    componentWillUnmount() {
        var _a;
        (_a = this.clearRecaptureSuccessTimeout) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    renderIntro() {
        var _a;
        const { t } = this.props;
        return (React.createElement(Box, { column: true },
            React.createElement(VideoGuide
            /*
            // @ts-ignore */
            , { 
                /*
                // @ts-ignore */
                viewState: this.props.viewState, videoLink: ((_a = this.props.viewState.terria.configParameters.storyVideo) === null || _a === void 0 ? void 0 : _a.videoUrl) ||
                    "https://www.youtube-nocookie.com/embed/fbiQawV8IYY", background: dataStoriesImg, videoName: STORY_VIDEO }),
            React.createElement(StoryButton, { title: t("story.gettingStartedTitle"), btnText: t("story.gettingStarted"), onClick: () => {
                    this.props.viewState.setVideoGuideVisible(STORY_VIDEO);
                } },
                React.createElement(StyledIcon, { glyph: Icon.GLYPHS.play, light: true, styledWidth: "20px" })),
            React.createElement(Spacing, { bottom: 2 }),
            React.createElement(CaptureScene, { disabled: this.state.isRemoving, onClickCapture: this.onClickCapture })));
    }
    renderPlayShare(hasStories) {
        var _a;
        const { t } = this.props;
        return (React.createElement(Box, { justifySpaceBetween: true },
            React.createElement(StoryButton, { fullWidth: true, disabled: this.state.editingMode || !hasStories, title: t("story.preview"), btnText: t("story.play"), onClick: this.runStories },
                React.createElement(StyledIcon, { glyph: Icon.GLYPHS.playStory, light: true, styledWidth: "20px" })),
            React.createElement(Spacing, { right: 1 }),
            React.createElement(SharePanel, { storyShare: true, btnDisabled: this.state.editingMode || !hasStories, terria: this.props.viewState.terria, viewState: this.props.viewState, modalWidth: ((_a = this.props.widthFromMeasureElementHOC) !== null && _a !== void 0 ? _a : 100) - 22, onUserClick: this.toggleSharePanel })));
    }
    openMenu(storyId) {
        this.setState({
            storyWithOpenMenuId: storyId
        });
    }
    renderStories(editingMode) {
        const { t, i18n } = this.props;
        const stories = this.props.viewState.terria.stories || [];
        const storyName = this.state.storyToRemove
            ? this.state.storyToRemove.title.length
                ? this.state.storyToRemove.title
                : t("story.untitledScene")
            : "";
        return (React.createElement(Box, { displayInlineBlock: true },
            React.createElement(BadgeBar, { label: t("story.badgeBarLabel"), badge: this.props.viewState.terria.stories.length },
                React.createElement(RawButton, { type: "button", onClick: this.toggleRemoveDialog, textLight: true, className: Styles.removeButton },
                    React.createElement(Icon, { glyph: Icon.GLYPHS.remove }),
                    " ",
                    t("story.removeAllStories"))),
            React.createElement(Spacing, { bottom: 2 }),
            React.createElement(Box, { column: true, paddedHorizontally: 2 },
                this.state.isRemoving && (React.createElement(RemoveDialog, { theme: this.props.theme, text: this.state.storyToRemove ? (React.createElement(Text, { textLight: true, large: true },
                        React.createElement(Trans, { i18nKey: "story.removeStoryDialog", i18n: i18n },
                            "Are you sure you wish to delete",
                            React.createElement(TextSpan, { textLight: true, large: true, bold: true }, { storyName }),
                            "?"))) : (React.createElement(Text, { textLight: true, large: true }, t("story.removeAllStoriesDialog", {
                        count: this.props.viewState.terria.stories.length
                    }))), onConfirm: this.removeAction, closeDialog: this.toggleRemoveDialog })),
                React.createElement(Box, { column: true, position: "static", css: `
              ${(this.state.isRemoving || this.state.isSharing) &&
                        `opacity: 0.3`}
            ` },
                    React.createElement(Box, { column: true, scroll: true, overflowY: "auto", styledMaxHeight: "calc(100vh - 283px)", position: "static", ref: this.storiesWrapperRef, css: `
                margin-right: -10px;
              ` },
                        React.createElement(Sortable, { onSort: this.onSort, direction: "vertical", dynamic: true, css: `
                  position: static;
                  margin-right: 10px;
                ` }, stories.map((story, index) => (React.createElement(Story, { key: `${story.id}`, story: story, sortData: story, deleteStory: () => this.removeStory(index, story), recaptureStory: () => this.recaptureScene(story), recaptureStorySuccessful: Boolean(story.id === this.state.recaptureSuccessId), viewStory: () => this.viewStory(index), menuOpen: this.state.storyWithOpenMenuId === story.id, openMenu: () => this.openMenu(story.id), closeMenu: () => this.openMenu(undefined), editStory: () => this.editStory(story), parentRef: this.storiesWrapperRef }))))),
                    React.createElement(Spacing, { bottom: 2 }),
                    React.createElement(CaptureScene, { disabled: this.state.isRemoving, onClickCapture: this.onClickCapture })),
                React.createElement(Spacing, { bottom: 2 }))));
    }
    render() {
        const { t } = this.props;
        const hasStories = this.props.viewState.terria.stories.length > 0;
        return (React.createElement(Panel, { ref: (component) => (this.refToMeasure = component), isVisible: this.props.isVisible, isHidden: !this.props.isVisible, styledWidth: "320px", styledMinWidth: "320px", charcoalGreyBg: true, column: true },
            React.createElement(Box, { right: true },
                React.createElement(RawButton, { css: `
              padding: 15px;
            `, onClick: this.hideStoryBuilder },
                    React.createElement(StyledIcon, { styledWidth: "16px", fillColor: this.props.theme.textLightDimmed, opacity: 0.5, glyph: Icon.GLYPHS.closeLight }))),
            React.createElement(Box, { centered: true, paddedHorizontally: 2, displayInlineBlock: true },
                React.createElement(Text, { bold: true, extraExtraLarge: true, textLight: true }, t("story.panelTitle")),
                React.createElement(Spacing, { bottom: 2 }),
                React.createElement(Text, { medium: true, color: this.props.theme.textLightDimmed, highlightLinks: true }, t("story.panelBody")),
                React.createElement(Spacing, { bottom: 3 }),
                !hasStories && this.renderIntro(),
                hasStories && this.renderPlayShare(hasStories)),
            React.createElement(Spacing, { bottom: 2 }),
            hasStories && this.renderStories(this.state.editingMode),
            this.state.editingMode && (React.createElement(StoryEditor, { removeStory: this.removeStory, exitEditingMode: () => this.setState({ editingMode: false }), story: this.state.currentStory, saveStory: this.onSave, terria: this.props.viewState.terria }))));
    }
};
__decorate([
    action.bound
], StoryBuilder.prototype, "removeAction", null);
__decorate([
    action.bound
], StoryBuilder.prototype, "removeAllStories", null);
__decorate([
    action.bound
], StoryBuilder.prototype, "onSave", null);
__decorate([
    action
], StoryBuilder.prototype, "captureStory", null);
__decorate([
    action
], StoryBuilder.prototype, "recaptureScene", null);
__decorate([
    action
], StoryBuilder.prototype, "editStory", null);
__decorate([
    action
], StoryBuilder.prototype, "viewStory", null);
__decorate([
    action.bound
], StoryBuilder.prototype, "onSort", null);
StoryBuilder = __decorate([
    observer
], StoryBuilder);
const Panel = styled(Box) `
  transition: all 0.25s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  ${(props) => props.isVisible &&
    `
    visibility: visible;
    margin-right: 0;
  `}
  ${(props) => props.isHidden &&
    `
    visibility: hidden;
    margin-right: -${props.styledWidth ? props.styledWidth : "320px"};
  `}
`;
const CaptureScene = (props) => {
    const { t } = useTranslation();
    return (React.createElement(StoryButton, { title: t("story.captureSceneTitle"), btnText: t("story.captureScene"), onClick: props.onClickCapture, disabled: props.disabled, fullWidth: true },
        React.createElement(StyledIcon, { glyph: Icon.GLYPHS.story, light: true, styledWidth: "20px" })));
};
export const StoryButton = (props) => {
    const { btnText, ...rest } = props;
    return (React.createElement(Button, Object.assign({ primary: true, renderIcon: props.children && (() => props.children), textProps: {
            large: true
        } }, rest), btnText ? btnText : ""));
};
const RemoveDialog = (props) => {
    const { t } = useTranslation();
    return (React.createElement(Box, { backgroundColor: props.theme.darkWithOverlay, position: "absolute", rounded: true, paddedVertically: 3, paddedHorizontally: 2, column: true, css: `
        width: calc(100% - 20px);
      ` },
        props.text,
        React.createElement(Spacing, { bottom: 2 }),
        React.createElement(Box, null,
            React.createElement(Button, { denyButton: true, rounded: true, fullWidth: true, textProps: {
                    large: true,
                    semiBold: true
                }, onClick: props.closeDialog }, t("general.cancel")),
            React.createElement(Spacing, { right: 2 }),
            React.createElement(Button, { primary: true, fullWidth: true, textProps: {
                    large: true,
                    semiBold: true
                }, onClick: () => {
                    props.onConfirm();
                    props.closeDialog();
                } }, t("general.confirm")))));
};
export default withViewState(withTranslation()(withTheme(measureElement(StoryBuilder))));
//# sourceMappingURL=StoryBuilder.js.map
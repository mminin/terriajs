import createReactClass from "create-react-class";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import Sortable from "react-anything-sortable";
import { Trans, useTranslation, withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import combine from "terriajs-cesium/Source/Core/combine";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import defined from "terriajs-cesium/Source/Core/defined";
import dataStoriesImg from "../../../wwwroot/images/data-stories-getting-started.jpg";
import triggerResize from "../../Core/triggerResize";
import Box from "../../Styled/Box";
import Button, { RawButton } from "../../Styled/Button";
import Spacing from "../../Styled/Spacing";
import Text, { TextSpan } from "../../Styled/Text";
import BadgeBar from "../BadgeBar";
import measureElement from "../HOCs/measureElement";
import Icon, { StyledIcon } from "../../Styled/Icon";
import VideoGuide from "../Map/Panels/HelpPanel/VideoGuide";
import { getShareData } from "../Map/Panels/SharePanel/BuildShareLink";
import SharePanel from "../Map/Panels/SharePanel/SharePanel.jsx";
import Styles from "./story-builder.scss";
import Story from "./Story";
import StoryEditor from "./StoryEditor.jsx";
import { Category, StoryAction } from "../../Core/AnalyticEvents/analyticEvents";
const STORY_VIDEO = "storyVideo";
const StoryBuilder = observer(createReactClass({
    displayName: "StoryBuilder",
    storiesWrapperRef: React.createRef(),
    propTypes: {
        terria: PropTypes.object.isRequired,
        isVisible: PropTypes.bool,
        viewState: PropTypes.object.isRequired,
        animationDuration: PropTypes.number,
        widthFromMeasureElementHOC: PropTypes.number,
        theme: PropTypes.object.isRequired,
        t: PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            editingMode: false,
            currentStory: undefined,
            recaptureSuccessful: undefined,
            showVideoGuide: false,
            videoGuideVisible: false,
            isRemoving: false,
            isSharing: false,
            storyToRemove: undefined,
            storyRemoveIndex: undefined
        };
    },
    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    },
    closePopup() {
        this.setState({
            showPopup: false
        });
    },
    removeStory(index, story) {
        this.setState({
            isSharing: false,
            isRemoving: true,
            storyToRemove: story,
            storyRemoveIndex: index
        });
    },
    removeAction() {
        if (this.state.storyToRemove) {
            runInAction(() => {
                this.props.terria.stories = this.props.terria.stories.filter(st => st.id !== this.state.storyToRemove.id);
                if (this.state.index < this.props.viewState.currentStoryId) {
                    this.props.viewState.currentStoryId -= 1;
                }
            });
        }
        else {
            this.removeAllStories();
        }
        this.setState({
            storyToRemove: undefined,
            storyRemoveIndex: undefined
        });
    },
    toggleRemoveDialog() {
        this.setState({
            isSharing: false,
            isRemoving: !this.state.isRemoving,
            storyToRemove: undefined,
            storyRemoveIndex: undefined
        });
    },
    removeAllStories() {
        runInAction(() => {
            this.props.terria.stories = [];
        });
        this.togglePopup();
    },
    onSave(_story) {
        var _a;
        const story = {
            title: _story.title,
            text: _story.text,
            id: _story.id ? _story.id : createGuid()
        };
        (_a = this.props.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.story, StoryAction.saveStory, JSON.stringify(story));
        const storyIndex = (this.props.terria.stories || [])
            .map(story => story.id)
            .indexOf(_story.id);
        if (storyIndex >= 0) {
            const oldStory = this.props.terria.stories[storyIndex];
            // replace the old story, we need to replace the stories array so that
            // it is observable
            runInAction(() => {
                this.props.terria.stories = [
                    ...this.props.terria.stories.slice(0, storyIndex),
                    combine(story, oldStory),
                    ...this.props.terria.stories.slice(storyIndex + 1)
                ];
            });
        }
        else {
            this.captureStory(story);
        }
        this.setState({
            editingMode: false
        });
    },
    captureStory(story) {
        story.shareData = JSON.parse(JSON.stringify(getShareData(this.props.terria, this.props.viewState, {
            includeStories: false
        })));
        runInAction(() => {
            if (this.props.terria.stories === undefined) {
                this.props.terria.stories = [story];
            }
            else {
                this.props.terria.stories.push(story);
            }
        });
    },
    recaptureScene(story) {
        this.closeShareRemoving();
        const { t } = this.props;
        clearTimeout(this.resetReCaptureStatus);
        const storyIndex = (this.props.terria.stories || [])
            .map(story => story.id)
            .indexOf(story.id);
        if (storyIndex >= 0) {
            story.shareData = JSON.parse(JSON.stringify(getShareData(this.props.terria, this.props.viewState, {
                includeStories: false
            })));
            runInAction(() => {
                this.props.terria.stories = [
                    ...this.props.terria.stories.slice(0, storyIndex),
                    story,
                    ...this.props.terria.stories.slice(storyIndex + 1)
                ];
            });
            this.setState({
                recaptureSuccessful: story.id
            });
            setTimeout(this.resetReCaptureStatus, 2000);
        }
        else {
            throw new Error(t("story.doesNotExist"));
        }
    },
    resetReCaptureStatus() {
        this.setState({
            recaptureSuccessful: undefined
        });
    },
    closeShareRemoving() {
        this.setState({
            isRemoving: false,
            isSharing: false
        });
    },
    runStories() {
        var _a;
        this.closeShareRemoving();
        runInAction(() => {
            this.props.viewState.storyBuilderShown = false;
            this.props.viewState.storyShown = true;
        });
        setTimeout(function () {
            triggerResize();
        }, this.props.animationDuration || 1);
        this.props.terria.currentViewer.notifyRepaintRequired();
        (_a = this.props.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.story, StoryAction.runStory);
    },
    editStory(story) {
        this.closeShareRemoving();
        runInAction(() => {
            this.props.viewState.storyBuilderShow = true;
            this.props.viewState.storyShown = false;
        });
        this.setState({
            editingMode: true,
            currentStory: story
        });
    },
    viewStory(index, story) {
        this.closeShareRemoving();
        runInAction(() => {
            this.props.viewState.currentStoryId = index;
        });
        this.runStories();
    },
    onSort(sortedArray, currentDraggingSortData, currentDraggingIndex) {
        runInAction(() => {
            this.props.terria.stories = sortedArray;
        });
    },
    componentWillUnmount() {
        clearTimeout(this.resetReCaptureStatus);
    },
    renderIntro() {
        const { t } = this.props;
        return (React.createElement(Box, { column: true },
            React.createElement(VideoGuide
            /*
          // @ts-ignore */
            , { 
                /*
              // @ts-ignore */
                viewState: this.props.viewState, videoLink: "https://www.youtube-nocookie.com/embed/fbiQawV8IYY", background: dataStoriesImg, videoName: STORY_VIDEO }),
            React.createElement(StoryButton, { title: t("story.gettingStartedTitle"), btnText: t("story.gettingStarted"), onClick: () => {
                    this.props.viewState.setVideoGuideVisible(STORY_VIDEO);
                } },
                React.createElement(StyledIcon, { glyph: Icon.GLYPHS.play, light: true, styledWidth: "20px" })),
            React.createElement(Spacing, { bottom: 2 }),
            React.createElement(CaptureScene, { disabled: this.state.isRemoving, t: t, onClickCapture: this.onClickCapture })));
    },
    toggleSharePanel() {
        this.setState({
            isRemoving: false,
            isSharing: !this.state.isSharing
        });
    },
    renderPlayShare(hasStories) {
        const { t } = this.props;
        return (React.createElement(Box, { justifySpaceBetween: true },
            React.createElement(StoryButton, { fullWidth: true, disabled: this.state.editingMode || !hasStories, title: t("story.preview"), btnText: t("story.play"), onClick: this.runStories },
                React.createElement(StyledIcon, { glyph: Icon.GLYPHS.play, light: true, styledWidth: "20px" })),
            React.createElement(Spacing, { right: 1 }),
            React.createElement(SharePanel, { storyShare: true, btnDisabled: this.state.editingMode || !hasStories, terria: this.props.terria, viewState: this.props.viewState, modalWidth: this.props.widthFromMeasureElementHOC - 22, onUserClick: this.toggleSharePanel })));
    },
    openMenu(story) {
        this.setState({
            storyWithOpenMenu: story
        });
    },
    renderStories(editingMode) {
        const { t } = this.props;
        const stories = this.props.terria.stories || [];
        const storyName = this.state.storyToRemove
            ? this.state.storyToRemove.title.length
                ? this.state.storyToRemove.title
                : t("story.untitledScene")
            : "";
        return (React.createElement(Box, { displayInlineBlock: true },
            React.createElement(BadgeBar, { label: t("story.badgeBarLabel"), badge: this.props.terria.stories.length },
                React.createElement(RawButton, { type: "button", onClick: this.toggleRemoveDialog, className: Styles.removeButton },
                    React.createElement(Icon, { glyph: Icon.GLYPHS.remove }),
                    " ",
                    t("story.removeAllStories"))),
            React.createElement(Spacing, { bottom: 2 }),
            React.createElement(Box, { column: true, paddedHorizontally: 2 },
                this.state.isRemoving && (React.createElement(RemoveDialog, { theme: this.props.theme, text: this.state.storyToRemove ? (React.createElement(Text, { textLight: true, large: true },
                        React.createElement(Trans, { i18nKey: "story.removeStoryDialog", storyName: storyName },
                            "Are you sure you wish to delete",
                            React.createElement(TextSpan, { textLight: true, large: true, bold: true }, { storyName }),
                            "?"))) : (React.createElement(Text, { textLight: true, large: true }, t("story.removeAllStoriesDialog", {
                        count: this.props.terria.stories.length
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
                  ` },
                            React.createElement(For, { each: "story", index: "index", of: stories },
                                React.createElement(Story, { key: `${story.id}`, story: story, sortData: story, deleteStory: () => this.removeStory(index, story), recaptureStory: () => this.recaptureScene(story), recaptureStorySuccessful: Boolean(story.id === this.state.recaptureSuccessful), viewStory: () => this.viewStory(index), menuOpen: this.state.storyWithOpenMenu === story, openMenu: () => this.openMenu(story), closeMenu: () => this.openMenu(null), editStory: () => this.editStory(story), parentRef: this.storiesWrapperRef })))),
                    React.createElement(Spacing, { bottom: 2 }),
                    React.createElement(CaptureScene, { disabled: this.state.isRemoving, t: t, onClickCapture: this.onClickCapture })),
                React.createElement(Spacing, { bottom: 2 }))));
    },
    onClickCapture() {
        this.setState({
            editingMode: true,
            currentStory: undefined
        });
    },
    hideStoryBuilder() {
        this.props.viewState.toggleStoryBuilder();
        this.props.terria.currentViewer.notifyRepaintRequired();
        // Allow any animations to finish, then trigger a resize.
        setTimeout(function () {
            triggerResize();
        }, this.props.animationDuration || 1);
        this.props.viewState.toggleFeaturePrompt("story", false, true);
    },
    render() {
        const { t } = this.props;
        const hasStories = defined(this.props.terria.stories) &&
            this.props.terria.stories.length > 0;
        return (React.createElement(Panel, { ref: component => (this.refToMeasure = component), isVisible: this.props.isVisible, isHidden: !this.props.isVisible, styledWidth: "320px", styledMinWidth: "320px", charcoalGreyBg: true, column: true },
            React.createElement(Box, { right: true },
                React.createElement(RawButton, { css: `
                padding: 15px;
              `, onClick: this.hideStoryBuilder },
                    React.createElement(StyledIcon, { styledWidth: "16px", fillColor: this.props.theme.textLightDimmed, opacity: "0.5", glyph: Icon.GLYPHS.closeLight }))),
            React.createElement(Box, { centered: true, paddedHorizontally: 2, displayInlineBlock: true },
                React.createElement(Text, { bold: true, extraExtraLarge: true, textLight: true }, t("story.panelTitle")),
                React.createElement(Spacing, { bottom: 2 }),
                React.createElement(Text, { medium: true, color: this.props.theme.textLightDimmed, highlightLinks: true }, t("story.panelBody")),
                React.createElement(Spacing, { bottom: 3 }),
                !hasStories && this.renderIntro(),
                hasStories && this.renderPlayShare(hasStories)),
            React.createElement(Spacing, { bottom: 2 }),
            hasStories && this.renderStories(this.state.editingMode),
            this.state.editingMode && (React.createElement(StoryEditor, { removeStory: this.removeStory, exitEditingMode: () => this.setState({ editingMode: false }), story: this.state.currentStory, saveStory: this.onSave }))));
    }
}));
const Panel = styled(Box) `
  transition: all 0.25s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  ${props => props.isVisible &&
    `
    visibility: visible;
    margin-right: 0;
  `}
  ${props => props.isHidden &&
    `
    visibility: hidden;
    margin-right: -${props.styledWidth ? props.styledWidth : "320px"};
  `}
`;
const CaptureScene = props => {
    const { t } = props;
    return (React.createElement(StoryButton, { title: t("story.captureSceneTitle"), btnText: t("story.captureScene"), onClick: props.onClickCapture, disabled: props.disabled, fullWidth: true },
        React.createElement(StyledIcon, { glyph: Icon.GLYPHS.story, light: true, styledWidth: "20px" })));
};
CaptureScene.propTypes = {
    t: PropTypes.func.isRequired,
    onClickCapture: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};
export const StoryButton = props => {
    const { btnText, ...rest } = props;
    return (React.createElement(Button, Object.assign({ primary: true, renderIcon: props.children && (() => props.children), textProps: {
            large: true
        } }, rest), btnText ? btnText : ""));
};
StoryButton.defaultName = "StoryButton";
StoryButton.propTypes = {
    btnText: PropTypes.string,
    children: PropTypes.node
};
const RemoveDialog = props => {
    const { t } = useTranslation();
    return (React.createElement(Box, { backgroundColor: props.theme.darkWithOverlay, position: "absolute", rounded: true, paddedVertically: 3, paddedHorizontally: 2, column: true, css: `
        width: calc(100% - 20px);
      ` },
        props.text,
        React.createElement(Spacing, { bottom: 2 }),
        React.createElement(Box, { row: true },
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
RemoveDialog.defaultName = "RemoveDialog";
RemoveDialog.propTypes = {
    theme: PropTypes.object.isRequired,
    text: PropTypes.element.isRequired,
    onConfirm: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired
};
export default withTranslation()(withTheme(measureElement(StoryBuilder)));
//# sourceMappingURL=StoryBuilder.js.map
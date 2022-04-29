import classNames from "classnames";
import createReactClass from "create-react-class";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import { Swipeable } from "react-swipeable";
import { Category, StoryAction } from "../../Core/AnalyticEvents/analyticEvents";
import getPath from "../../Core/getPath";
import TerriaError from "../../Core/TerriaError";
import Icon from "../../Styled/Icon";
import parseCustomHtmlToReact from "../Custom/parseCustomHtmlToReact";
import { Medium, Small } from "../Generic/Responsive";
import Styles from "./story-panel.scss";
/**
 *
 * @param {any} story
 * @param {Terria} terria
 */
export async function activateStory(scene, terria) {
    var _a, _b;
    (_a = terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.story, StoryAction.viewScene, JSON.stringify(scene));
    if (scene.shareData) {
        const errors = [];
        await Promise.all(scene.shareData.initSources.map(async (initSource) => {
            try {
                await terria.applyInitData({
                    initData: initSource,
                    replaceStratum: true,
                    canUnsetFeaturePickingState: true
                });
            }
            catch (e) {
                errors.push(TerriaError.from(e));
            }
        }));
        if (errors.length > 0) {
            terria.raiseErrorToUser(TerriaError.combine(errors, {
                title: { key: "story.loadSceneErrorTitle" },
                message: {
                    key: "story.loadSceneErrorMessage",
                    parameters: { title: (_b = scene.title) !== null && _b !== void 0 ? _b : scene.id }
                }
            }));
        }
    }
    terria.workbench.items.forEach(item => {
        var _a;
        (_a = terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.story, StoryAction.datasetView, getPath(item));
    });
}
const StoryPanel = observer(createReactClass({
    displayName: "StoryPanel",
    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        t: PropTypes.func.isRequired
    },
    slideInTimer: null,
    slideOutTimer: null,
    escKeyListener: null,
    getInitialState() {
        return {
            inView: false
        };
    },
    /* eslint-disable-next-line camelcase */
    UNSAFE_componentWillMount() {
        const stories = this.props.terria.stories || [];
        if (this.props.viewState.currentStoryId > stories.length - 1 ||
            this.props.viewState.currentStoryId < 0) {
            this.props.viewState.currentStoryId = 0;
        }
        this.activateStory(stories[this.props.viewState.currentStoryId]);
    },
    componentDidMount() {
        this.slideIn();
        this.escKeyListener = e => {
            if (e.keyCode === 27) {
                this.exitStory();
            }
        };
        window.addEventListener("keydown", this.escKeyListener, true);
    },
    slideIn() {
        this.slideInTimer = setTimeout(() => {
            this.setState({
                inView: true
            });
        }, 300);
    },
    slideOut() {
        this.slideOutTimer = this.setState({
            inView: false
        });
        setTimeout(() => {
            this.exitStory();
        }, 300);
    },
    onClickContainer() {
        runInAction(() => {
            this.props.viewState.topElement = "StoryPanel";
        });
    },
    componentWillUnmount() {
        window.removeEventListener("keydown", this.escKeyListener, false);
        clearTimeout(this.slideInTimer);
        if (this.slideOutTimer) {
            clearTimeout(this.slideOutTimer);
        }
    },
    navigateStory(index) {
        if (index < 0) {
            index = this.props.terria.stories.length - 1;
        }
        else if (index >= this.props.terria.stories.length) {
            index = 0;
        }
        if (index !== this.props.viewState.currentStoryId) {
            runInAction(() => {
                this.props.viewState.currentStoryId = index;
            });
            if (index < (this.props.terria.stories || []).length) {
                this.activateStory(this.props.terria.stories[index]);
            }
        }
    },
    // This is in StoryPanel and StoryBuilder
    activateStory(_story) {
        const story = _story ? _story : this.props.terria.stories[0];
        activateStory(story, this.props.terria);
    },
    onCenterScene(story) {
        activateStory(story, this.props.terria);
    },
    goToPrevStory() {
        this.navigateStory(this.props.viewState.currentStoryId - 1);
    },
    goToNextStory() {
        this.navigateStory(this.props.viewState.currentStoryId + 1);
    },
    exitStory() {
        runInAction(() => {
            this.props.viewState.storyShown = false;
        });
        this.props.terria.currentViewer.notifyRepaintRequired();
    },
    render() {
        const { t } = this.props;
        const stories = this.props.terria.stories || [];
        const story = stories[this.props.viewState.currentStoryId];
        const locationBtn = (React.createElement("button", { className: Styles.locationBtn, title: t("story.locationBtn"), onClick: this.onCenterScene.bind(this, story) },
            React.createElement(Icon, { glyph: Icon.GLYPHS.location })));
        const exitBtn = (React.createElement("button", { className: Styles.exitBtn, title: t("story.exitBtn"), onClick: this.slideOut },
            React.createElement(Icon, { glyph: Icon.GLYPHS.close })));
        return (React.createElement(Swipeable, { onSwipedLeft: this.goToNextStory, onSwipedRight: this.goToPrevStory },
            React.createElement("div", { className: classNames(Styles.fullPanel, {
                    [Styles.isHidden]: !this.props.viewState.storyShown,
                    [Styles.isPushedUp]: this.props.viewState.chartIsOpen,
                    [Styles.isCentered]: this.props.viewState.isMapFullScreen
                }, this.props.viewState.topElement === "StoryPanel"
                    ? "top-element"
                    : ""), onClick: this.onClickContainer },
                React.createElement("div", { className: classNames(Styles.storyContainer, {
                        [Styles.isMounted]: this.state.inView
                    }), key: story.id },
                    React.createElement(Medium, null,
                        React.createElement("div", { className: Styles.left },
                            locationBtn,
                            React.createElement("button", { className: Styles.previousBtn, disabled: this.props.terria.stories.length <= 1, title: t("story.previousBtn"), onClick: this.goToPrevStory },
                                React.createElement(Icon, { glyph: Icon.GLYPHS.left })))),
                    React.createElement("div", { className: Styles.story },
                        React.createElement("div", { className: Styles.storyHeader },
                            React.createElement(Small, null, locationBtn),
                            story.title && story.title.length > 0 ? (React.createElement("h3", null, story.title)) : (React.createElement("h3", null,
                                " ",
                                t("story.untitled"),
                                " ")),
                            React.createElement(Small, null, exitBtn),
                            React.createElement(If, { condition: this.props.terria.stories.length >= 2 },
                                React.createElement(Medium, null,
                                    React.createElement("div", { className: Styles.navBtn },
                                        " ",
                                        stories.map((story, i) => (React.createElement("button", { title: t("story.navBtn", { title: story.title }), type: "button", key: story.id, onClick: () => this.navigateStory(i) },
                                            " ",
                                            React.createElement(Icon, { glyph: i === this.props.viewState.currentStoryId
                                                    ? Icon.GLYPHS.circleFull
                                                    : Icon.GLYPHS.circleEmpty })))))))),
                        story.text && (React.createElement("div", { className: Styles.body }, parseCustomHtmlToReact(story.text)))),
                    React.createElement(Medium, null,
                        React.createElement("div", { className: Styles.right },
                            exitBtn,
                            React.createElement("button", { disabled: this.props.terria.stories.length <= 1, className: Styles.nextBtn, title: t("story.nextBtn"), onClick: this.goToNextStory },
                                React.createElement(Icon, { glyph: Icon.GLYPHS.right })))),
                    React.createElement(Small, null,
                        React.createElement("div", { className: Styles.navBtnMobile },
                            " ",
                            stories.map((story, i) => (React.createElement("button", { title: t("story.navBtnMobile", { title: story.title }), type: "button", key: story.id, className: classNames(Styles.mobileNavBtn, {
                                    [Styles.isActive]: i === this.props.viewState.currentStoryId
                                }), onClick: () => this.navigateStory(i) }, i)))))))));
    }
}));
export default withTranslation()(StoryPanel);
//# sourceMappingURL=StoryPanel.js.map
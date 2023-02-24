var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import classNames from "classnames";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import { Swipeable } from "react-swipeable";
import { withTheme } from "styled-components";
import { Category, StoryAction } from "../../../Core/AnalyticEvents/analyticEvents";
import { animateEnd } from "../../../Core/animation";
import getPath from "../../../Core/getPath";
import TerriaError from "../../../Core/TerriaError";
import Box from "../../../Styled/Box";
import Hr from "../../../Styled/Hr";
import { onStoryButtonClick } from "../../Map/StoryButton/StoryButton";
import { withViewState } from "../../StandardUserInterface/ViewStateContext";
import Styles from "../story-panel.scss";
import StoryBody from "./StoryBody";
import FooterBar from "./StoryFooterBar";
import TitleBar from "./TitleBar";
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
    terria.workbench.items.forEach((item) => {
        var _a;
        (_a = terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.story, StoryAction.datasetView, getPath(item));
    });
}
let StoryPanel = class StoryPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: false,
            inView: false
        };
        this.slideRef = React.createRef();
    }
    componentDidMount() {
        const stories = this.props.viewState.terria.stories || [];
        if (this.props.viewState.currentStoryId > stories.length - 1 ||
            this.props.viewState.currentStoryId < 0) {
            this.props.viewState.currentStoryId = 0;
        }
        this.activateStory(stories[this.props.viewState.currentStoryId]);
        this.slideIn();
        this.keydownListener = (e) => {
            // Use else if for keydown events so only first one is recognised in case of multiple key presses
            if (e.key === "Escape") {
                this.exitStory();
            }
            else if (e.key === "ArrowRight" ||
                e.key === "ArrowDown") {
                this.props.viewState.currentStoryId + 1 != stories.length &&
                    this.goToNextStory();
            }
            else if (e.key === "ArrowLeft" ||
                e.key === "ArrowUp") {
                this.props.viewState.currentStoryId != 0 && this.goToPrevStory();
            }
        };
        window.addEventListener("keydown", this.keydownListener, true);
    }
    slideIn() {
        this.setState({
            inView: true
        });
    }
    slideOut() {
        this.setState({
            inView: false
        });
    }
    toggleCollapse() {
        this.setState({
            isCollapsed: !this.state.isCollapsed
        });
    }
    onClickContainer() {
        runInAction(() => {
            this.props.viewState.topElement = "StoryPanel";
        });
    }
    componentWillUnmount() {
        if (this.keydownListener) {
            window.removeEventListener("keydown", this.keydownListener, true);
        }
    }
    navigateStory(index) {
        if (index < 0) {
            index = this.props.viewState.terria.stories.length - 1;
        }
        else if (index >= this.props.viewState.terria.stories.length) {
            index = 0;
        }
        if (index !== this.props.viewState.currentStoryId) {
            runInAction(() => {
                this.props.viewState.currentStoryId = index;
            });
            if (index < (this.props.viewState.terria.stories || []).length) {
                this.activateStory(this.props.viewState.terria.stories[index]);
            }
        }
    }
    // This is in StoryPanel and StoryBuilder
    activateStory(_story) {
        const story = _story ? _story : this.props.viewState.terria.stories[0];
        activateStory(story, this.props.viewState.terria);
    }
    onCenterScene(story) {
        activateStory(story, this.props.viewState.terria);
    }
    goToPrevStory() {
        this.navigateStory(this.props.viewState.currentStoryId - 1);
    }
    goToNextStory() {
        this.navigateStory(this.props.viewState.currentStoryId + 1);
    }
    exitStory() {
        animateEnd(this.slideRef.current).finally(() => {
            runInAction(() => {
                this.props.viewState.storyShown = false;
            });
            this.props.viewState.terria.currentViewer.notifyRepaintRequired();
        });
        this.slideOut();
    }
    render() {
        const stories = this.props.viewState.terria.stories || [];
        const story = stories[this.props.viewState.currentStoryId];
        return (React.createElement(Swipeable, { onSwipedLeft: () => this.goToNextStory(), onSwipedRight: () => this.goToPrevStory() },
            React.createElement(Box, { className: classNames(this.props.viewState.topElement === "StoryPanel"
                    ? "top-element"
                    : ""), centered: true, fullWidth: true, paddedHorizontally: 4, position: "absolute", onClick: () => this.onClickContainer(), css: `
            transition: padding, 0.2s;
            bottom: 80px;
            pointer-events: none;
            ${!this.props.viewState.storyShown && "display: none;"}
            @media (min-width: 992px) {
              ${this.props.viewState.isMapFullScreen &&
                    `
                transition-delay: 0.5s;
              `}
              ${!this.props.viewState.isMapFullScreen &&
                    `
                padding-left: calc(30px + ${this.props.theme.workbenchWidth}px);
                padding-right: 50px;
              `}
              bottom: 90px;
            }
          ` },
                React.createElement(Box, { column: true, rounded: true, className: classNames(Styles.storyContainer, {
                        [Styles.isMounted]: this.state.inView
                    }), key: story.id, ref: this.slideRef, css: `
              @media (min-width: 992px) {
                max-width: 60vw;
              }
            ` },
                    React.createElement(Box, { paddedHorizontally: 3, paddedVertically: 2.4, column: true },
                        React.createElement(TitleBar, { title: story.title, isCollapsed: this.state.isCollapsed, collapseHandler: () => this.toggleCollapse(), closeHandler: () => this.exitStory() }),
                        React.createElement(StoryBody, { isCollapsed: this.state.isCollapsed, story: story })),
                    React.createElement(Hr, { fullWidth: true, size: 1, borderBottomColor: this.props.theme.greyLighter }),
                    React.createElement(Box, { paddedHorizontally: 3, fullWidth: true },
                        React.createElement(FooterBar, { goPrev: () => this.goToPrevStory(), goNext: () => this.goToNextStory(), jumpToStory: (index) => this.navigateStory(index), zoomTo: () => this.onCenterScene(story), currentHumanIndex: this.props.viewState.currentStoryId + 1, totalStories: stories.length, listStories: () => {
                                runInAction(() => {
                                    this.props.viewState.storyShown = false;
                                });
                                onStoryButtonClick({
                                    terria: this.props.viewState.terria,
                                    theme: this.props.theme,
                                    viewState: this.props.viewState,
                                    animationDuration: 250
                                })();
                            } }))))));
    }
};
StoryPanel = __decorate([
    observer
], StoryPanel);
export default withTranslation()(withViewState(withTheme(StoryPanel)));
//# sourceMappingURL=StoryPanel.js.map
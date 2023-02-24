var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Trans, useTranslation, withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import Box from "../../Styled/Box";
import Button, { RawButton } from "../../Styled/Button";
import Icon, { StyledIcon } from "../../Styled/Icon";
import Spacing from "../../Styled/Spacing";
import Text, { TextSpan } from "../../Styled/Text";
import { ExplorerWindowElementName } from "../ExplorerWindow/ExplorerWindow";
import { useKeyPress } from "../Hooks/useKeyPress.js";
import VideoGuide from "../Map/Panels/HelpPanel/VideoGuide";
import { withViewState } from "../StandardUserInterface/ViewStateContext";
import { TourPortalDisplayName } from "../Tour/TourPortal";
import FadeIn from "../Transitions/FadeIn/FadeIn";
import SlideUpFadeIn from "../Transitions/SlideUpFadeIn/SlideUpFadeIn";
export const WELCOME_MESSAGE_NAME = "welcomeMessage";
export const LOCAL_PROPERTY_KEY = `${WELCOME_MESSAGE_NAME}Prompted`;
const WELCOME_MESSAGE_VIDEO = "welcomeMessageVideo";
const WelcomeModalWrapper = styled(Box) `
  z-index: 99999;
  background-color: rgba(0, 0, 0, 0.75);
`;
function WelcomeMessageButton(props) {
    return (React.createElement(Button, { primary: true, rounded: true, fullWidth: true, onClick: props.onClick },
        React.createElement(Box, { centered: true },
            props.buttonIcon && (React.createElement(StyledIcon, { light: true, styledWidth: "22px", glyph: props.buttonIcon })),
            React.createElement(Spacing, { right: 2 }),
            props.buttonText && (React.createElement(TextSpan, { textLight: true, extraLarge: true }, props.buttonText)))));
}
WelcomeMessageButton.propTypes = {
    buttonText: PropTypes.string,
    buttonIcon: PropTypes.object,
    onClick: PropTypes.func
};
let WelcomeMessage = class WelcomeMessage extends React.Component {
    constructor(props) {
        super(props);
        const viewState = this.props.viewState;
        const shouldShow = (viewState.terria.configParameters.showWelcomeMessage &&
            !viewState.terria.getLocalProperty(LOCAL_PROPERTY_KEY)) ||
            false;
        this.props.viewState.setShowWelcomeMessage(shouldShow);
    }
    render() {
        const viewState = this.props.viewState || {};
        return (React.createElement(WelcomeMessagePure, { showWelcomeMessage: viewState.showWelcomeMessage, setShowWelcomeMessage: (bool) => this.props.viewState.setShowWelcomeMessage(bool), isTopElement: this.props.viewState.topElement === "WelcomeMessage", viewState: this.props.viewState }));
    }
};
WelcomeMessage.displayName = "WelcomeMessage";
WelcomeMessage.propTypes = {
    viewState: PropTypes.object,
    theme: PropTypes.object,
    t: PropTypes.func.isRequired
};
WelcomeMessage = __decorate([
    observer
], WelcomeMessage);
export const WelcomeMessagePure = (props) => {
    const { showWelcomeMessage, setShowWelcomeMessage, viewState } = props;
    const { t } = useTranslation();
    // This is required so we can do nested animations
    const [welcomeVisible, setWelcomeVisible] = useState(showWelcomeMessage);
    const [shouldTakeTour, setShouldTakeTour] = useState(false);
    const [shouldExploreData, setShouldExploreData] = useState(false);
    const [shouldOpenHelp, setShouldOpenHelp] = useState(false);
    const [shouldOpenSearch, setShouldOpenSearch] = useState(false);
    // const {
    //   WelcomeMessagePrimaryBtnClick,
    //   WelcomeMessageSecondaryBtnClick
    // } = viewState.terria.overrides;
    const handleClose = (persist = false) => {
        setShowWelcomeMessage(false);
        setShouldOpenHelp(false);
        setShouldOpenSearch(false);
        if (persist) {
            viewState.terria.setLocalProperty(LOCAL_PROPERTY_KEY, true);
        }
    };
    useKeyPress("Escape", () => {
        if (showWelcomeMessage && viewState.videoGuideVisible === "") {
            handleClose(false);
        }
    });
    return (React.createElement(FadeIn, { isVisible: showWelcomeMessage, onEnter: () => setWelcomeVisible(true), transitionProps: {
            onExiting: () => setWelcomeVisible(false),
            onExited: () => {
                if (shouldTakeTour) {
                    setShouldTakeTour(false);
                    viewState.setTourIndex(0);
                    viewState.setShowTour(true);
                    viewState.setTopElement(TourPortalDisplayName);
                }
                if (shouldExploreData) {
                    setShouldExploreData(false);
                    viewState.openAddData();
                    viewState.setTopElement(ExplorerWindowElementName);
                }
                if (shouldOpenHelp) {
                    setShouldOpenHelp(false);
                    viewState.showHelpPanel();
                }
                if (shouldOpenSearch) {
                    setShouldOpenSearch(false);
                    runInAction(() => (viewState.searchState.showMobileLocationSearch = true));
                }
                // Show where help is when never previously prompted
                if (!viewState.terria.getLocalProperty("helpPrompted")) {
                    runInAction(() => {
                        viewState.toggleFeaturePrompt("help", true, false);
                    });
                }
            }
        } },
        React.createElement(WelcomeModalWrapper, { fullWidth: true, fullHeight: true, position: "absolute", right: true, onClick: () => handleClose(false) },
            React.createElement(Box, { styledWidth: viewState.isMapFullScreen || viewState.useSmallScreenInterface
                    ? "100%"
                    : "calc(100% - 350px)", fullHeight: true, centered: true },
                React.createElement(VideoGuide, { viewState: viewState, videoLink: viewState.terria.configParameters.welcomeMessageVideo.videoUrl, background: viewState.terria.configParameters.welcomeMessageVideo
                        .placeholderImage, videoName: WELCOME_MESSAGE_VIDEO }),
                React.createElement(SlideUpFadeIn, { isVisible: welcomeVisible },
                    React.createElement(Box, { styledWidth: "667px", styledMinHeight: "504px", displayInlineBlock: true, paddedRatio: viewState.useSmallScreenInterface ? 2 : 6, onClick: (e) => {
                            viewState.setTopElement("WelcomeMessage");
                            e.stopPropagation();
                        } },
                        React.createElement(RawButton, { onClick: handleClose.bind(null, false), css: `
                  float: right;
                ` },
                            React.createElement(StyledIcon, { styledWidth: "24px", light: true, glyph: Icon.GLYPHS.closeLight })),
                        React.createElement(Spacing, { bottom: 7 }),
                        React.createElement(Box, { displayInlineBlock: true, styledWidth: viewState.useSmallScreenInterface ? "100%" : "83.33333%" },
                            React.createElement(Text, { bold: true, textLight: true, styledFontSize: viewState.useSmallScreenInterface ? "26px" : "36px", textAlignCenter: viewState.useSmallScreenInterface, styledLineHeight: "49px" }, t("welcomeMessage.title")),
                            React.createElement(Spacing, { bottom: 3 }),
                            React.createElement(Text, { textLight: true, medium: true, textAlignCenter: viewState.useSmallScreenInterface },
                                viewState.useSmallScreenInterface === false && (React.createElement(Trans, { i18nKey: "welcomeMessage.welcomeMessage" },
                                    "Interested in data discovery and exploration?",
                                    React.createElement("br", null),
                                    "Dive right in and get started or check the following help guide options.")),
                                viewState.useSmallScreenInterface === true && (React.createElement(Trans, { i18nKey: "welcomeMessage.welcomeMessageOnMobile" }, "Interested in data discovery and exploration?")))),
                        React.createElement(Spacing, { bottom: 6 }),
                        React.createElement(If, { condition: !viewState.useSmallScreenInterface },
                            React.createElement(Text, { bold: true, textLight: true, extraLarge: true }, viewState.terria.configParameters.welcomeMessageVideo
                                .videoTitle),
                            React.createElement(Spacing, { bottom: 2 })),
                        React.createElement(Box, { fullWidth: true, styledMinHeight: "160px" },
                            React.createElement(If, { condition: !viewState.useSmallScreenInterface },
                                React.createElement(Box, { col6: true, centered: true, backgroundImage: viewState.terria.configParameters.welcomeMessageVideo
                                        .placeholderImage, backgroundBlackOverlay: "50%" },
                                    React.createElement(RawButton, { fullWidth: true, fullHeight: true, onClick: () => viewState.setVideoGuideVisible(WELCOME_MESSAGE_VIDEO) },
                                        React.createElement(StyledIcon, { styledWidth: "48px", light: true, glyph: Icon.GLYPHS.playInverted, css: `
                          margin: auto;
                        ` }))),
                                React.createElement(Spacing, { right: 5 })),
                            React.createElement(Box, { styledMargin: "0 auto", displayInlineBlock: true },
                                React.createElement(If, { condition: !viewState.useSmallScreenInterface },
                                    React.createElement(WelcomeMessageButton, { onClick: () => {
                                            handleClose(false);
                                            // not sure if we should wait for the exit animation,
                                            // if we don't, we have a flicker due to the difference
                                            // in overlay darkness - but if we wait, it goes
                                            // dark -> light -> dark anyway..
                                            setShouldTakeTour(true);
                                            viewState.setTourIndex(0);
                                            viewState.setShowTour(true);
                                            viewState.setTopElement(TourPortalDisplayName);
                                        }, buttonText: t("welcomeMessage.tourBtnText"), buttonIcon: Icon.GLYPHS.tour }),
                                    React.createElement(Spacing, { bottom: 4 }),
                                    React.createElement(WelcomeMessageButton, { buttonText: t("welcomeMessage.helpBtnText"), buttonIcon: Icon.GLYPHS.newHelp, onClick: () => {
                                            handleClose(false);
                                            setShouldOpenHelp(true);
                                        } })),
                                React.createElement(Spacing, { bottom: 4 }),
                                React.createElement(WelcomeMessageButton, { buttonText: t("welcomeMessage.exploreDataBtnText"), buttonIcon: Icon.GLYPHS.add, onClick: () => {
                                        handleClose(false);
                                        setShouldExploreData(true);
                                    } }),
                                viewState.useSmallScreenInterface && (React.createElement(React.Fragment, null,
                                    React.createElement(Spacing, { bottom: 4 }),
                                    React.createElement(WelcomeMessageButton, { buttonText: t("welcomeMessage.searchBtnText"), buttonIcon: Icon.GLYPHS.search, onClick: () => {
                                            handleClose(false);
                                            setShouldOpenSearch(true);
                                        } }))))),
                        React.createElement(If, { condition: !viewState.useSmallScreenInterface },
                            React.createElement(Spacing, { bottom: 13 })),
                        React.createElement(Box, { fullWidth: true, centered: true },
                            React.createElement(RawButton, { onClick: handleClose.bind(null, true) },
                                React.createElement(TextSpan, { textLight: true, isLink: true }, t("welcomeMessage.dismissText"))))))))));
};
WelcomeMessagePure.propTypes = {
    showWelcomeMessage: PropTypes.bool.isRequired,
    setShowWelcomeMessage: PropTypes.func.isRequired,
    isTopElement: PropTypes.bool.isRequired,
    viewState: PropTypes.object.isRequired
};
export default withTranslation()(withViewState(withTheme(WelcomeMessage)));
//# sourceMappingURL=WelcomeMessage.js.map
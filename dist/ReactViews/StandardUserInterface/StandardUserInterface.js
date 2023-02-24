import classNames from "classnames";
import "inobounce";
import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import combine from "terriajs-cesium/Source/Core/combine";
import arrayContains from "../../Core/arrayContains";
import Disclaimer from "../Disclaimer";
import DragDropFile from "../DragDropFile";
import DragDropNotification from "../DragDropNotification";
import ExplorerWindow from "../ExplorerWindow/ExplorerWindow";
import FeatureInfoPanel from "../FeatureInfo/FeatureInfoPanel";
import FeedbackForm from "../Feedback/FeedbackForm";
import { Medium, Small } from "../Generic/Responsive";
import SatelliteHelpPrompt from "../HelpScreens/SatelliteHelpPrompt";
import withFallback from "../HOCs/withFallback";
import ExperimentalFeatures from "../Map/ExperimentalFeatures";
import CollapsedNavigation from "../Map/Navigation/Items/OverflowNavigationItem";
import HelpPanel from "../Map/Panels/HelpPanel/HelpPanel";
import PrintView from "../Map/Panels/SharePanel/Print/PrintView";
import ProgressBar from "../Map/ProgressBar";
import TrainerBar from "../Map/TrainerBar/TrainerBar";
import MobileHeader from "../Mobile/MobileHeader";
import MapInteractionWindow from "../Notification/MapInteractionWindow";
import Notification from "../Notification/Notification";
import Branding from "../SidePanel/Branding";
import FullScreenButton from "../SidePanel/FullScreenButton";
import SidePanel from "../SidePanel/SidePanel";
import StoryBuilder from "../Story/StoryBuilder";
import StoryPanel from "../Story/StoryPanel/StoryPanel";
import Tool from "../Tools/Tool";
import TourPortal from "../Tour/TourPortal";
import WelcomeMessage from "../WelcomeMessage/WelcomeMessage";
import SelectableDimensionWorkflow from "../Workflow/SelectableDimensionWorkflow";
import ContextProviders from "./ContextProviders";
import { GlobalTerriaStyles } from "./GlobalTerriaStyles";
import MapColumn from "./MapColumn";
import processCustomElements from "./processCustomElements";
import SidePanelContainer from "./SidePanelContainer";
import Styles from "./standard-user-interface.scss";
import { terriaTheme } from "./StandardTheme";
import WorkflowPanelPortal from "../Workflow/WorkflowPanelPortal";
export const animationDuration = 250;
const StandardUserInterface = observer((props) => {
    const { t } = useTranslation();
    const acceptDragDropFile = action(() => {
        props.viewState.isDraggingDroppingFile = true;
        // if explorer window is already open, we open my data tab
        if (props.viewState.explorerPanelIsVisible) {
            props.viewState.openUserData();
        }
    });
    const handleDragOver = (e) => {
        if (!e.dataTransfer.types ||
            !arrayContains(e.dataTransfer.types, "Files")) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "copy";
        acceptDragDropFile();
    };
    const shouldUseMobileInterface = () => { var _a; return document.body.clientWidth < ((_a = props.minimumLargeScreenWidth) !== null && _a !== void 0 ? _a : 768); };
    const resizeListener = action(() => {
        props.viewState.useSmallScreenInterface = shouldUseMobileInterface();
    });
    useEffect(() => {
        window.addEventListener("resize", resizeListener, false);
        return () => {
            window.removeEventListener("resize", resizeListener, false);
        };
    }, []);
    useEffect(resizeListener, [props.minimumLargeScreenWidth]);
    useEffect(() => {
        if (props.terria.configParameters.storyEnabled &&
            props.terria.stories &&
            props.terria.stories.length &&
            !props.viewState.storyShown) {
            props.terria.notificationState.addNotificationToQueue({
                title: t("sui.notifications.title"),
                message: t("sui.notifications.message"),
                confirmText: t("sui.notifications.confirmText"),
                denyText: t("sui.notifications.denyText"),
                confirmAction: action(() => {
                    props.viewState.storyShown = true;
                }),
                denyAction: action(() => {
                    props.viewState.storyShown = false;
                }),
                type: "story",
                width: 300
            });
        }
    }, [props.terria.storyPromptShown]);
    // Merge theme in order of highest priority: themeOverrides props -> theme config parameter -> default terriaTheme
    const mergedTheme = combine(props.themeOverrides, combine(props.terria.configParameters.theme, terriaTheme, true), true);
    const theme = mergedTheme;
    const customElements = processCustomElements(props.viewState.useSmallScreenInterface, props.children);
    const terria = props.terria;
    const allBaseMaps = props.allBaseMaps;
    const showStoryBuilder = props.viewState.storyBuilderShown &&
        !props.viewState.useSmallScreenInterface;
    const showStoryPanel = props.terria.configParameters.storyEnabled &&
        props.terria.stories.length > 0 &&
        props.viewState.storyShown &&
        !props.viewState.explorerPanelIsVisible &&
        !props.viewState.storyBuilderShown;
    return (React.createElement(ContextProviders, { viewState: props.viewState, theme: mergedTheme },
        React.createElement(GlobalTerriaStyles, null),
        React.createElement(TourPortal, null),
        React.createElement(CollapsedNavigation, null),
        React.createElement(SatelliteHelpPrompt, null),
        React.createElement(Medium, null,
            React.createElement(SelectableDimensionWorkflow, null)),
        React.createElement("div", { className: Styles.storyWrapper },
            !props.viewState.disclaimerVisible && React.createElement(WelcomeMessage, null),
            React.createElement("div", { className: Styles.uiRoot, css: `
              ${props.viewState.disclaimerVisible && `filter: blur(10px);`}
            `, onDragOver: handleDragOver },
                React.createElement("div", { className: Styles.ui, css: `
                background: ${theme.dark};
              ` },
                    React.createElement("div", { className: Styles.uiInner },
                        !props.viewState.hideMapUi && (React.createElement(React.Fragment, null,
                            React.createElement(Small, null,
                                React.createElement(MobileHeader, { menuItems: customElements.menu, menuLeftItems: customElements.menuLeft, version: props.version, allBaseMaps: allBaseMaps })),
                            React.createElement(Medium, null,
                                React.createElement(React.Fragment, null,
                                    React.createElement(WorkflowPanelPortal, { show: props.terria.isWorkflowPanelActive }),
                                    React.createElement(SidePanelContainer, { tabIndex: 0, show: props.viewState.isMapFullScreen === false &&
                                            props.terria.isWorkflowPanelActive === false },
                                        React.createElement(FullScreenButton, { minified: true, animationDuration: 250, btnText: t("addData.btnHide") }),
                                        React.createElement(Branding, { version: props.version }),
                                        React.createElement(SidePanel, null)))))),
                        React.createElement(Medium, null,
                            React.createElement("div", { className: classNames(Styles.showWorkbenchButton, {
                                    [Styles.showWorkbenchButtonTrainerBarVisible]: props.viewState.trainerBarVisible,
                                    [Styles.showWorkbenchButtonisVisible]: props.viewState.isMapFullScreen,
                                    [Styles.showWorkbenchButtonisNotVisible]: !props.viewState.isMapFullScreen
                                }) },
                                React.createElement(FullScreenButton, { minified: false, btnText: t("sui.showWorkbench"), animationDuration: animationDuration, elementConfig: props.terria.elements.get("show-workbench") }))),
                        React.createElement("section", { className: Styles.map },
                            React.createElement(ProgressBar, null),
                            React.createElement(MapColumn, { customFeedbacks: customElements.feedback, customElements: customElements, allBaseMaps: allBaseMaps, animationDuration: animationDuration }),
                            React.createElement("div", { id: "map-data-attribution" }),
                            React.createElement("main", null,
                                React.createElement(ExplorerWindow, null),
                                props.terria.configParameters.experimentalFeatures &&
                                    !props.viewState.hideMapUi && (React.createElement(ExperimentalFeatures, { experimentalItems: customElements.experimentalMenu })))))),
                !props.viewState.hideMapUi && (React.createElement(Medium, null,
                    React.createElement(TrainerBar, null))),
                React.createElement(Medium, null, props.viewState.isToolOpen && (React.createElement(Tool, Object.assign({}, props.viewState.currentTool)))),
                props.viewState.panel,
                React.createElement(Notification, null),
                React.createElement(MapInteractionWindow, null),
                !customElements.feedback.length &&
                    props.terria.configParameters.feedbackUrl &&
                    !props.viewState.hideMapUi &&
                    props.viewState.feedbackFormIsVisible && React.createElement(FeedbackForm, null),
                React.createElement("div", { className: classNames(Styles.featureInfo, props.viewState.topElement === "FeatureInfo"
                        ? "top-element"
                        : "", {
                        [Styles.featureInfoFullScreen]: props.viewState.isMapFullScreen
                    }), tabIndex: 0, onClick: action(() => {
                        props.viewState.topElement = "FeatureInfo";
                    }) },
                    React.createElement(FeatureInfoPanel, null)),
                React.createElement(DragDropFile, null),
                React.createElement(DragDropNotification, null),
                showStoryPanel && React.createElement(StoryPanel, null)),
            props.terria.configParameters.storyEnabled && showStoryBuilder && (React.createElement(StoryBuilder, { isVisible: showStoryBuilder, animationDuration: animationDuration })),
            props.viewState.showHelpMenu &&
                props.viewState.topElement === "HelpPanel" && React.createElement(HelpPanel, null),
            React.createElement(Disclaimer, null)),
        props.viewState.printWindow && (React.createElement(PrintView, { window: props.viewState.printWindow, closeCallback: () => props.viewState.setPrintWindow(null) }))));
});
export default withFallback(StandardUserInterface);
//# sourceMappingURL=StandardUserInterface.js.map
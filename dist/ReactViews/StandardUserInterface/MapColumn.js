import classNames from "classnames";
import createReactClass from "create-react-class";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import FeatureDetection from "terriajs-cesium/Source/Core/FeatureDetection";
import ActionBarPortal from "../ActionBar/ActionBarPortal";
import BottomDock from "../BottomDock/BottomDock";
import { MapCredits } from "../Credits";
import Loader from "../Loader";
import BottomLeftBar from "../Map/BottomLeftBar/BottomLeftBar";
import DistanceLegend from "../Map/Legend/DistanceLegend";
import LocationBar from "../Map/Legend/LocationBar";
import MenuBar from "../Map/MenuBar";
import MapNavigation from "../Map/Navigation/MapNavigation";
import TerriaViewerWrapper from "../Map/TerriaViewerWrapper";
import SlideUpFadeIn from "../Transitions/SlideUpFadeIn/SlideUpFadeIn";
import Styles from "./map-column.scss";
import Toast from "./Toast";
import { withViewState } from "./ViewStateContext";
const chromeVersion = FeatureDetection.chromeVersion();
/**
 * Right-hand column that contains the map, controls that sit over the map and sometimes the bottom dock containing
 * the timeline and charts.
 */
const MapColumn = observer(createReactClass({
    displayName: "MapColumn",
    propTypes: {
        viewState: PropTypes.object.isRequired,
        customFeedbacks: PropTypes.array.isRequired,
        allBaseMaps: PropTypes.array.isRequired,
        animationDuration: PropTypes.number.isRequired,
        customElements: PropTypes.object.isRequired,
        t: PropTypes.func.isRequired
    },
    getInitialState() {
        return {};
    },
    render() {
        var _a;
        const { customElements } = this.props;
        const { t } = this.props;
        // TODO: remove? see: https://bugs.chromium.org/p/chromium/issues/detail?id=1001663
        const isAboveChrome75 = chromeVersion && chromeVersion[0] && Number(chromeVersion[0]) > 75;
        const mapCellClass = classNames(Styles.mapCell, {
            [Styles.mapCellChrome]: isAboveChrome75
        });
        return (React.createElement("div", { className: classNames(Styles.mapInner, {
                [Styles.mapInnerChrome]: isAboveChrome75
            }) },
            React.createElement("div", { className: Styles.mapRow },
                React.createElement("div", { className: classNames(mapCellClass, Styles.mapCellMap), ref: this.newMapCell },
                    React.createElement(If, { condition: !this.props.viewState.hideMapUi },
                        React.createElement("div", { css: `
                    ${this.props.viewState.explorerPanelIsVisible &&
                                "opacity: 0.3;"}
                  ` },
                            React.createElement(MenuBar, { allBaseMaps: this.props.allBaseMaps, menuItems: customElements.menu, menuLeftItems: customElements.menuLeft, animationDuration: this.props.animationDuration, elementConfig: this.props.viewState.terria.elements.get("menu-bar") }),
                            React.createElement(MapNavigation, { terria: this.props.viewState.terria, viewState: this.props.viewState, navItems: customElements.nav, elementConfig: this.props.viewState.terria.elements.get("map-navigation") }))),
                    React.createElement("div", { className: Styles.mapWrapper, style: {
                            height: this.state.height || "100%"
                        } },
                        React.createElement(TerriaViewerWrapper, { terria: this.props.viewState.terria, viewState: this.props.viewState })),
                    React.createElement(If, { condition: !this.props.viewState.hideMapUi },
                        React.createElement(BottomLeftBar, { terria: this.props.viewState.terria, viewState: this.props.viewState }),
                        React.createElement(ActionBarPortal, { show: this.props.viewState.isActionBarVisible }),
                        React.createElement(SlideUpFadeIn, { isVisible: this.props.viewState.isMapZooming },
                            React.createElement(Toast, null,
                                React.createElement(Loader, { message: t("toast.mapIsZooming"), textProps: {
                                        style: {
                                            padding: "0 5px"
                                        }
                                    } }))),
                        React.createElement(MapCredits, { hideTerriaLogo: !!this.props.viewState.terria.configParameters
                                .hideTerriaLogo, credits: (_a = this.props.viewState.terria.configParameters.extraCreditLinks) === null || _a === void 0 ? void 0 : _a.slice(), currentViewer: this.props.viewState.terria.mainViewer.currentViewer }),
                        React.createElement("div", { className: Styles.locationDistance },
                            React.createElement(LocationBar, { terria: this.props.viewState.terria, mouseCoords: this.props.viewState.terria.currentViewer.mouseCoords }),
                            React.createElement(DistanceLegend, { terria: this.props.viewState.terria }))),
                    React.createElement(If, { condition: this.props.customFeedbacks.length &&
                            this.props.viewState.terria.configParameters.feedbackUrl &&
                            !this.props.viewState.hideMapUi },
                        React.createElement(For, { each: "feedbackItem", of: this.props.customFeedbacks, index: "i" },
                            React.createElement("div", { key: i }, feedbackItem)))),
                React.createElement(If, { condition: this.props.viewState.terria.configParameters.printDisclaimer },
                    React.createElement("div", { className: classNames(Styles.mapCell, "print") },
                        React.createElement("a", { className: Styles.printDisclaimer, href: this.props.viewState.terria.configParameters.printDisclaimer
                                .url }, this.props.viewState.terria.configParameters.printDisclaimer
                            .text)))),
            React.createElement(If, { condition: !this.props.viewState.hideMapUi },
                React.createElement("div", { className: Styles.mapRow },
                    React.createElement("div", { className: mapCellClass },
                        React.createElement(BottomDock, { terria: this.props.viewState.terria, viewState: this.props.viewState, elementConfig: this.props.viewState.terria.elements.get("bottom-dock") }))))));
    }
}));
export default withTranslation()(withViewState(MapColumn));
//# sourceMappingURL=MapColumn.js.map
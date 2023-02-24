import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import React from "react";
import defined from "terriajs-cesium/Source/Core/defined";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import MapInteractionMode from "../../../Models/MapInteractionMode";
import Loader from "../../Loader";
import LocationItem from "../../LocationItem.jsx";
import { withTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { runInAction, reaction } from "mobx";
import Styles from "./satellite-imagery-time-filter-section.scss";
const SatelliteImageryTimeFilterSection = observer(createReactClass({
    displayName: "SatelliteImageryTimeFilterSection",
    propTypes: {
        item: PropTypes.object,
        t: PropTypes.func.isRequired
    },
    removeFilter() {
        this.props.item.removeTimeFilterFeature();
    },
    zoomTo() {
        const feature = this.props.item.timeFilterFeature;
        const position = feature !== undefined && feature.position !== undefined
            ? feature.position.getValue(this.props.item.currentTime)
            : undefined;
        if (defined(position)) {
            const cartographic = Ellipsoid.WGS84.cartesianToCartographic(position);
            this.props.item.terria.currentViewer.zoomTo(new Rectangle(cartographic.longitude - 0.0005, cartographic.latitude - 0.0005, cartographic.longitude + 0.0005, cartographic.latitude + 0.0005));
        }
    },
    newLocation() {
        const { t } = this.props;
        // Cancel any feature picking already in progress.
        const terria = this.props.item.terria;
        const pickPointMode = new MapInteractionMode({
            message: t("satellite.pickPoint"),
            onCancel: () => runInAction(() => terria.mapInteractionModeStack.pop())
        });
        runInAction(() => terria.mapInteractionModeStack.push(pickPointMode));
        // Set up a reaction to observe pickedFeatures and filter the items
        // discrete times
        const disposer = reaction(() => pickPointMode.pickedFeatures, async (pickedFeatures) => {
            runInAction(() => {
                pickPointMode.customUi = function () {
                    return React.createElement(Loader, { message: t("satellite.querying") });
                };
            });
            await pickedFeatures.allFeaturesAvailablePromise;
            if (terria.mapInteractionModeStack[terria.mapInteractionModeStack.length - 1] !== pickPointMode) {
                // already cancelled
                disposer();
                return;
            }
            const item = this.props.item;
            const thisLayerFeature = pickedFeatures.features.filter((feature) => {
                return (item.mapItems.find((mapItem) => {
                    var _a;
                    return mapItem.imageryProvider &&
                        mapItem.imageryProvider === ((_a = feature.imageryLayer) === null || _a === void 0 ? void 0 : _a.imageryProvider);
                }) !== undefined);
            })[0];
            if (thisLayerFeature !== undefined) {
                try {
                    item.setTimeFilterFeature(thisLayerFeature, pickedFeatures.providerCoords);
                }
                catch (e) {
                    terria.raiseErrorToUser(e);
                }
            }
            runInAction(() => terria.mapInteractionModeStack.pop());
            disposer();
        });
    },
    render() {
        if (!this.props.item.canFilterTimeByFeature) {
            return null;
        }
        const feature = this.props.item.timeFilterFeature;
        if (feature === undefined) {
            return this.renderNoFeatureSelected();
        }
        else {
            return this.renderFeatureSelected(feature);
        }
    },
    renderNoFeatureSelected() {
        const { t } = this.props;
        return (React.createElement("div", { className: Styles.inactive },
            React.createElement("div", { className: Styles.btnGroup },
                React.createElement("button", { className: Styles.btn, onClick: this.newLocation }, t("satellite.filterByLocation")))));
    },
    renderFeatureSelected(feature) {
        const { t } = this.props;
        // TODO: if the feature itself doesn't have a position, we should be able to use the position the user clicked on.
        const position = feature.position !== undefined
            ? feature.position.getValue(this.props.item.currentTime)
            : undefined;
        return (React.createElement("div", { className: Styles.active, css: `
            background: ${(p) => p.theme.colorPrimary};
          ` },
            React.createElement("div", { className: Styles.infoGroup },
                React.createElement("div", null, t("satellite.infoGroup")),
                React.createElement(LocationItem, { position: position })),
            React.createElement("div", { className: Styles.btnGroup },
                React.createElement("button", { className: Styles.btn, onClick: this.removeFilter }, t("satellite.removeFilter")),
                React.createElement("button", { className: Styles.btn, onClick: this.zoomTo }, t("satellite.zoomTo")),
                React.createElement("button", { className: Styles.btn, onClick: this.newLocation }, t("satellite.newLocation")))));
    }
}));
export default withTranslation()(SatelliteImageryTimeFilterSection);
//# sourceMappingURL=SatelliteImageryTimeFilterSection.js.map
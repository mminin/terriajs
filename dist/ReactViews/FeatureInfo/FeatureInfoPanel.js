var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import classNames from "classnames";
import { action, reaction, runInAction } from "mobx";
import { disposeOnUnmount, observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import Entity from "terriajs-cesium/Source/DataSources/Entity";
import flatten from "../../Core/flatten";
import isDefined from "../../Core/isDefined";
import { featureBelongsToCatalogItem } from "../../Map/PickedFeatures/PickedFeatures";
import prettifyCoordinates from "../../Map/Vector/prettifyCoordinates";
import MappableMixin from "../../ModelMixins/MappableMixin";
import TimeFilterMixin from "../../ModelMixins/TimeFilterMixin";
import CompositeCatalogItem from "../../Models/Catalog/CatalogItems/CompositeCatalogItem";
import TerriaFeature from "../../Models/Feature/Feature";
import { addMarker, isMarkerVisible, removeMarker } from "../../Models/LocationMarkerUtils";
import Icon from "../../Styled/Icon";
import Loader from "../Loader";
import { withViewState } from "../StandardUserInterface/ViewStateContext";
import Styles from "./feature-info-panel.scss";
import FeatureInfoCatalogItem from "./FeatureInfoCatalogItem";
const DragWrapper = require("../DragWrapper");
let FeatureInfoPanel = class FeatureInfoPanel extends React.Component {
    componentDidMount() {
        const { t } = this.props;
        const terria = this.props.viewState.terria;
        disposeOnUnmount(this, reaction(() => terria.pickedFeatures, (pickedFeatures) => {
            if (!isDefined(pickedFeatures)) {
                terria.selectedFeature = undefined;
            }
            else {
                terria.selectedFeature = TerriaFeature.fromEntity(new Entity({
                    id: t("featureInfo.pickLocation"),
                    position: pickedFeatures.pickPosition
                }));
                if (isDefined(pickedFeatures.allFeaturesAvailablePromise)) {
                    pickedFeatures.allFeaturesAvailablePromise.then(() => {
                        if (this.props.viewState.featureInfoPanelIsVisible === false) {
                            // Panel is closed, refrain from setting selectedFeature
                            return;
                        }
                        // We only show features that are associated with a catalog item, so make sure the one we select to be
                        // open initially is one we're actually going to show.
                        const featuresShownAtAll = pickedFeatures.features.filter((x) => isDefined(determineCatalogItem(terria.workbench, x)));
                        // Return if `terria.selectedFeatures` already showing a valid feature?
                        if (featuresShownAtAll.some((feature) => feature === terria.selectedFeature))
                            return;
                        // Otherwise find first feature with data to show
                        let selectedFeature = featuresShownAtAll.filter((feature) => isDefined(feature.properties) ||
                            isDefined(feature.description))[0];
                        if (!isDefined(selectedFeature) &&
                            featuresShownAtAll.length > 0) {
                            // Handles the case when no features have info - still want something to be open.
                            selectedFeature = featuresShownAtAll[0];
                        }
                        runInAction(() => {
                            terria.selectedFeature = selectedFeature;
                        });
                    });
                }
            }
        }));
    }
    renderFeatureInfoCatalogItems(catalogItems, featureMap) {
        return catalogItems.map((catalogItem, i) => {
            var _a;
            // From the pairs, select only those with this catalog item, and pull the features out of the pair objects.
            const features = (_a = (catalogItem.uniqueId
                ? featureMap.get(catalogItem.uniqueId)
                : undefined)) !== null && _a !== void 0 ? _a : [];
            return (React.createElement(FeatureInfoCatalogItem, { key: catalogItem.uniqueId, viewState: this.props.viewState, catalogItem: catalogItem, features: features, onToggleOpen: this.toggleOpenFeature, printView: this.props.printView }));
        });
    }
    close() {
        this.props.viewState.featureInfoPanelIsVisible = false;
        // give the close animation time to finish before unselecting, to avoid jumpiness
        setTimeout(action(() => {
            this.props.viewState.terria.pickedFeatures = undefined;
            this.props.viewState.terria.selectedFeature = undefined;
        }), 200);
    }
    toggleCollapsed() {
        this.props.viewState.featureInfoPanelIsCollapsed =
            !this.props.viewState.featureInfoPanelIsCollapsed;
    }
    toggleOpenFeature(feature) {
        const terria = this.props.viewState.terria;
        if (feature === terria.selectedFeature) {
            terria.selectedFeature = undefined;
        }
        else {
            terria.selectedFeature = feature;
        }
    }
    getMessageForNoResults() {
        const { t } = this.props;
        if (this.props.viewState.terria.workbench.items.length > 0) {
            // feature info shows up becuase data has been added for the first time
            if (this.props.viewState.firstTimeAddingData) {
                runInAction(() => {
                    this.props.viewState.firstTimeAddingData = false;
                });
                return t("featureInfo.clickMap");
            }
            // if clicking on somewhere that has no data
            return t("featureInfo.noDataAvailable");
        }
        else {
            return t("featureInfo.clickToAddData");
        }
    }
    addManualMarker(longitude, latitude) {
        const { t } = this.props;
        addMarker(this.props.viewState.terria, {
            name: t("featureInfo.userSelection"),
            location: {
                latitude: latitude,
                longitude: longitude
            }
        });
    }
    pinClicked(longitude, latitude) {
        if (!isMarkerVisible(this.props.viewState.terria)) {
            this.addManualMarker(longitude, latitude);
        }
        else {
            removeMarker(this.props.viewState.terria);
        }
    }
    // locationUpdated(longitude, latitude) {
    //   if (
    //     isDefined(latitude) &&
    //     isDefined(longitude) &&
    //     isMarkerVisible(this.props.viewState.terria)
    //   ) {
    //     removeMarker(this.props.viewState.terria);
    //     this.addManualMarker(longitude, latitude);
    //   }
    // }
    filterIntervalsByFeature(catalogItem, feature) {
        var _a;
        try {
            catalogItem.setTimeFilterFeature(feature, (_a = this.props.viewState.terria.pickedFeatures) === null || _a === void 0 ? void 0 : _a.providerCoords);
        }
        catch (e) {
            this.props.viewState.terria.raiseErrorToUser(e);
        }
    }
    renderLocationItem(cartesianPosition) {
        const cartographic = Ellipsoid.WGS84.cartesianToCartographic(cartesianPosition);
        if (cartographic === undefined) {
            return React.createElement(React.Fragment, null);
        }
        const latitude = CesiumMath.toDegrees(cartographic.latitude);
        const longitude = CesiumMath.toDegrees(cartographic.longitude);
        const pretty = prettifyCoordinates(longitude, latitude);
        // this.locationUpdated(longitude, latitude);
        const that = this;
        const pinClicked = function () {
            that.pinClicked(longitude, latitude);
        };
        const locationButtonStyle = isMarkerVisible(this.props.viewState.terria)
            ? Styles.btnLocationSelected
            : Styles.btnLocation;
        return (React.createElement("div", { className: Styles.location },
            React.createElement("span", null, "Lat / Lon\u00A0"),
            React.createElement("span", null,
                pretty.latitude + ", " + pretty.longitude,
                !this.props.printView && (React.createElement("button", { type: "button", onClick: pinClicked, className: locationButtonStyle },
                    React.createElement(Icon, { glyph: Icon.GLYPHS.location }))))));
    }
    render() {
        var _a, _b, _c, _d;
        const { t } = this.props;
        const terria = this.props.viewState.terria;
        const viewState = this.props.viewState;
        const { catalogItems, featureMap } = getFeatureMapByCatalogItems(this.props.viewState.terria);
        const featureInfoCatalogItems = this.renderFeatureInfoCatalogItems(catalogItems, featureMap);
        const panelClassName = classNames(Styles.panel, {
            [Styles.isCollapsed]: viewState.featureInfoPanelIsCollapsed,
            [Styles.isVisible]: viewState.featureInfoPanelIsVisible,
            [Styles.isTranslucent]: viewState.explorerPanelIsVisible
        });
        const filterableCatalogItems = catalogItems
            .filter((catalogItem) => TimeFilterMixin.isMixedInto(catalogItem) &&
            catalogItem.canFilterTimeByFeature)
            .map((catalogItem) => {
            var _a;
            const features = (_a = (catalogItem.uniqueId
                ? featureMap.get(catalogItem.uniqueId)
                : undefined)) !== null && _a !== void 0 ? _a : [];
            return {
                catalogItem: catalogItem,
                feature: isDefined(features[0]) ? features[0] : undefined
            };
        })
            .filter((pair) => isDefined(pair.feature));
        // If the clock is available then use it, otherwise don't.
        const clock = (_a = terria.timelineClock) === null || _a === void 0 ? void 0 : _a.currentTime;
        // If there is a selected feature then use the feature location.
        let position = (_c = (_b = terria.selectedFeature) === null || _b === void 0 ? void 0 : _b.position) === null || _c === void 0 ? void 0 : _c.getValue(clock);
        // If position is invalid then don't use it.
        // This seems to be fixing the symptom rather then the cause, but don't know what is the true cause this ATM.
        if (position === undefined ||
            isNaN(position.x) ||
            isNaN(position.y) ||
            isNaN(position.z)) {
            position = undefined;
        }
        if (!isDefined(position)) {
            // Otherwise use the location picked.
            position = (_d = terria.pickedFeatures) === null || _d === void 0 ? void 0 : _d.pickPosition;
        }
        const locationElements = position ? (React.createElement("li", null, this.renderLocationItem(position))) : null;
        return (React.createElement(DragWrapper, null,
            React.createElement("div", { className: panelClassName, "aria-hidden": !viewState.featureInfoPanelIsVisible },
                !this.props.printView && (React.createElement("div", { className: Styles.header },
                    React.createElement("div", { className: classNames("drag-handle", Styles.btnPanelHeading) },
                        React.createElement("span", null, t("featureInfo.panelHeading")),
                        React.createElement("button", { type: "button", onClick: this.toggleCollapsed, className: Styles.btnToggleFeature }, this.props.viewState.featureInfoPanelIsCollapsed ? (React.createElement(Icon, { glyph: Icon.GLYPHS.closed })) : (React.createElement(Icon, { glyph: Icon.GLYPHS.opened })))),
                    React.createElement("button", { type: "button", onClick: this.close, className: Styles.btnCloseFeature, title: t("featureInfo.btnCloseFeature") },
                        React.createElement(Icon, { glyph: Icon.GLYPHS.close })))),
                React.createElement("ul", { className: Styles.body },
                    this.props.printView && locationElements,
                    // Is feature info visible
                    !viewState.featureInfoPanelIsCollapsed &&
                        viewState.featureInfoPanelIsVisible ? (
                    // Are picked features loading -> show Loader
                    isDefined(terria.pickedFeatures) &&
                        terria.pickedFeatures.isLoading ? (React.createElement("li", null,
                        React.createElement(Loader, { light: true }))) : // Do we have no features/catalog items to show?
                        featureInfoCatalogItems.length === 0 ? (React.createElement("li", { className: Styles.noResults }, this.getMessageForNoResults())) : (
                        // Finally show feature info
                        featureInfoCatalogItems)) : null,
                    !this.props.printView && locationElements,
                    // Add "filter by location" buttons if supported
                    filterableCatalogItems.map((pair) => TimeFilterMixin.isMixedInto(pair.catalogItem) &&
                        pair.feature ? (React.createElement("button", { key: pair.catalogItem.uniqueId, type: "button", onClick: this.filterIntervalsByFeature.bind(this, pair.catalogItem, pair.feature), className: Styles.satelliteSuggestionBtn }, t("featureInfo.satelliteSuggestionBtn", {
                        catalogItemName: pair.catalogItem.name
                    }))) : null)))));
    }
};
__decorate([
    action.bound
], FeatureInfoPanel.prototype, "close", null);
__decorate([
    action.bound
], FeatureInfoPanel.prototype, "toggleCollapsed", null);
__decorate([
    action.bound
], FeatureInfoPanel.prototype, "toggleOpenFeature", null);
FeatureInfoPanel = __decorate([
    observer
], FeatureInfoPanel);
function getFeatureMapByCatalogItems(terria) {
    const featureMap = new Map();
    const catalogItems = new Set(); // Will contain a list of all unique catalog items.
    if (!isDefined(terria.pickedFeatures)) {
        return { featureMap, catalogItems: Array.from(catalogItems) };
    }
    terria.pickedFeatures.features.forEach((feature) => {
        var _a;
        const catalogItem = determineCatalogItem(terria.workbench, feature);
        if (catalogItem === null || catalogItem === void 0 ? void 0 : catalogItem.uniqueId) {
            catalogItems.add(catalogItem);
            if (featureMap.has(catalogItem.uniqueId))
                (_a = featureMap.get(catalogItem.uniqueId)) === null || _a === void 0 ? void 0 : _a.push(feature);
            else
                featureMap.set(catalogItem.uniqueId, [feature]);
        }
    });
    return { featureMap, catalogItems: Array.from(catalogItems) };
}
export function determineCatalogItem(workbench, feature) {
    if (MappableMixin.isMixedInto(feature._catalogItem) &&
        workbench.items.includes(feature._catalogItem)) {
        return feature._catalogItem;
    }
    // Expand child members of composite catalog items.
    // This ensures features from each child model are treated as belonging to
    // that child model, not the parent composite model.
    const items = flatten(workbench.items.map(recurseIntoMembers)).filter(MappableMixin.isMixedInto);
    return items.find((item) => featureBelongsToCatalogItem(feature, item));
}
function recurseIntoMembers(catalogItem) {
    if (catalogItem instanceof CompositeCatalogItem) {
        return flatten(catalogItem.memberModels.map(recurseIntoMembers));
    }
    return [catalogItem];
}
export { FeatureInfoPanel };
export default withTranslation()(withViewState(FeatureInfoPanel));
//# sourceMappingURL=FeatureInfoPanel.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import classNames from "classnames";
import { action, autorun, computed, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import filterOutUndefined from "../../Core/filterOutUndefined";
import MappableMixin, { ImageryParts } from "../../ModelMixins/MappableMixin";
import CommonStrata from "../../Models/Definition/CommonStrata";
import CreateModel from "../../Models/Definition/CreateModel";
import GeoJsonCatalogItem from "../../Models/Catalog/CatalogItems/GeoJsonCatalogItem";
import ViewerMode from "../../Models/ViewerMode";
import MappableTraits from "../../Traits/TraitsClasses/MappableTraits";
import TerriaViewer from "../../ViewModels/TerriaViewer";
import Styles from "./data-preview-map.scss";
class AdaptForPreviewMap extends MappableMixin(CreateModel(MappableTraits)) {
    async forceLoadMapItems() { }
    // Make all imagery 0 or 100% opacity
    get mapItems() {
        var _a, _b;
        return ((_b = (_a = this.previewed) === null || _a === void 0 ? void 0 : _a.mapItems.map(m => ImageryParts.is(m)
            ? {
                ...m,
                alpha: m.alpha !== 0.0 ? 1.0 : 0.0,
                show: true
            }
            : m)) !== null && _b !== void 0 ? _b : []);
    }
}
__decorate([
    computed
], AdaptForPreviewMap.prototype, "mapItems", null);
/**
 * Leaflet-based preview map that sits within the preview.
 */
/**
 * @typedef {object} Props
 * @prop {Terria} terria
 * @prop {Mappable} previewed
 * @prop {boolean} showMap
 *
 */
// TODO: Can this.props.previewed be undefined?
/**
 *
 * @extends {React.Component<Props>}
 */
let DataPreviewMap = class DataPreviewMap extends React.Component {
    constructor(props) {
        super(props);
        this.isZoomedToExtent = false;
        /**
         * @param {HTMLElement | null} container
         */
        this.containerRef = action(container => {
            this.previewViewer.attached && this.previewViewer.detach();
            if (container !== null) {
                this.initPreview(container);
            }
        });
        this.previewViewer = new TerriaViewer(this.props.terria, computed(() => {
            const previewItem = new AdaptForPreviewMap();
            previewItem.previewed = this.props.previewed;
            // Can previewed be undefined?
            return filterOutUndefined([
                previewItem,
                this.boundingRectangleCatalogItem
            ]);
        }));
        runInAction(() => {
            this.previewViewer.viewerMode = ViewerMode.Leaflet;
            this.previewViewer.disableInteraction = true;
            this.previewViewer.homeCamera = this.props.terria.mainViewer.homeCamera;
        });
        // Not yet implemented
        // previewViewer.hideTerriaLogo = true;
        // previewViewer.homeView = terria.homeView;
        // previewViewer.initialView = terria.homeView;
    }
    get previewBadgeState() {
        var _a, _b, _c, _d, _e, _f, _g;
        if ((_a = this.props.previewed) === null || _a === void 0 ? void 0 : _a.isLoading)
            return "loading";
        if (((_c = (_b = this.props.previewed) === null || _b === void 0 ? void 0 : _b.loadMetadataResult) === null || _c === void 0 ? void 0 : _c.error) || ((_e = (_d = this.props.previewed) === null || _d === void 0 ? void 0 : _d.loadMapItemsResult) === null || _e === void 0 ? void 0 : _e.error))
            return "dataPreviewError";
        if (((_g = (_f = this.props.previewed) === null || _f === void 0 ? void 0 : _f.mapItems) === null || _g === void 0 ? void 0 : _g.length) === 0)
            return "noPreviewAvailable";
        return "dataPreview";
    }
    /**
     * @param {HTMLElement} container
     */
    initPreview(container) {
        console.log("Initialising preview map. This might be expensive, so this should only show up when the preview map disappears and reappears");
        this.isZoomedToExtent = false;
        const baseMapItems = this.props.terria.baseMapsModel.baseMapItems;
        // Find preview basemap using `terria.previewBaseMapId`
        const initPreviewBaseMap = baseMapItems.find(baseMap => baseMap.item.uniqueId ===
            this.props.terria.baseMapsModel.previewBaseMapId);
        if (initPreviewBaseMap !== undefined) {
            this.previewViewer.setBaseMap(initPreviewBaseMap.item);
        }
        else {
            this.previewViewer.setBaseMap(baseMapItems.length > 0 ? baseMapItems[0].item : undefined);
        }
        this.previewViewer.attach(container);
        this._disposeZoomToExtentSubscription = autorun(() => {
            if (this.isZoomedToExtent) {
                this.previewViewer.currentViewer.zoomTo(this.props.previewed);
            }
            else {
                this.previewViewer.currentViewer.zoomTo(this.previewViewer.homeCamera);
            }
        });
    }
    componentWillUnmount() {
        this._disposeZoomToExtentSubscription &&
            this._disposeZoomToExtentSubscription();
        this.previewViewer.detach();
        if (this._unsubscribeErrorHandler) {
            this._unsubscribeErrorHandler();
            this._unsubscribeErrorHandler = undefined;
        }
    }
    get boundingRectangleCatalogItem() {
        const rectangle = this.props.previewed.rectangle;
        if (rectangle === undefined) {
            return undefined;
        }
        let west = rectangle.west;
        let south = rectangle.south;
        let east = rectangle.east;
        let north = rectangle.north;
        if (west === undefined ||
            south === undefined ||
            east === undefined ||
            north === undefined) {
            return undefined;
        }
        if (!this.isZoomedToExtent) {
            // When zoomed out, make sure the dataset rectangle is at least 5% of the width and height
            // the home view, so that it is actually visible.
            const minimumFraction = 0.05;
            const homeView = this.previewViewer.homeCamera;
            const minimumWidth = CesiumMath.toDegrees(homeView.rectangle.width) * minimumFraction;
            if (east - west < minimumWidth) {
                const center = (east + west) * 0.5;
                west = center - minimumWidth * 0.5;
                east = center + minimumWidth * 0.5;
            }
            const minimumHeight = CesiumMath.toDegrees(homeView.rectangle.height) * minimumFraction;
            if (north - south < minimumHeight) {
                const center = (north + south) * 0.5;
                south = center - minimumHeight * 0.5;
                north = center + minimumHeight * 0.5;
            }
        }
        const rectangleCatalogItem = new GeoJsonCatalogItem("__preview-data-extent", this.props.terria);
        rectangleCatalogItem.setTrait(CommonStrata.user, "geoJsonData", {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {
                        stroke: "#08ABD5",
                        "stroke-width": 2,
                        "stroke-opacity": 1
                    },
                    geometry: {
                        type: "LineString",
                        coordinates: [
                            [west, south],
                            [west, north],
                            [east, north],
                            [east, south],
                            [west, south]
                        ]
                    }
                }
            ]
        });
        rectangleCatalogItem.loadMapItems();
        return rectangleCatalogItem;
    }
    clickMap(evt) {
        this.isZoomedToExtent = !this.isZoomedToExtent;
    }
    render() {
        const { t } = this.props;
        const previewBadgeLabels = {
            loading: t("preview.loading"),
            noPreviewAvailable: t("preview.noPreviewAvailable"),
            dataPreview: t("preview.dataPreview"),
            dataPreviewError: t("preview.dataPreviewError")
        };
        return (React.createElement("div", { className: Styles.map, onClick: this.clickMap },
            React.createElement(Choose, null,
                React.createElement(When, { condition: this.props.showMap },
                    React.createElement("div", { className: classNames(Styles.terriaPreview), ref: this.containerRef })),
                React.createElement(Otherwise, null,
                    React.createElement("div", { className: classNames(Styles.terriaPreview, Styles.placeholder) }))),
            React.createElement("label", { className: Styles.badge }, previewBadgeLabels[this.previewBadgeState])));
    }
};
DataPreviewMap.propTypes = {
    terria: PropTypes.object.isRequired,
    previewed: PropTypes.object,
    showMap: PropTypes.bool,
    t: PropTypes.func.isRequired
};
__decorate([
    observable
], DataPreviewMap.prototype, "isZoomedToExtent", void 0);
__decorate([
    computed
], DataPreviewMap.prototype, "previewBadgeState", null);
__decorate([
    action
], DataPreviewMap.prototype, "initPreview", null);
__decorate([
    computed
], DataPreviewMap.prototype, "boundingRectangleCatalogItem", null);
__decorate([
    action.bound
], DataPreviewMap.prototype, "clickMap", null);
DataPreviewMap = __decorate([
    observer
], DataPreviewMap);
export default withTranslation()(DataPreviewMap);
//# sourceMappingURL=DataPreviewMap.js.map
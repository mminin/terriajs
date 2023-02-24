var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, autorun, computed, observable, reaction, runInAction } from "mobx";
import { computedFn } from "mobx-utils";
import cesiumCancelAnimationFrame from "terriajs-cesium/Source/Core/cancelAnimationFrame";
import Cartesian2 from "terriajs-cesium/Source/Core/Cartesian2";
import Cartographic from "terriajs-cesium/Source/Core/Cartographic";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import Ellipsoid from "terriajs-cesium/Source/Core/Ellipsoid";
import EventHelper from "terriajs-cesium/Source/Core/EventHelper";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import cesiumRequestAnimationFrame from "terriajs-cesium/Source/Core/requestAnimationFrame";
import DataSource from "terriajs-cesium/Source/DataSources/DataSource";
import DataSourceCollection from "terriajs-cesium/Source/DataSources/DataSourceCollection";
import SplitDirection from "terriajs-cesium/Source/Scene/SplitDirection";
import html2canvas from "terriajs-html2canvas";
import filterOutUndefined from "../Core/filterOutUndefined";
import isDefined from "../Core/isDefined";
import runLater from "../Core/runLater";
import ImageryProviderLeafletGridLayer, { isImageryProviderGridLayer as supportsImageryProviderGridLayer } from "../Map/Leaflet/ImageryProviderLeafletGridLayer";
import ImageryProviderLeafletTileLayer from "../Map/Leaflet/ImageryProviderLeafletTileLayer";
import LeafletDataSourceDisplay from "../Map/Leaflet/LeafletDataSourceDisplay";
import LeafletScene from "../Map/Leaflet/LeafletScene";
import LeafletSelectionIndicator from "../Map/Leaflet/LeafletSelectionIndicator";
import LeafletVisualizer from "../Map/Leaflet/LeafletVisualizer";
import L from "../Map/LeafletPatched";
import PickedFeatures from "../Map/PickedFeatures/PickedFeatures";
import rectangleToLatLngBounds from "../Map/Vector/rectangleToLatLngBounds";
import FeatureInfoUrlTemplateMixin from "../ModelMixins/FeatureInfoUrlTemplateMixin";
import MappableMixin, { ImageryParts } from "../ModelMixins/MappableMixin";
import TileErrorHandlerMixin from "../ModelMixins/TileErrorHandlerMixin";
import ImageryProviderTraits from "../Traits/TraitsClasses/ImageryProviderTraits";
import SplitterTraits from "../Traits/TraitsClasses/SplitterTraits";
import CameraView from "./CameraView";
import hasTraits from "./Definition/hasTraits";
import TerriaFeature from "./Feature/Feature";
import GlobeOrMap from "./GlobeOrMap";
import { LeafletAttribution } from "./LeafletAttribution";
import MapInteractionMode from "./MapInteractionMode";
// We want TS to look at the type declared in lib/ThirdParty/terriajs-cesium-extra/index.d.ts
// and import doesn't allows us to do that, so instead we use require + type casting to ensure
// we still maintain the type checking, without TS screaming with errors
const FeatureDetection = require("terriajs-cesium/Source/Core/FeatureDetection").default;
// This class is an observer. It probably won't contain any observables itself
export default class Leaflet extends GlobeOrMap {
    constructor(terriaViewer, container) {
        super();
        this.type = "Leaflet";
        this.dataSources = new DataSourceCollection();
        this.canShowSplitter = true;
        this._stopRequestAnimationFrame = false;
        this._pickedFeatures = undefined;
        this._pauseMapInteractionCount = 0;
        this._createImageryLayer = computedFn((ip, clippingRectangle) => {
            const layerOptions = {
                bounds: clippingRectangle && rectangleToLatLngBounds(clippingRectangle)
            };
            // We have two different kinds of ImageryProviderLeaflet layers
            // - Grid layer will use the ImageryProvider in the more traditional way - calling `requestImage` to draw the image on to a canvas
            // - Tile layer will pass tile URLs to leaflet objects - which is a bit more "Leaflety" than Grid layer
            // Tile layer is preferred. Grid layer mainly exists for custom Imagery Providers which aren't just a tile of image URLs
            if (supportsImageryProviderGridLayer(ip)) {
                return new ImageryProviderLeafletGridLayer(this, ip, layerOptions);
            }
            else {
                return new ImageryProviderLeafletTileLayer(this, ip, layerOptions);
            }
        });
        this.terria = terriaViewer.terria;
        this.terriaViewer = terriaViewer;
        this.map = L.map(container, {
            zoomControl: false,
            attributionControl: false,
            zoomSnap: 1,
            preferCanvas: true,
            worldCopyJump: false
        }).setView([-28.5, 135], 5);
        this.map.on("move", () => this.updateMapObservables());
        this.map.on("zoom", () => this.updateMapObservables());
        this.scene = new LeafletScene(this.map);
        this._attributionControl = new LeafletAttribution(this.terria);
        this.map.addControl(this._attributionControl);
        this._leafletVisualizer = new LeafletVisualizer();
        this._selectionIndicator = new LeafletSelectionIndicator(this);
        this.dataSourceDisplay = new LeafletDataSourceDisplay({
            scene: this.scene,
            dataSourceCollection: this.dataSources,
            visualizersCallback: this._leafletVisualizer.visualizersCallback // TODO: fix type error
        });
        this._eventHelper = new EventHelper();
        this._eventHelper.add(this.terria.timelineClock.onTick, ((clock) => {
            this.dataSourceDisplay.update(clock.currentTime);
        }));
        const ticker = () => {
            if (!this._stopRequestAnimationFrame) {
                this.terria.timelineClock.tick();
                this._cesiumReqAnimFrameId = cesiumRequestAnimationFrame(ticker);
            }
        };
        // Start ticker asynchronously to avoid calling an action in the consctructor
        runLater(ticker);
        this._disposeWorkbenchMapItemsSubscription = this.observeModelLayer();
        this._disposeSplitterReaction = this._reactToSplitterChanges();
        this._disposeDisableInteractionSubscription = autorun(() => {
            const map = this.map;
            const interactions = filterOutUndefined([
                map.touchZoom,
                map.doubleClickZoom,
                map.scrollWheelZoom,
                map.boxZoom,
                map.keyboard,
                map.dragging,
                map.tap
            ]);
            const pickLocation = this.pickLocation.bind(this);
            const pickFeature = (entity, event) => {
                this._featurePicked(entity, event);
            };
            // Update mouse coords on mouse move
            this.map.on("mousemove", (e) => {
                const mouseEvent = e;
                this.mouseCoords.updateCoordinatesFromLeaflet(this.terria, mouseEvent.originalEvent);
            });
            if (this.terriaViewer.disableInteraction) {
                interactions.forEach((handler) => handler.disable());
                this.map.off("click", pickLocation);
                this.scene.featureClicked.removeEventListener(pickFeature);
                this._disposeSelectedFeatureSubscription &&
                    this._disposeSelectedFeatureSubscription();
            }
            else {
                interactions.forEach((handler) => handler.enable());
                this.map.on("click", pickLocation);
                this.scene.featureClicked.addEventListener(pickFeature);
                this._disposeSelectedFeatureSubscription = autorun(() => {
                    const feature = this.terria.selectedFeature;
                    this._selectFeature(feature);
                });
            }
        });
        this._initProgressEvent();
    }
    updateMapObservables() {
        this.size = this.map.getSize();
        this.nw = this.map.containerPointToLayerPoint([0, 0]);
        this.se = this.map.containerPointToLayerPoint(this.size);
    }
    _makeImageryLayerFromParts(parts, item) {
        if (TileErrorHandlerMixin.isMixedInto(item)) {
            // because this code path can run multiple times, make sure we remove the
            // handler if it is already registered
            parts.imageryProvider.errorEvent.removeEventListener(item.onTileLoadError, item);
            parts.imageryProvider.errorEvent.addEventListener(item.onTileLoadError, item);
        }
        return this._createImageryLayer(parts.imageryProvider, parts.clippingRectangle);
    }
    get attributionPrefix() {
        return this._attributionControl.prefix;
    }
    get attributions() {
        return this._attributionControl.dataAttributions;
    }
    /**
     * sets up loading listeners
     */
    _initProgressEvent() {
        const onTileLoadChange = () => {
            var tilesLoadingCount = 0;
            this.map.eachLayer(function (layerOrGridlayer) {
                // _tiles is protected but our knockout-loading-logic accesses it here anyway
                const layer = layerOrGridlayer;
                if (layer === null || layer === void 0 ? void 0 : layer._tiles) {
                    // Count all tiles not marked as loaded
                    tilesLoadingCount += Object.keys(layer._tiles).filter((key) => !layer._tiles[key].loaded).length;
                }
            });
            this._updateTilesLoadingCount(tilesLoadingCount);
        };
        this.map.on("layeradd", function (evt) {
            // This check makes sure we only watch tile layers, and also protects us if this private variable gets changed.
            if (typeof evt.layer._tiles !== "undefined") {
                evt.layer.on("tileloadstart tileload load", onTileLoadChange);
            }
        }.bind(this));
        this.map.on("layerremove", function (evt) {
            evt.layer.off("tileloadstart tileload load", onTileLoadChange);
        }.bind(this));
    }
    /**
     * Pick feature from mouse click event.
     */
    pickLocation(e) {
        const mouseEvent = e;
        // Handle click events that cross the anti-meridian
        if (mouseEvent.latlng.lng > 180 || mouseEvent.latlng.lng < -180) {
            mouseEvent.latlng = mouseEvent.latlng.wrap();
        }
        // if (!this._dragboxcompleted && that.map.dragging.enabled()) {
        this._pickFeatures(mouseEvent.latlng);
        // }
        // this._dragboxcompleted = false;
    }
    getContainer() {
        return this.map.getContainer();
    }
    pauseMapInteraction() {
        ++this._pauseMapInteractionCount;
        if (this._pauseMapInteractionCount === 1) {
            this.map.dragging.disable();
        }
    }
    resumeMapInteraction() {
        --this._pauseMapInteractionCount;
        if (this._pauseMapInteractionCount === 0) {
            setTimeout(() => {
                if (this._pauseMapInteractionCount === 0) {
                    this.map.dragging.enable();
                }
            }, 0);
        }
    }
    destroy() {
        this._disposeSelectedFeatureSubscription &&
            this._disposeSelectedFeatureSubscription();
        this._disposeSplitterReaction();
        this._disposeWorkbenchMapItemsSubscription();
        this._eventHelper.removeAll();
        this._disposeDisableInteractionSubscription();
        // This variable prevents a race condition if destroy() is called
        // synchronously as a result of timelineClock ticking due to ticker()
        this._stopRequestAnimationFrame = true;
        if (isDefined(this._cesiumReqAnimFrameId)) {
            cesiumCancelAnimationFrame(this._cesiumReqAnimFrameId);
        }
        this.dataSourceDisplay.destroy();
        this.map.off("move");
        this.map.off("zoom");
        this.map.remove();
    }
    get availableCatalogItems() {
        const catalogItems = [
            ...this.terriaViewer.items.get(),
            this.terriaViewer.baseMap
        ];
        return catalogItems;
    }
    get availableDataSources() {
        const catalogItems = this.availableCatalogItems;
        /* Handle datasources */
        const allMapItems = [].concat(...catalogItems.filter(isDefined).map((item) => item.mapItems));
        const dataSources = allMapItems.filter(isDataSource);
        return dataSources;
    }
    observeModelLayer() {
        // Setup reaction to sync datSources collection with availableDataSources
        //
        // To avoid buggy concurrent syncs, we have to ensure that even when
        // multiple sync reactions are triggered, we run them one after the
        // other. To do this, we make each run of the reaction wait for the
        // previous `syncDataSourcesPromise` to finish before starting itself.
        let syncDataSourcesPromise = Promise.resolve();
        const dataSourcesReactionDisposer = reaction(() => this.availableDataSources, () => {
            syncDataSourcesPromise = syncDataSourcesPromise
                .then(async () => {
                await this.syncDataSourceCollection(this.availableDataSources, this.dataSources);
                this.notifyRepaintRequired();
            })
                .catch(console.error);
        }, { fireImmediately: true });
        // Reaction to sync imagery from model layer with cesium map
        const imageryReactionDisposer = autorun(() => {
            const catalogItems = this.availableCatalogItems;
            // Flatmap
            const allImageryMapItems = [].concat(...catalogItems
                .filter(isDefined)
                .map((item) => item.mapItems
                .filter(ImageryParts.is)
                .map((parts) => ({ item, parts }))));
            const allImagery = allImageryMapItems.map(({ item, parts }) => {
                if (hasTraits(item, ImageryProviderTraits, "leafletUpdateInterval")) {
                    parts.imageryProvider._leafletUpdateInterval =
                        item.leafletUpdateInterval;
                }
                return {
                    parts: parts,
                    layer: this._makeImageryLayerFromParts(parts, item)
                };
            });
            // Delete imagery layers no longer in the model
            this.map.eachLayer((mapLayer) => {
                if (isImageryLayer(mapLayer) ||
                    mapLayer instanceof ImageryProviderLeafletGridLayer) {
                    const index = allImagery.findIndex((im) => im.layer === mapLayer);
                    if (index === -1) {
                        this.map.removeLayer(mapLayer);
                    }
                }
            });
            // Add layer and update its zIndex
            let zIndex = 100; // Start at an arbitrary value
            allImagery.reverse().forEach(({ parts, layer }) => {
                if (parts.show) {
                    layer.setOpacity(parts.alpha);
                    layer.setZIndex(zIndex);
                    zIndex++;
                    if (!this.map.hasLayer(layer)) {
                        this.map.addLayer(layer);
                    }
                }
                else {
                    this.map.removeLayer(layer);
                }
            });
        });
        return () => {
            dataSourcesReactionDisposer();
            imageryReactionDisposer();
        };
    }
    /**
     * Syncs the `dataSources` collection against the latest `availableDataSources`.
     *
     */
    async syncDataSourceCollection(availableDataSources, dataSources) {
        // 1. Remove deleted data sources
        //
        // Iterate backwards because we're removing items.
        for (let i = dataSources.length - 1; i >= 0; i--) {
            const ds = dataSources.get(i);
            if (availableDataSources.indexOf(ds) === -1 || !ds.show) {
                dataSources.remove(ds);
            }
        }
        // 2. Add new data sources
        for (let ds of availableDataSources) {
            if (!dataSources.contains(ds) && ds.show) {
                await dataSources.add(ds);
            }
        }
        // 3. Ensure stacking order matches order in `availableDataSources` - first item appears on top.
        runInAction(() => availableDataSources.forEach((ds) => {
            // There is a buggy/un-intended side-effect when calling raiseToTop() with
            // a source that doesn't exist in the collection. Doing this will replace
            // the last entry in the collection with the new one. So we should be
            // careful to raiseToTop() only if the DS already exists in the collection.
            // Relevant code:
            //   https://github.com/CesiumGS/cesium/blob/dbd452328a48bfc4e192146862a9f8fa15789dc8/packages/engine/Source/DataSources/DataSourceCollection.js#L298-L299
            dataSources.contains(ds) && dataSources.raiseToTop(ds);
        }));
    }
    doZoomTo(target, flightDurationSeconds = 3.0) {
        if (!isDefined(target)) {
            return Promise.resolve();
            //throw new DeveloperError("target is required.");
        }
        let bounds;
        // Target is a KML data source
        if (isDefined(target.entities)) {
            if (isDefined(this.dataSourceDisplay)) {
                bounds = this.dataSourceDisplay.getLatLngBounds(target);
            }
        }
        else {
            let extent;
            if (target instanceof Rectangle) {
                extent = target;
            }
            else if (target instanceof CameraView) {
                extent = target.rectangle;
            }
            else if (MappableMixin.isMixedInto(target)) {
                if (isDefined(target.cesiumRectangle)) {
                    extent = target.cesiumRectangle;
                }
                if (!isDefined(extent)) {
                    // Zoom to the first item!
                    return this.doZoomTo(target.mapItems[0], flightDurationSeconds);
                }
            }
            else {
                extent = target.rectangle;
            }
            // Account for a bounding box crossing the date line.
            if (extent.east < extent.west) {
                extent = Rectangle.clone(extent);
                extent.east += CesiumMath.TWO_PI;
            }
            bounds = rectangleToLatLngBounds(extent);
        }
        if (isDefined(bounds)) {
            this.map.flyToBounds(bounds, {
                animate: flightDurationSeconds > 0.0,
                duration: flightDurationSeconds
            });
        }
        return Promise.resolve();
    }
    getCurrentCameraView() {
        const bounds = this.map.getBounds();
        return new CameraView(Rectangle.fromDegrees(bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()));
    }
    notifyRepaintRequired() {
        // No action necessary.
    }
    pickFromLocation(latLngHeight, providerCoords, existingFeatures) {
        this._pickFeatures(L.latLng({
            lat: latLngHeight.latitude,
            lng: latLngHeight.longitude,
            alt: latLngHeight.height
        }), providerCoords, existingFeatures);
    }
    /**
     * Return features at a latitude, longitude and (optionally) height for the given imageryLayer.
     * @param latLngHeight The position on the earth to pick
     * @param providerCoords A map of imagery provider urls to the tile coords used to get features for those imagery
     * @returns A flat array of all the features for the given tiles that are currently on the map
     */
    async getFeaturesAtLocation(latLngHeight, providerCoords) {
        const pickMode = new MapInteractionMode({
            message: i18next.t("models.imageryLayer.resolvingAvailability"),
            onCancel: () => {
                this.terria.mapInteractionModeStack.pop();
            }
        });
        this.terria.mapInteractionModeStack.push(pickMode);
        this._pickFeatures(L.latLng({
            lat: latLngHeight.latitude,
            lng: latLngHeight.longitude,
            alt: latLngHeight.height
        }), providerCoords, [], true);
        if (pickMode.pickedFeatures) {
            const pickedFeatures = pickMode.pickedFeatures;
            await pickedFeatures.allFeaturesAvailablePromise;
        }
        return runInAction(() => {
            var _a;
            this.terria.mapInteractionModeStack.pop();
            return (_a = pickMode.pickedFeatures) === null || _a === void 0 ? void 0 : _a.features;
        });
    }
    /*
     * There are two "listeners" for clicks which are set up in our constructor.
     * - One fires for any click: `map.on('click', ...`.  It calls `pickFeatures`.
     * - One fires only for vector features: `this.scene.featureClicked.addEventListener`.
     *    It calls `featurePicked`, which calls `pickFeatures` and then adds the feature it found, if any.
     * These events can fire in either order.
     * Billboards do not fire the first event.
     *
     * Note that `pickFeatures` does nothing if `leaflet._pickedFeatures` is already set.
     * Otherwise, it sets it, runs `runLater` to clear it, and starts the asynchronous raster feature picking.
     *
     * So:
     * If only the first event is received, it triggers the raster-feature picking as desired.
     * If both are received in the order above, the second adds the vector features to the list of raster features as desired.
     * If both are received in the reverse order, the vector-feature click kicks off the same behavior as the other click would have;
     * and when the next click is received, it is ignored - again, as desired.
     */
    _featurePicked(entity, event) {
        var _a;
        this._pickFeatures(event.latlng);
        // Ignore clicks on the feature highlight.
        if (entity.entityCollection && entity.entityCollection.owner) {
            const owner = entity.entityCollection.owner;
            if (owner instanceof DataSource &&
                owner.name == GlobeOrMap._featureHighlightName) {
                return;
            }
        }
        const feature = TerriaFeature.fromEntityCollectionOrEntity(entity);
        const catalogItem = feature._catalogItem;
        if (FeatureInfoUrlTemplateMixin.isMixedInto(catalogItem) &&
            typeof catalogItem.getFeaturesFromPickResult === "function" &&
            this.terria.allowFeatureInfoRequests) {
            const result = catalogItem.getFeaturesFromPickResult.bind(catalogItem)(undefined, entity, (((_a = this._pickedFeatures) === null || _a === void 0 ? void 0 : _a.features.length) || 0) < catalogItem.maxRequests);
            if (result && isDefined(this._pickedFeatures)) {
                if (Array.isArray(result)) {
                    this._pickedFeatures.features.push(...result);
                }
                else {
                    this._pickedFeatures.features.push(result);
                }
            }
        }
        else if (isDefined(this._pickedFeatures)) {
            this._pickedFeatures.features.push(feature);
        }
        if (isDefined(this._pickedFeatures) &&
            isDefined(feature) &&
            feature.position) {
            this._pickedFeatures.pickPosition = feature.position._value;
        }
    }
    _pickFeatures(latlng, tileCoordinates, existingFeatures, ignoreSplitter = false) {
        if (isDefined(this._pickedFeatures)) {
            // Picking is already in progress.
            return;
        }
        this._pickedFeatures = new PickedFeatures();
        if (isDefined(existingFeatures)) {
            this._pickedFeatures.features = existingFeatures;
        }
        // We run this later because vector click events and the map click event can come through in any order, but we can
        // be reasonably sure that all of them will be processed by the time our runLater func is invoked.
        const cleanup = runLater(() => {
            // Set this again just in case a vector pick came through and reset it to the vector's position.
            const newPickLocation = Ellipsoid.WGS84.cartographicToCartesian(pickedLocation);
            runInAction(() => {
                const mapInteractionModeStack = this.terria.mapInteractionModeStack;
                if (isDefined(mapInteractionModeStack) &&
                    mapInteractionModeStack.length > 0) {
                    const pickedFeatures = mapInteractionModeStack[mapInteractionModeStack.length - 1]
                        .pickedFeatures;
                    if (isDefined(pickedFeatures)) {
                        pickedFeatures.pickPosition = newPickLocation;
                    }
                }
                else if (isDefined(this.terria.pickedFeatures)) {
                    this.terria.pickedFeatures.pickPosition = newPickLocation;
                }
            });
            // Unset this so that the next click will start building features from scratch.
            this._pickedFeatures = undefined;
        });
        const imageryLayers = [];
        if (this.terria.allowFeatureInfoRequests) {
            this.map.eachLayer((layer) => {
                if (isImageryLayer(layer)) {
                    imageryLayers.push(layer);
                }
            });
        }
        // we need items sorted in reverse order by their zIndex to get correct ordering of feature info
        imageryLayers.sort((a, b) => {
            if (!isDefined(a.options.zIndex) || !isDefined(b.options.zIndex)) {
                return 0;
            }
            if (a.options.zIndex < b.options.zIndex) {
                return 1;
            }
            if (a.options.zIndex > b.options.zIndex) {
                return -1;
            }
            return 0;
        });
        tileCoordinates = defaultValue(tileCoordinates, {});
        const pickedLocation = Cartographic.fromDegrees(latlng.lng, latlng.lat);
        this._pickedFeatures.pickPosition =
            Ellipsoid.WGS84.cartographicToCartesian(pickedLocation);
        const imageryFeaturePromises = imageryLayers.map(async (imageryLayer) => {
            var _a;
            const imageryLayerUrl = imageryLayer.imageryProvider.url;
            const longRadians = CesiumMath.toRadians(latlng.lng);
            const latRadians = CesiumMath.toRadians(latlng.lat);
            const coords = (_a = tileCoordinates === null || tileCoordinates === void 0 ? void 0 : tileCoordinates[imageryLayerUrl]) !== null && _a !== void 0 ? _a : (await imageryLayer.getFeaturePickingCoords(this.map, longRadians, latRadians));
            const features = await imageryLayer.pickFeatures(coords.x, coords.y, coords.level, longRadians, latRadians);
            // Make sure ImageryLayerFeatureInfo has imagery layer property
            features === null || features === void 0 ? void 0 : features.forEach((feature) => (feature.imageryLayer = imageryLayer));
            return {
                features: features,
                imageryLayer: imageryLayer,
                coords: coords
            };
        });
        const pickedFeatures = this._pickedFeatures;
        // We want the all available promise to return after the cleanup one to
        // make sure all vector click events have resolved.
        pickedFeatures.allFeaturesAvailablePromise = Promise.all([
            cleanup,
            Promise.all(imageryFeaturePromises)
                .then((results) => {
                runInAction(() => {
                    pickedFeatures.isLoading = false;
                });
                pickedFeatures.providerCoords = {};
                const filteredResults = results.filter((result) => isDefined(result.features) && result.features.length > 0);
                pickedFeatures.providerCoords = filteredResults.reduce(function (coordsSoFar, result) {
                    var _a;
                    const imageryProvider = (_a = result.imageryLayer) === null || _a === void 0 ? void 0 : _a.imageryProvider;
                    if (imageryProvider)
                        coordsSoFar[imageryProvider.url] = result.coords;
                    return coordsSoFar;
                }, {});
                const features = filteredResults.reduce((allFeatures, result) => {
                    if (this.terria.showSplitter &&
                        ignoreSplitter === false &&
                        isDefined(pickedFeatures.pickPosition)) {
                        // Skip this feature, unless the imagery layer is on the picked side or
                        // belongs to both sides of the splitter
                        const screenPosition = this._computePositionOnScreen(pickedFeatures.pickPosition);
                        const pickedSide = this._getSplitterSideForScreenPosition(screenPosition);
                        const layerDirection = result.imageryLayer.splitDirection;
                        if (!(layerDirection === pickedSide ||
                            layerDirection === SplitDirection.NONE)) {
                            return allFeatures;
                        }
                    }
                    return allFeatures.concat(result.features.map((feature) => {
                        // For features without a position, use the picked location.
                        if (!isDefined(feature.position)) {
                            feature.position = pickedLocation;
                        }
                        return this._createFeatureFromImageryLayerFeature(feature);
                    }));
                }, pickedFeatures.features);
                runInAction(() => {
                    pickedFeatures.features = features;
                });
            })
                .catch((e) => {
                runInAction(() => {
                    pickedFeatures.isLoading = false;
                    pickedFeatures.error =
                        "An unknown error occurred while picking features.";
                });
                throw e;
            })
        ]).then(() => undefined);
        runInAction(() => {
            const mapInteractionModeStack = this.terria.mapInteractionModeStack;
            if (isDefined(mapInteractionModeStack) &&
                mapInteractionModeStack.length > 0) {
                mapInteractionModeStack[mapInteractionModeStack.length - 1].pickedFeatures = this._pickedFeatures;
            }
            else {
                this.terria.pickedFeatures = this._pickedFeatures;
            }
        });
    }
    _reactToSplitterChanges() {
        return autorun(() => {
            const items = this.terria.mainViewer.items.get();
            const showSplitter = this.terria.showSplitter;
            const splitPosition = this.terria.splitPosition;
            items.forEach((item) => {
                if (MappableMixin.isMixedInto(item) &&
                    hasTraits(item, SplitterTraits, "splitDirection")) {
                    const layers = this.getImageryLayersForItem(item);
                    const splitDirection = item.splitDirection;
                    layers.forEach(action((layer) => {
                        if (showSplitter) {
                            layer.splitDirection = splitDirection;
                            layer.splitPosition = splitPosition;
                        }
                        else {
                            layer.splitDirection = SplitDirection.NONE;
                            layer.splitPosition = splitPosition;
                        }
                    }));
                }
            });
            this.notifyRepaintRequired();
        });
    }
    getImageryLayersForItem(item) {
        return filterOutUndefined(item.mapItems.map((m) => {
            if (ImageryParts.is(m)) {
                const layer = this._makeImageryLayerFromParts(m, item);
                return layer instanceof ImageryProviderLeafletTileLayer ||
                    layer instanceof ImageryProviderLeafletGridLayer
                    ? layer
                    : undefined;
            }
        }));
    }
    /**
     * Computes the screen position of a given world position.
     * @param position The world position in Earth-centered Fixed coordinates.
     * @param [result] The instance to which to copy the result.
     * @return The screen position, or undefined if the position is not on the screen.
     */
    _computePositionOnScreen(position, result) {
        const cartographicScratch = new Cartographic();
        const cartographic = Ellipsoid.WGS84.cartesianToCartographic(position, cartographicScratch);
        const point = this.map.latLngToContainerPoint(L.latLng(CesiumMath.toDegrees(cartographic.latitude), CesiumMath.toDegrees(cartographic.longitude)));
        if (isDefined(result)) {
            result.x = point.x;
            result.y = point.y;
        }
        else {
            result = new Cartesian2(point.x, point.y);
        }
        return result;
    }
    _selectFeature(feature) {
        this._highlightFeature(feature);
        if (isDefined(feature) && isDefined(feature.position)) {
            const cartographicScratch = new Cartographic();
            const cartographic = Ellipsoid.WGS84.cartesianToCartographic(feature.position.getValue(this.terria.timelineClock.currentTime), cartographicScratch);
            this._selectionIndicator.setLatLng(L.latLng([
                CesiumMath.toDegrees(cartographic.latitude),
                CesiumMath.toDegrees(cartographic.longitude)
            ]));
            this._selectionIndicator.animateSelectionIndicatorAppear();
        }
        else {
            this._selectionIndicator.animateSelectionIndicatorDepart();
        }
    }
    getClipsForSplitter() {
        let clipLeft = "";
        let clipRight = "";
        let clipPositionWithinMap = 0;
        let clipX = 0;
        if (this.terria.showSplitter) {
            const map = this.map;
            const size = map.getSize();
            const nw = map.containerPointToLayerPoint([0, 0]);
            const se = map.containerPointToLayerPoint(size);
            clipPositionWithinMap = size.x * this.terria.splitPosition;
            clipX = Math.round(nw.x + clipPositionWithinMap);
            clipLeft = "rect(" + [nw.y, clipX, se.y, nw.x].join("px,") + "px)";
            clipRight = "rect(" + [nw.y, se.x, se.y, clipX].join("px,") + "px)";
        }
        return {
            left: clipLeft,
            right: clipRight,
            clipPositionWithinMap: clipPositionWithinMap,
            clipX: clipX
        };
    }
    isSplitterDragThumb(element) {
        return (element.className &&
            element.className.indexOf &&
            element.className.indexOf("tjs-splitter__thumb") >= 0);
    }
    captureScreenshot() {
        // Temporarily hide the map credits.
        this._attributionControl.remove();
        try {
            // html2canvas can't handle the clip style which is used for the splitter. So if the splitter is active, we render
            // a left image and a right image and compose them. Also remove the splitter drag thumb.
            let promise;
            if (this.terria.showSplitter) {
                const clips = this.getClipsForSplitter();
                const clipLeft = clips.left.replace(/ /g, "");
                const clipRight = clips.right.replace(/ /g, "");
                promise = html2canvas(this.map.getContainer(), {
                    useCORS: true,
                    ignoreElements: (element) => (element.style.clip !== undefined &&
                        element.style.clip !== null &&
                        element.style.clip.replace(/ /g, "") === clipRight) ||
                        this.isSplitterDragThumb(element)
                }).then((leftCanvas) => {
                    return html2canvas(this.map.getContainer(), {
                        useCORS: true,
                        ignoreElements: (element) => (element.style.clip !== undefined &&
                            element.style.clip !== null &&
                            element.style.clip.replace(/ /g, "") === clipLeft) ||
                            this.isSplitterDragThumb(element)
                    }).then((rightCanvas) => {
                        const combined = document.createElement("canvas");
                        combined.width = leftCanvas.width;
                        combined.height = leftCanvas.height;
                        const context = combined.getContext("2d");
                        if (context === undefined || context === null) {
                            // Error
                            return null;
                        }
                        const split = clips.clipPositionWithinMap * window.devicePixelRatio;
                        context.drawImage(leftCanvas, 0, 0, split, combined.height, 0, 0, split, combined.height);
                        context.drawImage(rightCanvas, split, 0, combined.width - split, combined.height, split, 0, combined.width - split, combined.height);
                        return combined;
                    });
                });
            }
            else {
                promise = html2canvas(this.map.getContainer(), {
                    useCORS: true
                });
            }
            return promise
                .then((canvas) => {
                return canvas.toDataURL("image/png");
            })
                .finally(() => {
                this._attributionControl.addTo(this.map);
            });
        }
        catch (e) {
            this._attributionControl.addTo(this.map);
            return Promise.reject(e);
        }
    }
    _addVectorTileHighlight(imageryProvider, rectangle) {
        const map = this.map;
        const options = {
            opacity: 1,
            bounds: rectangleToLatLngBounds(rectangle)
        };
        if (isDefined(map.options.maxZoom)) {
            options.maxZoom = map.options.maxZoom;
        }
        const layer = new ImageryProviderLeafletGridLayer(this, imageryProvider, options);
        layer.addTo(map);
        layer.bringToFront();
        return function () {
            map.removeLayer(layer);
        };
    }
}
__decorate([
    observable
], Leaflet.prototype, "size", void 0);
__decorate([
    observable
], Leaflet.prototype, "nw", void 0);
__decorate([
    observable
], Leaflet.prototype, "se", void 0);
__decorate([
    action
], Leaflet.prototype, "updateMapObservables", null);
__decorate([
    computed
], Leaflet.prototype, "attributions", null);
__decorate([
    computed
], Leaflet.prototype, "availableCatalogItems", null);
__decorate([
    computed
], Leaflet.prototype, "availableDataSources", null);
__decorate([
    action
], Leaflet.prototype, "getFeaturesAtLocation", null);
__decorate([
    action
], Leaflet.prototype, "_featurePicked", null);
function isImageryLayer(someLayer) {
    return "imageryProvider" in someLayer;
}
function isDataSource(object) {
    return "entities" in object;
}
//# sourceMappingURL=Leaflet.js.map
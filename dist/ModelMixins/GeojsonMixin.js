var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import bbox from "@turf/bbox";
import { feature, featureCollection } from "@turf/helpers";
import i18next from "i18next";
import { action, computed, observable, onBecomeObserved, onBecomeUnobserved, reaction, runInAction, toJS } from "mobx";
import { createTransformer } from "mobx-utils";
import { GeomType, LineSymbolizer, PolygonSymbolizer } from "protomaps";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import clone from "terriajs-cesium/Source/Core/clone";
import Color from "terriajs-cesium/Source/Core/Color";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import Iso8601 from "terriajs-cesium/Source/Core/Iso8601";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import TimeInterval from "terriajs-cesium/Source/Core/TimeInterval";
import TimeIntervalCollection from "terriajs-cesium/Source/Core/TimeIntervalCollection";
import BillboardGraphics from "terriajs-cesium/Source/DataSources/BillboardGraphics";
import ColorMaterialProperty from "terriajs-cesium/Source/DataSources/ColorMaterialProperty";
import ConstantProperty from "terriajs-cesium/Source/DataSources/ConstantProperty";
import CustomDataSource from "terriajs-cesium/Source/DataSources/CustomDataSource";
import CzmlDataSource from "terriajs-cesium/Source/DataSources/CzmlDataSource";
import Entity from "terriajs-cesium/Source/DataSources/Entity";
import GeoJsonDataSource from "terriajs-cesium/Source/DataSources/GeoJsonDataSource";
import PointGraphics from "terriajs-cesium/Source/DataSources/PointGraphics";
import PolylineGraphics from "terriajs-cesium/Source/DataSources/PolylineGraphics";
import HeightReference from "terriajs-cesium/Source/Scene/HeightReference";
import filterOutUndefined from "../Core/filterOutUndefined";
import formatPropertyValue from "../Core/formatPropertyValue";
import hashFromString from "../Core/hashFromString";
import isDefined from "../Core/isDefined";
import { isJsonNumber, isJsonObject, isJsonString } from "../Core/Json";
import { isJson } from "../Core/loadBlob";
import StandardCssColors from "../Core/StandardCssColors";
import TerriaError, { networkRequestError } from "../Core/TerriaError";
import ProtomapsImageryProvider, { GeojsonSource, GEOJSON_SOURCE_LAYER_NAME } from "../Map/ImageryProvider/ProtomapsImageryProvider";
import Reproject from "../Map/Vector/Reproject";
import CatalogMemberMixin from "../ModelMixins/CatalogMemberMixin";
import UrlMixin from "../ModelMixins/UrlMixin";
import proxyCatalogItemUrl from "../Models/Catalog/proxyCatalogItemUrl";
import createStratumInstance from "../Models/Definition/createStratumInstance";
import LoadableStratum from "../Models/Definition/LoadableStratum";
import StratumOrder from "../Models/Definition/StratumOrder";
import TerriaFeature from "../Models/Feature/Feature";
import TableStylingWorkflow from "../Models/Workflows/TableStylingWorkflow";
import createLongitudeLatitudeFeaturePerRow from "../Table/createLongitudeLatitudeFeaturePerRow";
import TableAutomaticStylesStratum from "../Table/TableAutomaticStylesStratum";
import { isConstantStyleMap } from "../Table/TableStyleMap";
import { GeoJsonTraits } from "../Traits/TraitsClasses/GeoJsonTraits";
import { RectangleTraits } from "../Traits/TraitsClasses/MappableTraits";
import FeatureInfoUrlTemplateMixin from "./FeatureInfoUrlTemplateMixin";
import { isDataSource } from "./MappableMixin";
import TableMixin from "./TableMixin";
export const FEATURE_ID_PROP = "_id_";
const SIMPLE_STYLE_KEYS = [
    "marker-size",
    "marker-color",
    "marker-symbol",
    "marker-opacity",
    "marker-url",
    "stroke",
    "stroke-opacity",
    "stroke-width",
    "marker-stroke-width",
    "polyline-stroke-width",
    "polygon-stroke-width",
    "fill",
    "fill-opacity"
];
class GeoJsonStratum extends LoadableStratum(GeoJsonTraits) {
    constructor(_item) {
        super();
        this._item = _item;
    }
    duplicateLoadableStratum(newModel) {
        return new GeoJsonStratum(newModel);
    }
    static load(item) {
        return new GeoJsonStratum(item);
    }
    get rectangle() {
        if (this._item._readyData) {
            try {
                const geojsonBbox = bbox(this._item._readyData);
                return createStratumInstance(RectangleTraits, {
                    west: geojsonBbox[0],
                    south: geojsonBbox[1],
                    east: geojsonBbox[2],
                    north: geojsonBbox[3]
                });
            }
            catch (e) {
                TerriaError.from(e, "Failed to create `rectangle` for GeoJSON").log();
            }
        }
    }
    get opacity() {
        return 1;
    }
    get disableSplitter() {
        // Disable splitter if mapItems has any datasources
        return this._item.mapItems.find(isDataSource) ? true : undefined;
    }
    get disableOpacityControl() {
        // Disable opacity if mapItems has any datasources
        return this._item.mapItems.find(isDataSource) ? true : undefined;
    }
    get showDisableStyleOption() {
        return true;
    }
    get forceCesiumPrimitives() {
        // Disable TableStyling for the following:
        // If MultiPoint features exist
        // If more than 50% of features have simple style properties - disable table styling
        if (this._item.featureCounts.multiPoint > 0 ||
            this._item.featureCounts.simpleStyle / this._item.featureCounts.total >=
                0.5) {
            return true;
        }
    }
}
GeoJsonStratum.stratumName = "geojson";
__decorate([
    computed
], GeoJsonStratum.prototype, "rectangle", null);
__decorate([
    computed
], GeoJsonStratum.prototype, "disableSplitter", null);
__decorate([
    computed
], GeoJsonStratum.prototype, "disableOpacityControl", null);
__decorate([
    computed
], GeoJsonStratum.prototype, "forceCesiumPrimitives", null);
StratumOrder.addLoadStratum(GeoJsonStratum.stratumName);
function GeoJsonMixin(Base) {
    class GeoJsonMixin extends TableMixin(FeatureInfoUrlTemplateMixin(UrlMixin(CatalogMemberMixin(Base)))) {
        constructor(...args) {
            super(...args);
            /** Number of features in _readyData FeatureCollection */
            this.featureCounts = {
                point: 0,
                multiPoint: 0,
                line: 0,
                polygon: 0,
                simpleStyle: 0,
                total: 0
            };
            // Create point features using TableMixin.createLongitudeLatitudeFeaturePerRow
            // Used with table styling
            // Line and Polygon features are handled by Protomaps
            this.createPoints = createTransformer((style) => {
                if (!this.readyData)
                    return;
                const latitudes = [];
                const longitudes = [];
                for (let i = 0; i < this.readyData.features.length; i++) {
                    const feature = this.readyData.features[i];
                    if (!isPoint(feature)) {
                        latitudes.push(null);
                        longitudes.push(null);
                        continue;
                    }
                    latitudes.push(feature.geometry.coordinates[1]);
                    longitudes.push(feature.geometry.coordinates[0]);
                }
                const dataSource = new CustomDataSource(this.name || "Table");
                dataSource.entities.suspendEvents();
                let features = createLongitudeLatitudeFeaturePerRow(style, longitudes, latitudes);
                // _catalogItem property is needed for some feature picking functions (eg FeatureInfoUrlTemplateMixin)
                features.forEach((f) => {
                    f._catalogItem = this;
                    dataSource.entities.add(f);
                });
                dataSource.entities.resumeEvents();
                return dataSource;
            });
            // Add GeoJsonStratum
            if (this.strata.get(GeoJsonStratum.stratumName) === undefined) {
                runInAction(() => {
                    this.strata.set(GeoJsonStratum.stratumName, GeoJsonStratum.load(this));
                });
            }
            // Add TableAutomaticStylesStratum
            if (this.strata.get(TableAutomaticStylesStratum.stratumName) === undefined) {
                this.strata.set(TableAutomaticStylesStratum.stratumName, new TableAutomaticStylesStratum(this));
            }
            // Setup table style reactions
            // We should only update geojson table styling when our map items have consumers
            onBecomeObserved(this, "mapItems", this.startTableStyleReaction.bind(this));
            onBecomeUnobserved(this, "mapItems", this.stopTableStyleReaction.bind(this));
        }
        startTableStyleReaction() {
            if (!this.tableStyleReactionDisposer) {
                // Update protomaps imagery provider if activeTableStyle changes
                this.tableStyleReactionDisposer = reaction(() => [
                    this.useTableStylingAndProtomaps,
                    this.readyData,
                    this.currentTimeAsJulianDate,
                    this.activeTableStyle.timeIntervals,
                    this.activeTableStyle.colorMap,
                    this.activeTableStyle.pointSizeMap,
                    this.activeTableStyle.pointStyleMap.traitValues,
                    this.activeTableStyle.outlineStyleMap.traitValues,
                    this.terria.baseMapContrastColor // This needs to be here as `baseMapContrastColor` is used as the default outline color in `getFeatureStyle`
                ], () => {
                    if (this._imageryProvider &&
                        this.readyData &&
                        this.useTableStylingAndProtomaps) {
                        runInAction(() => {
                            this._imageryProvider = this.createProtomapsImageryProvider(this.readyData);
                        });
                    }
                }, 
                // Fire immediately, just in case reactions change while not observing mapItems
                { fireImmediately: true });
            }
        }
        stopTableStyleReaction() {
            if (this.tableStyleReactionDisposer) {
                this.tableStyleReactionDisposer();
                this.tableStyleReactionDisposer = undefined;
            }
        }
        get isGeoJson() {
            return true;
        }
        get name() {
            if (CatalogMemberMixin.isMixedInto(this.sourceReference)) {
                return super.name || this.sourceReference.name;
            }
            return super.name;
        }
        get cacheDuration() {
            if (isDefined(super.cacheDuration)) {
                return super.cacheDuration;
            }
            return "1d";
        }
        /**
         * Returns the final raw data after all transformations are applied.
         * (Geojson FeatureCollection in WGS84)
         */
        get readyData() {
            return this._readyData;
        }
        get _canExportData() {
            return isDefined(this.readyData);
        }
        async _exportData() {
            if (isDefined(this.readyData)) {
                let name = this.name || this.uniqueId || "data.geojson";
                if (!isJson(name)) {
                    name = `${name}.geojson`;
                }
                return {
                    name,
                    file: new Blob([JSON.stringify(this.readyData)])
                };
            }
            throw new TerriaError({
                sender: this,
                message: "No data available to download."
            });
        }
        get mapItems() {
            if (this.isLoadingMapItems) {
                return [];
            }
            this._dataSource ? (this._dataSource.show = this.show) : null;
            let points = this.useTableStylingAndProtomaps
                ? this.createPoints(this.activeTableStyle)
                : undefined;
            points = (points === null || points === void 0 ? void 0 : points.entities.values.length) === 0 ? undefined : points;
            points ? (points.show = this.show) : null;
            return filterOutUndefined([
                points,
                this._dataSource,
                this._imageryProvider
                    ? {
                        imageryProvider: this._imageryProvider,
                        show: this.show,
                        alpha: this.opacity,
                        clippingRectangle: undefined
                    }
                    : undefined
            ]);
        }
        /**
         * {@link FeatureInfoUrlTemplateMixin.buildFeatureFromPickResult}
         */
        buildFeatureFromPickResult(_screenPosition, pickResult) {
            if (pickResult instanceof Entity) {
                return TerriaFeature.fromEntityCollectionOrEntity(pickResult);
            }
            else if (isDefined(pickResult === null || pickResult === void 0 ? void 0 : pickResult.id)) {
                return TerriaFeature.fromEntityCollectionOrEntity(pickResult.id);
            }
        }
        /** Only use MapboxVectorTiles (through geojson-vt and protomaps.js) if enabled and not using unsupported traits
         * For more info see GeoJsonMixin.forceLoadMapItems
         */
        get useTableStylingAndProtomaps() {
            return (!this.forceCesiumPrimitives &&
                !isDefined(this.czmlTemplate) &&
                // Table styling doesn't support the old GeoJson StyleTraits
                Object.keys(this.style.traits).every((styleTrait) => !isDefined(this.style[styleTrait])) &&
                !isDefined(this.timeProperty) &&
                !isDefined(this.heightProperty) &&
                (!isDefined(this.perPropertyStyles) ||
                    this.perPropertyStyles.length === 0));
        }
        /** Remove chart items from TableMixin.chartItems */
        get chartItems() {
            return [];
        }
        /** GeojsonMixin has 3 rendering modes:
         * - CZML:
         *    - if `czmlTemplate` is defined (see `GeoJsonTraits.czmlTemplate`)
         * - Table styling / Mapbox vector tiles (through geojson-vt and protomaps.js)
         *    - Will be used by default, if not using unsupported traits (see below)
         * - Cesium primitives if:
         *    - `GeoJsonTraits.forceCesiumPrimitives = true`
         *    - Using `timeProperty` or `heightProperty` or `perPropertyStyles` or simple-style `marker-symbol`
         *    - More than 50% of GeoJSON features have simply-style properties (eg "fill-color")
         *    - MultiPoint features are in GeoJSON (not supported by Table styling)
         */
        async forceLoadMapItems() {
            var _a;
            const czmlTemplate = this.czmlTemplate;
            const filterByProperties = this.filterByProperties;
            let geoJson;
            try {
                geoJson = await this.forceLoadGeojsonData();
                if (geoJson === undefined) {
                    return;
                }
                const geoJsonWgs84 = await reprojectToGeographic(geoJson, this.terria.configParameters.proj4ServiceBaseUrl);
                const featureCounts = {
                    point: 0,
                    multiPoint: 0,
                    line: 0,
                    polygon: 0,
                    simpleStyle: 0,
                    total: 0
                };
                // We will re-add features depending if filterByProperties - or geometry is invalid
                const features = geoJsonWgs84.features;
                geoJsonWgs84.features = [];
                for (let i = 0; i < features.length; i++) {
                    const feature = features[i];
                    // Ignore features without geometry or type
                    if (!isJsonObject(feature.geometry, false) || !feature.geometry.type)
                        continue;
                    if (!feature.properties) {
                        feature.properties = {};
                    }
                    // Filter features by `featureFilterByProps` trait if defined
                    if (filterByProperties &&
                        !Object.entries(filterByProperties).every(([key, value]) => feature.properties[key] === value)) {
                        continue;
                    }
                    geoJsonWgs84.features.push(feature);
                    // Add feature index to FEATURE_ID_PROP ("_id_") feature property
                    // This is used to refer to each feature in TableMixin (as row ID)
                    const properties = feature.properties;
                    properties[FEATURE_ID_PROP] = i;
                    // Count features types
                    if (feature.geometry.type === "Point") {
                        featureCounts.point++;
                    }
                    else if (feature.geometry.type === "MultiPoint") {
                        featureCounts.multiPoint++;
                    }
                    else if (feature.geometry.type === "LineString" ||
                        feature.geometry.type === "MultiLineString") {
                        featureCounts.line++;
                    }
                    else if (feature.geometry.type === "Polygon" ||
                        feature.geometry.type === "MultiPolygon") {
                        featureCounts.polygon++;
                    }
                    // Does feature include simplestyle-spec properties (eg "fill-colour)")
                    if (SIMPLE_STYLE_KEYS.find((key) => properties[key])) {
                        featureCounts.simpleStyle++;
                    }
                    featureCounts.total++;
                }
                runInAction(() => {
                    this.featureCounts = featureCounts;
                    this._readyData = geoJsonWgs84;
                });
                if (isDefined(czmlTemplate)) {
                    const dataSource = await this.loadCzmlDataSource(geoJsonWgs84);
                    runInAction(() => {
                        this._dataSource = dataSource;
                        this._imageryProvider = undefined;
                    });
                }
                else if (runInAction(() => this.useTableStylingAndProtomaps)) {
                    runInAction(() => {
                        this._imageryProvider =
                            this.createProtomapsImageryProvider(geoJsonWgs84);
                    });
                }
                else {
                    const dataSource = await this.loadGeoJsonDataSource(geoJsonWgs84);
                    runInAction(() => {
                        this._dataSource = dataSource;
                        this._imageryProvider = undefined;
                    });
                }
                (_a = this._dataSource) === null || _a === void 0 ? void 0 : _a.entities.values.forEach((entity) => (entity._catalogItem = this));
            }
            catch (e) {
                throw networkRequestError(TerriaError.from(e, {
                    title: i18next.t("models.geoJson.errorLoadingTitle"),
                    message: i18next.t("models.geoJson.errorParsingMessage")
                }));
            }
        }
        addPerPropertyStyleToGeoJson(fc) {
            var _a;
            for (let i = 0; i < fc.features.length; i++) {
                const featureProperties = fc.features[i].properties;
                if (featureProperties === null) {
                    return;
                }
                const featurePropertiesEntires = Object.entries(featureProperties);
                const matchedStyles = this.perPropertyStyles.filter((style) => {
                    var _a;
                    const stylePropertiesEntries = Object.entries((_a = style.properties) !== null && _a !== void 0 ? _a : {});
                    // For every key-value pair in the style, is there an identical one in the feature's properties?
                    return stylePropertiesEntries.every(([styleKey, styleValue]) => featurePropertiesEntires.find(([featKey, featValue]) => {
                        if (typeof styleValue === "string" && !style.caseSensitive) {
                            featKey === styleKey &&
                                (typeof featValue === "string"
                                    ? featValue
                                    : featValue.toString()).toLowerCase() === styleValue.toLowerCase();
                        }
                        return featKey === styleKey && featValue === styleValue;
                    }) !== undefined);
                });
                if (matchedStyles !== undefined) {
                    for (let matched of matchedStyles) {
                        for (let trait of Object.keys(matched.style.traits)) {
                            featureProperties[trait] = (_a = 
                            // @ts-ignore - TS can't tell that `trait` is of the correct index type for style
                            matched.style[trait]) !== null && _a !== void 0 ? _a : featureProperties[trait];
                        }
                    }
                }
            }
        }
        createProtomapsImageryProvider(geoJson) {
            var _a;
            // Don't need protomaps unless we have lines and polygons to show
            // Points are handled by this.createPoints()
            if (this.featureCounts.line + this.featureCounts.polygon === 0)
                return;
            let currentTimeRows;
            // If time varying, get row indices which match
            // This is used to filter feature[FEATURE_ID_PROP]
            if (this.currentTimeAsJulianDate &&
                this.activeTableStyle.timeIntervals &&
                this.activeTableStyle.moreThanOneTimeInterval) {
                currentTimeRows = this.activeTableStyle.timeIntervals.reduce((rows, timeInterval, index) => {
                    if (timeInterval &&
                        TimeInterval.contains(timeInterval, this.currentTimeAsJulianDate)) {
                        rows.push(index);
                    }
                    return rows;
                }, []);
            }
            const rows = (_a = this.activeTableStyle.colorColumn) === null || _a === void 0 ? void 0 : _a.valuesForType;
            const colorMap = this.activeTableStyle.colorMap;
            const outlineStyleMap = this.activeTableStyle.outlineStyleMap.styleMap;
            const useOutlineColorForLineFeatures = this.useOutlineColorForLineFeatures;
            // Style function
            const getColorValue = (z, f) => {
                const rowId = f === null || f === void 0 ? void 0 : f.props[FEATURE_ID_PROP];
                return colorMap
                    .mapValueToColor(isJsonNumber(rowId) ? rows === null || rows === void 0 ? void 0 : rows[rowId] : null)
                    .toCssColorString();
            };
            const getOutlineWidthValue = (z, f) => {
                var _a;
                const rowId = f === null || f === void 0 ? void 0 : f.props[FEATURE_ID_PROP];
                return ((_a = (isConstantStyleMap(outlineStyleMap)
                    ? outlineStyleMap.style.width
                    : outlineStyleMap.mapValueToStyle(isJsonNumber(rowId) ? rowId : -1)
                        .width)) !== null && _a !== void 0 ? _a : this.defaultStyles.polygonStrokeWidth);
            };
            const getOutlineColorValue = (z, f) => {
                var _a;
                const rowId = f === null || f === void 0 ? void 0 : f.props[FEATURE_ID_PROP];
                return ((_a = (isConstantStyleMap(outlineStyleMap)
                    ? outlineStyleMap.style.color
                    : outlineStyleMap.mapValueToStyle(isJsonNumber(rowId) ? rowId : -1)
                        .color)) !== null && _a !== void 0 ? _a : runInAction(() => this.terria.baseMapContrastColor));
            };
            // Filter features by time if applicable
            const showFeature = (z, f) => !currentTimeRows ||
                (isJsonNumber(f === null || f === void 0 ? void 0 : f.props[FEATURE_ID_PROP]) &&
                    currentTimeRows.includes(f === null || f === void 0 ? void 0 : f.props[FEATURE_ID_PROP]));
            let protomapsData = Object.assign({}, geoJson, {
                features: geoJson.features.filter((f) => f.geometry.type !== "Point")
            });
            // Are we creating a protomaps imagery provider with the same geojson data (readyData)?
            // If so we can copy GeojsonSource over to save running geojson-vt again
            if (this._imageryProvider instanceof ProtomapsImageryProvider &&
                this._imageryProvider.source instanceof GeojsonSource &&
                this._imageryProvider.source.geojsonObject === this.readyData) {
                protomapsData = this._imageryProvider.source;
            }
            let provider = new ProtomapsImageryProvider({
                terria: this.terria,
                data: protomapsData,
                paintRules: [
                    // Polygon features
                    {
                        dataLayer: GEOJSON_SOURCE_LAYER_NAME,
                        symbolizer: new PolygonSymbolizer({
                            fill: getColorValue,
                            stroke: getOutlineColorValue,
                            width: getOutlineWidthValue
                        }),
                        minzoom: 0,
                        maxzoom: Infinity,
                        filter: (zoom, feature) => {
                            return ((feature === null || feature === void 0 ? void 0 : feature.geomType) === GeomType.Polygon &&
                                showFeature(zoom, feature));
                        }
                    },
                    // Line features
                    // Note - line color will use TableColorStyleTraits by default.
                    // If useOutlineColorForLineFeatures is true, then line color will use TableOutlineStyle traits
                    {
                        dataLayer: GEOJSON_SOURCE_LAYER_NAME,
                        symbolizer: new LineSymbolizer({
                            color: useOutlineColorForLineFeatures
                                ? getOutlineColorValue
                                : getColorValue,
                            width: getOutlineWidthValue
                        }),
                        minzoom: 0,
                        maxzoom: Infinity,
                        filter: (zoom, feature) => {
                            return ((feature === null || feature === void 0 ? void 0 : feature.geomType) === GeomType.Line &&
                                showFeature(zoom, feature));
                        }
                    }
                    // See `createPoints` for Point features - they are handled by Cesium
                ],
                labelRules: []
            });
            provider = this.wrapImageryPickFeatures(provider);
            return provider;
        }
        async loadCzmlDataSource(geoJson) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const czmlTemplate = runInAction(() => toJS(this.czmlTemplate));
            const rootCzml = [
                {
                    id: "document",
                    name: "CZML",
                    version: "1.0"
                }
            ];
            // Create a czml packet for each geoJson Point/Polygon feature
            // For point: set czml position (CartographicDegrees) to point coordinates
            // For polygon: set czml positions array (CartographicDegreesListValue) for the `polygon` property
            // Set czml properties to feature properties
            for (let i = 0; i < geoJson.features.length; i++) {
                const feature = geoJson.features[i];
                if (feature === null || feature.geometry.type === "Line") {
                    continue;
                }
                if (((_a = feature.geometry) === null || _a === void 0 ? void 0 : _a.type) === "Point") {
                    const czml = clone(czmlTemplate !== null && czmlTemplate !== void 0 ? czmlTemplate : {}, true);
                    const point = feature.geometry;
                    const coords = point.coordinates;
                    // Add height = 0 if no height provided
                    if (coords.length === 2) {
                        coords[2] = 0;
                    }
                    if (isJsonNumber((_b = this.czmlTemplate) === null || _b === void 0 ? void 0 : _b.heightOffset)) {
                        coords[2] += this.czmlTemplate.heightOffset;
                    }
                    czml.position = {
                        cartographicDegrees: point.coordinates
                    };
                    czml.properties = Object.assign((_c = czml.properties) !== null && _c !== void 0 ? _c : {}, stringifyFeatureProperties((_d = feature.properties) !== null && _d !== void 0 ? _d : {}));
                    rootCzml.push(czml);
                }
                else if (((_e = feature.geometry) === null || _e === void 0 ? void 0 : _e.type) === "Polygon" ||
                    (((_f = feature.geometry) === null || _f === void 0 ? void 0 : _f.type) === "MultiPolygon" && (czmlTemplate === null || czmlTemplate === void 0 ? void 0 : czmlTemplate.polygon))) {
                    const czml = clone(czmlTemplate !== null && czmlTemplate !== void 0 ? czmlTemplate : {}, true);
                    // To handle both Polygon and MultiPolygon - transform Polygon coords into MultiPolygon coords
                    const multiPolygonGeom = ((_g = feature.geometry) === null || _g === void 0 ? void 0 : _g.type) === "Polygon"
                        ? [feature.geometry.coordinates]
                        : feature.geometry.coordinates;
                    // Loop through Polygons in MultiPolygon
                    for (let j = 0; j < multiPolygonGeom.length; j++) {
                        const geom = multiPolygonGeom[j];
                        const positions = [];
                        const holes = [];
                        geom[0].forEach((coords) => {
                            var _a, _b;
                            if (isJsonNumber((_a = this.czmlTemplate) === null || _a === void 0 ? void 0 : _a.heightOffset)) {
                                coords[2] = ((_b = coords[2]) !== null && _b !== void 0 ? _b : 0) + this.czmlTemplate.heightOffset;
                            }
                            positions.push(coords[0], coords[1], coords[2]);
                        });
                        geom.forEach((ring, idx) => {
                            if (idx === 0)
                                return;
                            holes.push(ring.reduce((acc, current) => {
                                var _a, _b;
                                if (isJsonNumber((_a = this.czmlTemplate) === null || _a === void 0 ? void 0 : _a.heightOffset)) {
                                    current[2] =
                                        ((_b = current[2]) !== null && _b !== void 0 ? _b : 0) + this.czmlTemplate.heightOffset;
                                }
                                acc.push(current[0], current[1], current[2]);
                                return acc;
                            }, []));
                        });
                        czml.polygon.positions = { cartographicDegrees: positions };
                        czml.polygon.holes = { cartographicDegrees: holes };
                        czml.properties = Object.assign((_h = czml.properties) !== null && _h !== void 0 ? _h : {}, stringifyFeatureProperties((_j = feature.properties) !== null && _j !== void 0 ? _j : {}));
                        rootCzml.push(czml);
                    }
                }
            }
            return CzmlDataSource.load(rootCzml);
        }
        get defaultStyles() {
            var _a, _b, _c;
            return {
                markerSize: 24,
                markerColor: getRandomCssColor((_a = this.name) !== null && _a !== void 0 ? _a : ""),
                stroke: getColor(this.terria.baseMapContrastColor),
                markerStroke: getColor(this.terria.baseMapContrastColor),
                polygonStroke: getColor(this.terria.baseMapContrastColor),
                polylineStroke: getRandomCssColor((_b = this.name) !== null && _b !== void 0 ? _b : ""),
                markerStrokeWidth: 1,
                polylineStrokeWidth: 2,
                polygonStrokeWidth: 1,
                fill: getRandomCssColor(((_c = this.name) !== null && _c !== void 0 ? _c : "") + " fill"),
                fillAlpha: 0.75
            };
        }
        /** Applies default values on top of GeoJson StyleTraits. This is only used for Cesium Primitives.*/
        get stylesWithDefaults() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const defaultColor = (colString, defaultColor) => (colString ? getColor(colString) : defaultColor);
            const options = {
                describe: describeWithoutUnderscores,
                markerSize: (_a = parseMarkerSize(this.style["marker-size"])) !== null && _a !== void 0 ? _a : this.defaultStyles.markerSize,
                markerSymbol: this.style["marker-symbol"],
                markerColor: defaultColor(this.style["marker-color"], this.defaultStyles.markerColor),
                stroke: defaultColor(this.style.stroke, this.defaultStyles.stroke),
                polygonStroke: defaultColor((_b = this.style["polygon-stroke"]) !== null && _b !== void 0 ? _b : this.style.stroke, this.defaultStyles.polygonStroke),
                // Note these specific stroke widths are only used for geojson-vt
                polylineStroke: defaultColor((_c = this.style["polyline-stroke"]) !== null && _c !== void 0 ? _c : this.style.stroke, this.defaultStyles.polylineStroke),
                markerStroke: defaultColor((_d = this.style["marker-stroke"]) !== null && _d !== void 0 ? _d : this.style.stroke, this.defaultStyles.markerStroke),
                markerStrokeWidth: (_f = (_e = this.style["marker-stroke-width"]) !== null && _e !== void 0 ? _e : this.style["stroke-width"]) !== null && _f !== void 0 ? _f : this.defaultStyles.markerStrokeWidth,
                polylineStrokeWidth: (_h = (_g = this.style["polyline-stroke-width"]) !== null && _g !== void 0 ? _g : this.style["stroke-width"]) !== null && _h !== void 0 ? _h : this.defaultStyles.polylineStrokeWidth,
                polygonStrokeWidth: (_k = (_j = this.style["polygon-stroke-width"]) !== null && _j !== void 0 ? _j : this.style["stroke-width"]) !== null && _k !== void 0 ? _k : this.defaultStyles.polygonStrokeWidth,
                markerOpacity: this.style["marker-opacity"],
                fill: defaultColor(this.style.fill, this.defaultStyles.fill),
                clampToGround: this.clampToGround,
                markerUrl: this.style["marker-url"] // not in SimpleStyle spec but gives an alternate to maki marker symbols
                    ? proxyCatalogItemUrl(this, this.style["marker-url"])
                    : undefined,
                credit: this.attribution
            };
            if (isDefined(this.style["stroke-opacity"])) {
                options.stroke.alpha = this.style["stroke-opacity"];
                options.polygonStroke.alpha = this.style["stroke-opacity"];
                options.polylineStroke.alpha = this.style["stroke-opacity"];
                options.markerStroke.alpha = this.style["stroke-opacity"];
            }
            if (isDefined(this.style["fill-opacity"])) {
                options.fill.alpha = this.style["fill-opacity"];
            }
            else {
                options.fill.alpha = this.defaultStyles.fillAlpha;
            }
            return toJS(options);
        }
        async loadGeoJsonDataSource(geoJson) {
            /* Style information is applied as follows, in decreasing priority:
                  - simple-style properties set directly on individual features in the GeoJSON file
                  - simple-style properties set as the 'Style' property on the catalog item
                  - our 'this.styles' set below (and point styling applied after Cesium loads the GeoJSON)
                  - if anything is underspecified there, then Cesium's defaults come in.
                  See https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0
            */
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            this.addPerPropertyStyleToGeoJson(geoJson);
            const now = JulianDate.now();
            const styles = runInAction(() => this.stylesWithDefaults);
            const dataSource = await GeoJsonDataSource.load(geoJson, styles);
            const entities = dataSource.entities;
            for (let i = 0; i < entities.values.length; ++i) {
                const entity = entities.values[i];
                const properties = entity.properties;
                // Time
                if (isDefined(properties) &&
                    isDefined(this.timeProperty) &&
                    isDefined(this.discreteTimesAsSortedJulianDates)) {
                    const startTimeDiscreteTime = properties[this.timeProperty];
                    const startTimeIdx = (_a = this.discreteTimesAsSortedJulianDates) === null || _a === void 0 ? void 0 : _a.findIndex((t) => t.tag === startTimeDiscreteTime.getValue());
                    const startTime = this.discreteTimesAsSortedJulianDates[startTimeIdx];
                    if (isDefined(startTime)) {
                        const endTimeIdx = startTimeIdx + 1;
                        const endTime = this.discreteTimesAsSortedJulianDates[endTimeIdx];
                        entity.availability = new TimeIntervalCollection([
                            new TimeInterval({
                                start: startTime.time,
                                stop: (_b = endTime === null || endTime === void 0 ? void 0 : endTime.time) !== null && _b !== void 0 ? _b : Iso8601.MAXIMUM_VALUE,
                                isStopIncluded: false
                            })
                        ]);
                    }
                }
                // Billboard
                if (isDefined(entity.billboard) && isDefined(styles.markerUrl)) {
                    entity.billboard = new BillboardGraphics({
                        image: new ConstantProperty(styles.markerUrl),
                        width: properties && properties["marker-width"]
                            ? new ConstantProperty(properties["marker-width"])
                            : undefined,
                        height: properties && properties["marker-height"]
                            ? new ConstantProperty(properties["marker-height"])
                            : undefined,
                        rotation: properties && properties["marker-angle"]
                            ? new ConstantProperty(properties["marker-angle"])
                            : undefined,
                        heightReference: styles.clampToGround
                            ? new ConstantProperty(HeightReference.RELATIVE_TO_GROUND)
                            : undefined
                    });
                    /* If no marker symbol was provided but Cesium has generated one for a point, then turn it into
                         a filled circle instead of the default marker. */
                }
                else if (isDefined(entity.billboard) &&
                    (!properties || !isDefined(properties["marker-symbol"])) &&
                    !isDefined(styles.markerSymbol)) {
                    entity.point = new PointGraphics({
                        color: new ConstantProperty(getColor((_d = (_c = properties === null || properties === void 0 ? void 0 : properties["marker-color"]) === null || _c === void 0 ? void 0 : _c.getValue()) !== null && _d !== void 0 ? _d : styles.markerColor)),
                        pixelSize: new ConstantProperty((_f = parseMarkerSize(properties && ((_e = properties["marker-size"]) === null || _e === void 0 ? void 0 : _e.getValue()))) !== null && _f !== void 0 ? _f : styles.markerSize / 2),
                        outlineWidth: new ConstantProperty((_h = (_g = properties === null || properties === void 0 ? void 0 : properties["stroke-width"]) === null || _g === void 0 ? void 0 : _g.getValue()) !== null && _h !== void 0 ? _h : styles.markerStrokeWidth),
                        outlineColor: new ConstantProperty(getColor((_k = (_j = properties === null || properties === void 0 ? void 0 : properties.stroke) === null || _j === void 0 ? void 0 : _j.getValue()) !== null && _k !== void 0 ? _k : styles.polygonStroke)),
                        heightReference: new ConstantProperty(styles.clampToGround
                            ? HeightReference.RELATIVE_TO_GROUND
                            : undefined)
                    });
                    if (properties &&
                        isDefined(properties["marker-opacity"]) &&
                        entity.point.color) {
                        // not part of SimpleStyle spec, but why not?
                        const color = entity.point.color.getValue(now);
                        color.alpha = parseFloat((_l = properties["marker-opacity"]) === null || _l === void 0 ? void 0 : _l.getValue());
                    }
                    entity.billboard = undefined;
                }
                if (isDefined(entity.billboard) &&
                    properties &&
                    isDefined((_m = properties["marker-opacity"]) === null || _m === void 0 ? void 0 : _m.getValue())) {
                    entity.billboard.color = new ConstantProperty(new Color(1, 1, 1, parseFloat((_o = properties["marker-opacity"]) === null || _o === void 0 ? void 0 : _o.getValue())));
                }
                if (isDefined(entity.polygon)) {
                    // Extrude polygons if heightProperty is set
                    if (this.heightProperty &&
                        properties &&
                        isDefined(properties[this.heightProperty])) {
                        entity.polygon.closeTop = new ConstantProperty(true);
                        entity.polygon.extrudedHeight = properties[this.heightProperty];
                        entity.polygon.heightReference = new ConstantProperty(HeightReference.CLAMP_TO_GROUND);
                        entity.polygon.extrudedHeightReference = new ConstantProperty(HeightReference.RELATIVE_TO_GROUND);
                    }
                    // Cesium on Windows can't render polygons with a stroke-width > 1.0.  And even on other platforms it
                    // looks bad because WebGL doesn't mitre the lines together nicely.
                    // As a workaround for the special case where the polygon is unfilled anyway, change it to a polyline.
                    else if (polygonHasWideOutline(entity.polygon, now) &&
                        !polygonIsFilled(entity.polygon)) {
                        createPolylineFromPolygon(entities, entity, now);
                        entity.polygon = undefined;
                    }
                    else if (polygonHasOutline(entity.polygon, now) &&
                        isPolygonOnTerrain(entity.polygon, now)) {
                        // Polygons don't directly support outlines when they're on terrain.
                        // So create a manual outline.
                        createPolylineFromPolygon(entities, entity, now);
                    }
                }
            }
            return dataSource;
        }
        get discreteTimes() {
            if (this.readyData === undefined) {
                return undefined;
            }
            // If we are using mvt (mapbox vector tiles / protomaps imagery provider) return TableMixin.discreteTimes
            if (this.useTableStylingAndProtomaps)
                return super.discreteTimes;
            // If using timeProperty - get discrete times from that
            if (this.timeProperty) {
                const discreteTimesMap = new Map();
                for (let i = 0; i < this.readyData.features.length; i++) {
                    const feature = this.readyData.features[i];
                    if (feature.properties !== null &&
                        feature.properties !== undefined &&
                        feature.properties[this.timeProperty] !== undefined) {
                        const dt = {
                            time: new Date(`${feature.properties[this.timeProperty]}`).toISOString(),
                            tag: feature.properties[this.timeProperty]
                        };
                        discreteTimesMap.set(dt.tag, dt);
                    }
                }
                return Array.from(discreteTimesMap.values());
            }
        }
        /**
         * Transform feature properties into column-major format.
         * This enables all TableMixin functionality - which is used for styling vector tiles.
         * If this returns an empty array, TableMixin will effectively be disabled
         */
        get dataColumnMajor() {
            if (!this.readyData || !this.useTableStylingAndProtomaps)
                return [];
            // Map from property name (column name) to column index
            const colMap = new Map();
            const dataColumnMajor = [];
            dataColumnMajor[0] = new Array(this.readyData.features.length + 1).fill("");
            for (let i = 0; i < this.readyData.features.length; i++) {
                const feature = this.readyData.features[i];
                // Loop through feature properties
                if (feature.properties) {
                    for (let j = 0; j < Object.keys(feature.properties).length; j++) {
                        const prop = Object.keys(feature.properties)[j];
                        const value = feature.properties[prop];
                        let colIndex = colMap.get(prop);
                        // If column isn't in colMap - we need to create it
                        if (!isDefined(colIndex)) {
                            colIndex = colMap.size;
                            colMap.set(prop, colIndex);
                            dataColumnMajor[colIndex] = new Array(this.readyData.features.length + 1).fill("");
                        }
                        if (typeof value === "string") {
                            dataColumnMajor[colIndex][i + 1] = value;
                        }
                        else if (typeof value === "number") {
                            dataColumnMajor[colIndex][i + 1] = value.toString();
                        }
                    }
                }
            }
            // Set column titles
            colMap.forEach((index, prop) => {
                dataColumnMajor[index][0] = prop;
            });
            return dataColumnMajor;
        }
        /** We don't need to use TableMixin forceLoadTableData
         * We implement `get dataColumnMajor()` instead
         */
        async forceLoadTableData() {
            return undefined;
        }
        get viewingControls() {
            return !this.useTableStylingAndProtomaps
                ? super.viewingControls.filter((v) => v.id !== TableStylingWorkflow.type)
                : super.viewingControls;
        }
    }
    __decorate([
        observable
    ], GeoJsonMixin.prototype, "_dataSource", void 0);
    __decorate([
        observable
    ], GeoJsonMixin.prototype, "_imageryProvider", void 0);
    __decorate([
        observable.ref
    ], GeoJsonMixin.prototype, "_readyData", void 0);
    __decorate([
        observable
    ], GeoJsonMixin.prototype, "featureCounts", void 0);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "name", null);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "cacheDuration", null);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "readyData", null);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "_canExportData", null);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "mapItems", null);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "useTableStylingAndProtomaps", null);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "chartItems", null);
    __decorate([
        action
    ], GeoJsonMixin.prototype, "addPerPropertyStyleToGeoJson", null);
    __decorate([
        action
    ], GeoJsonMixin.prototype, "createProtomapsImageryProvider", null);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "defaultStyles", null);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "stylesWithDefaults", null);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "discreteTimes", null);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "dataColumnMajor", null);
    __decorate([
        computed
    ], GeoJsonMixin.prototype, "viewingControls", null);
    return GeoJsonMixin;
}
(function (GeoJsonMixin) {
    function isMixedInto(model) {
        return model && model.isGeoJson;
    }
    GeoJsonMixin.isMixedInto = isMixedInto;
})(GeoJsonMixin || (GeoJsonMixin = {}));
export default GeoJsonMixin;
// Note: these type checks are not that rigorous, we are assuming we are getting valid GeoJson objects
export function isFeatureCollection(json) {
    return (isJsonObject(json, false) &&
        json.type === "FeatureCollection" &&
        Array.isArray(json.features));
}
export function isFeature(json) {
    return (isJsonObject(json, false) && json.type === "Feature" && !!json.geometry);
}
export function isPoint(json) {
    return (isJsonObject(json, false) &&
        json.type === "Feature" &&
        isJsonObject(json.geometry, false) &&
        json.geometry.type === "Point");
}
export function isMultiPoint(json) {
    return (isJsonObject(json, false) &&
        json.type === "Feature" &&
        isJsonObject(json.geometry, false) &&
        json.geometry.type === "MultiPoint");
}
export function isGeometries(json) {
    return (isJsonObject(json, false) &&
        isJsonString(json.type) &&
        [
            "Point",
            "MultiPoint",
            "LineString",
            "MultiLineString",
            "Polygon",
            "MultiPolygon"
        ].includes(json.type) &&
        Array.isArray(json.coordinates));
}
export function toFeatureCollection(json) {
    if (isFeatureCollection(json))
        return json; // It's already a feature collection, do nothing
    if (isFeature(json)) {
        // Move CRS data from Feature to FeatureCollection
        if ("crs" in json && isJsonObject(json.crs)) {
            const crs = json.crs;
            delete json.crs;
            const fc = featureCollection([json]);
            fc.crs = crs;
            return fc;
        }
        return featureCollection([json]);
    }
    if (isGeometries(json))
        return featureCollection([feature(json)]);
    if (Array.isArray(json) && json.every((item) => isFeature(item))) {
        return featureCollection(json);
    }
    if (Array.isArray(json) && json.every((item) => isGeometries(item))) {
        return featureCollection(json.map((item) => feature(item, item.properties)));
    }
}
function createPolylineFromPolygon(entities, entity, now) {
    const polygon = entity.polygon;
    entity.polyline = new PolylineGraphics();
    entity.polyline.show = polygon.show;
    if (isPolygonOnTerrain(polygon, now)) {
        entity.polyline.clampToGround = new ConstantProperty(true);
    }
    if (isDefined(polygon.outlineColor)) {
        entity.polyline.material = new ColorMaterialProperty(polygon.outlineColor);
    }
    const hierarchy = getPropertyValue(polygon.hierarchy);
    if (!hierarchy) {
        return;
    }
    const positions = closePolyline(hierarchy.positions);
    entity.polyline.positions = new ConstantProperty(positions);
    entity.polyline.width =
        polygon.outlineWidth && polygon.outlineWidth.getValue(now);
    createEntitiesFromHoles(entities, hierarchy.holes, entity);
}
async function reprojectToGeographic(geoJson, proj4ServiceBaseUrl) {
    let code;
    if (!isJsonObject(geoJson.crs)) {
        code = undefined;
    }
    else if (geoJson.crs.type === "EPSG" &&
        isJsonObject(geoJson.crs.properties) &&
        typeof geoJson.crs.properties.code === "string") {
        code = "EPSG:" + geoJson.crs.properties.code;
    }
    else if (isJsonObject(geoJson.crs.properties) &&
        geoJson.crs.type === "name" &&
        typeof geoJson.crs.properties.name === "string") {
        code = Reproject.crsStringToCode(geoJson.crs.properties.name);
    }
    geoJson.crs = {
        type: "EPSG",
        properties: {
            code: "4326"
        }
    };
    if (!code || !Reproject.willNeedReprojecting(code)) {
        return Promise.resolve(geoJson);
    }
    const needsReprojection = proj4ServiceBaseUrl
        ? await Reproject.checkProjection(proj4ServiceBaseUrl, code)
        : false;
    if (needsReprojection) {
        try {
            filterValue(geoJson, "coordinates", function (obj, prop) {
                obj[prop] = filterArray(obj[prop], function (pts) {
                    if (pts.length === 0)
                        return [];
                    return reprojectPointList(pts, code);
                });
            });
            return geoJson;
        }
        catch (e) {
            throw TerriaError.from(e, "Failed to reproject geoJSON");
        }
    }
    else {
        throw new DeveloperError("The crs code for this datasource is unsupported.");
    }
}
// Reproject a point list based on the supplied crs code.
function reprojectPointList(pts, code) {
    if (!code)
        return [];
    if (!Array.isArray(pts[0])) {
        return Reproject.reprojectPoint(pts, code, "EPSG:4326");
    }
    const pts_out = [];
    for (let i = 0; i < pts.length; i++) {
        const pt = pts[i];
        if (Array.isArray(pt))
            pts_out.push(Reproject.reprojectPoint(pt, code, "EPSG:4326"));
    }
    return pts_out;
}
// Find a member by name in the gml.
function filterValue(obj, prop, func) {
    for (let p in obj) {
        if (obj.hasOwnProperty(p) === false) {
            continue;
        }
        else if (p === prop) {
            if (func && typeof func === "function") {
                func(obj, prop);
            }
        }
        else if (typeof obj[p] === "object") {
            filterValue(obj[p], prop, func);
        }
    }
}
// Filter a geojson coordinates array structure.
function filterArray(pts, func) {
    if (!(pts[0] instanceof Array) || !(pts[0][0] instanceof Array)) {
        pts = func(pts);
        return pts;
    }
    const result = new Array(pts.length);
    for (let i = 0; i < pts.length; i++) {
        result[i] = filterArray(pts[i], func); // at array of arrays of points
    }
    return result;
}
/**
 * Get a random color for the data based on the passed string (usually dataset name).
 */
function getRandomCssColor(name, cssColors = StandardCssColors.highContrast) {
    const index = hashFromString(name) % cssColors.length;
    const color = Color.fromCssColorString(cssColors[index]);
    color.alpha = 1;
    return color;
}
const simpleStyleIdentifiers = [
    "title",
    "description",
    "marker-size",
    "marker-symbol",
    "marker-color",
    "stroke",
    "stroke-opacity",
    "stroke-width",
    "fill",
    "fill-opacity"
];
// This next function modelled on Cesium.geoJsonDataSource's defaultDescribe.
function describeWithoutUnderscores(properties, nameProperty) {
    let html = "";
    for (let key in properties) {
        if (properties.hasOwnProperty(key)) {
            if (key === nameProperty || simpleStyleIdentifiers.indexOf(key) !== -1) {
                continue;
            }
            let value = properties[key];
            if (typeof value === "object") {
                value = describeWithoutUnderscores(value);
            }
            else {
                value = formatPropertyValue(value);
            }
            key = key.replace(/_/g, " ");
            if (isDefined(value)) {
                html += "<tr><th>" + key + "</th><td>" + value + "</td></tr>";
            }
        }
    }
    if (html.length > 0) {
        html =
            '<table class="cesium-infoBox-defaultTable"><tbody>' +
                html +
                "</tbody></table>";
    }
    return html;
}
function polygonHasOutline(polygon, now) {
    return (isDefined(polygon.outlineWidth) && polygon.outlineWidth.getValue(now) > 0);
}
function polygonHasWideOutline(polygon, now) {
    return (isDefined(polygon.outlineWidth) && polygon.outlineWidth.getValue(now) > 1);
}
function polygonIsFilled(polygon) {
    var _a;
    let fill = true;
    if (isDefined(polygon.fill)) {
        fill = polygon.fill.getValue(new JulianDate());
    }
    if (!fill) {
        return false;
    }
    if (!isDefined(polygon.material)) {
        // The default is solid white.
        return true;
    }
    let color;
    if (polygon.material instanceof Color) {
        color = polygon.material.getValue(new JulianDate());
    }
    else {
        color = (_a = polygon.material.color) === null || _a === void 0 ? void 0 : _a.getValue(new JulianDate());
    }
    if (color && color.alpha === 0.0) {
        return false;
    }
    return true;
}
function closePolyline(positions) {
    // If the first and last positions are more than a meter apart, duplicate the first position so the polyline is closed.
    if (positions.length >= 2 &&
        !Cartesian3.equalsEpsilon(positions[0], positions[positions.length - 1], 0.0, 1.0)) {
        const copy = positions.slice();
        copy.push(positions[0]);
        return copy;
    }
    return positions;
}
function createEntitiesFromHoles(entityCollection, holes, mainEntity) {
    if (!isDefined(holes)) {
        return;
    }
    for (let i = 0; i < holes.length; ++i) {
        createEntityFromHole(entityCollection, holes[i], mainEntity);
    }
}
function createEntityFromHole(entityCollection, hole, mainEntity) {
    if (!isDefined(hole) ||
        !isDefined(hole.positions) ||
        hole.positions.length === 0) {
        return;
    }
    const entity = new Entity();
    entity.name = mainEntity.name;
    entity.availability = mainEntity.availability;
    entity.description = mainEntity.description;
    entity.properties = mainEntity.properties;
    entity.polyline = new PolylineGraphics();
    entity.polyline.show = mainEntity.polyline.show;
    entity.polyline.material = mainEntity.polyline.material;
    entity.polyline.width = mainEntity.polyline.width;
    entity.polyline.clampToGround = mainEntity.polyline.clampToGround;
    closePolyline(hole.positions);
    entity.polyline.positions = new ConstantProperty(hole.positions);
    entityCollection.add(entity);
    createEntitiesFromHoles(entityCollection, hole.holes, mainEntity);
}
function getPropertyValue(property) {
    if (property === undefined) {
        return undefined;
    }
    return property.getValue(JulianDate.now());
}
function isPolygonOnTerrain(polygon, now) {
    const polygonAny = polygon;
    const isClamped = polygonAny.heightReference &&
        polygonAny.heightReference.getValue(now) ===
            HeightReference.CLAMP_TO_GROUND;
    const hasPerPositionHeight = polygon.perPositionHeight && polygon.perPositionHeight.getValue(now);
    const hasPolygonHeight = polygon.height && polygon.height.getValue(now) !== undefined;
    return isClamped || (!hasPerPositionHeight && !hasPolygonHeight);
}
export function getColor(color) {
    var _a;
    if (typeof color === "string" || color instanceof String) {
        return (_a = Color.fromCssColorString(color.toString())) !== null && _a !== void 0 ? _a : Color.GRAY;
    }
    else {
        return color;
    }
}
export function parseMarkerSize(sizeString) {
    const sizes = {
        small: 24,
        medium: 48,
        large: 64
    };
    if (sizeString === undefined) {
        return undefined;
    }
    if (sizes[sizeString] !== undefined) {
        return sizes[sizeString];
    }
    return parseInt(sizeString, 10); // SimpleStyle doesn't allow 'marker-size: 20', but people will do it.
}
function stringifyFeatureProperties(featureProps) {
    return Object.keys(featureProps !== null && featureProps !== void 0 ? featureProps : {}).reduce((properties, key) => {
        const featureProp = featureProps[key];
        if (typeof featureProp === "string") {
            properties[key] = featureProp;
        }
        else if (isDefined(featureProp) &&
            featureProp !== null &&
            typeof featureProp.toString === "function")
            properties[key] = featureProp.toString();
        return properties;
    }, {});
}
//# sourceMappingURL=GeojsonMixin.js.map
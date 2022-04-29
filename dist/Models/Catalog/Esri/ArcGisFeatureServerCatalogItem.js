var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed, runInAction } from "mobx";
import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import Color from "terriajs-cesium/Source/Core/Color";
import createGuid from "terriajs-cesium/Source/Core/createGuid";
import BillboardGraphics from "terriajs-cesium/Source/DataSources/BillboardGraphics";
import ColorMaterialProperty from "terriajs-cesium/Source/DataSources/ColorMaterialProperty";
import ConstantProperty from "terriajs-cesium/Source/DataSources/ConstantProperty";
import PolylineDashMaterialProperty from "terriajs-cesium/Source/DataSources/PolylineDashMaterialProperty";
import HeightReference from "terriajs-cesium/Source/Scene/HeightReference";
import URI from "urijs";
import isDefined from "../../../Core/isDefined";
import loadJson from "../../../Core/loadJson";
import replaceUnderscores from "../../../Core/replaceUnderscores";
import TerriaError, { networkRequestError } from "../../../Core/TerriaError";
import featureDataToGeoJson from "../../../Map/featureDataToGeoJson";
import proj4definitions from "../../../Map/Proj4Definitions";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import ArcGisFeatureServerCatalogItemTraits from "../../../Traits/TraitsClasses/ArcGisFeatureServerCatalogItemTraits";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import LegendTraits, { LegendItemTraits } from "../../../Traits/TraitsClasses/LegendTraits";
import { RectangleTraits } from "../../../Traits/TraitsClasses/MappableTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import GeoJsonCatalogItem from "../CatalogItems/GeoJsonCatalogItem";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import { getLineStyleCesium } from "./esriLineStyle";
import GeoJsonDataSource from "terriajs-cesium/Source/DataSources/GeoJsonDataSource";
const proj4 = require("proj4").default;
const defaultColor = [255, 255, 255, 255];
const defaultFillColor = [255, 255, 255, 1];
const defaultOutlineColor = [0, 0, 0, 255];
class FeatureServerStratum extends LoadableStratum(ArcGisFeatureServerCatalogItemTraits) {
    constructor(_item, _geoJsonItem, _featureServer, _esriJson) {
        super();
        this._item = _item;
        this._geoJsonItem = _geoJsonItem;
        this._featureServer = _featureServer;
        this._esriJson = _esriJson;
    }
    duplicateLoadableStratum(newModel) {
        return new FeatureServerStratum(newModel, this._geoJsonItem, this._featureServer, this._esriJson);
    }
    get featureServerData() {
        return this._featureServer;
    }
    get geoJsonItem() {
        return this._geoJsonItem;
    }
    static async load(item) {
        if (!isDefined(item.url) || !isDefined(item.uri)) {
            throw new TerriaError({
                title: i18next.t("models.arcGisFeatureServerCatalogItem.missingUrlTitle"),
                message: i18next.t("models.arcGisFeatureServerCatalogItem.missingUrlMessage")
            });
        }
        const geoJsonItem = new GeoJsonCatalogItem(createGuid(), item.terria);
        geoJsonItem.setTrait(CommonStrata.definition, "clampToGround", item.clampToGround);
        geoJsonItem.setTrait(CommonStrata.definition, "attribution", item.attribution);
        geoJsonItem.setTrait(CommonStrata.definition, "forceCesiumPrimitives", true);
        let tempEsriJson = null;
        const esriJson = await loadGeoJson(item);
        const geoJsonData = featureDataToGeoJson(esriJson.layers[0]);
        if (!geoJsonData) {
            throw TerriaError.from("Failed to convert ESRI json data into GeoJSON");
        }
        geoJsonItem.setTrait(CommonStrata.definition, "geoJsonData", geoJsonData);
        (await geoJsonItem.loadMetadata()).throwIfError();
        const featureServer = await loadMetadata(item);
        const stratum = new FeatureServerStratum(item, geoJsonItem, featureServer, tempEsriJson);
        return stratum;
    }
    get shortReport() {
        var _a;
        // Show notice if reached
        if ((_a = this._esriJson) === null || _a === void 0 ? void 0 : _a.exceededTransferLimit) {
            return i18next.t("models.arcGisFeatureServerCatalogItem.reachedMaxFeatureLimit", this);
        }
        return undefined;
    }
    get maximumScale() {
        return this._featureServer.maxScale;
    }
    get name() {
        if (this._featureServer.name && this._featureServer.name.length > 0) {
            return replaceUnderscores(this._featureServer.name);
        }
    }
    get dataCustodian() {
        if (this._featureServer.documentInfo &&
            this._featureServer.documentInfo.Author &&
            this._featureServer.documentInfo.Author.length > 0) {
            return this._featureServer.documentInfo.Author;
        }
    }
    get rectangle() {
        var _a, _b, _c;
        const extent = this._featureServer.extent;
        const wkidCode = (_b = (_a = extent === null || extent === void 0 ? void 0 : extent.spatialReference) === null || _a === void 0 ? void 0 : _a.latestWkid) !== null && _b !== void 0 ? _b : (_c = extent === null || extent === void 0 ? void 0 : extent.spatialReference) === null || _c === void 0 ? void 0 : _c.wkid;
        if (isDefined(extent) && isDefined(wkidCode)) {
            const wkid = "EPSG:" + wkidCode;
            if (!isDefined(proj4definitions[wkid])) {
                return undefined;
            }
            const source = new proj4.Proj(proj4definitions[wkid]);
            const dest = new proj4.Proj("EPSG:4326");
            let p = proj4(source, dest, [extent.xmin, extent.ymin]);
            const west = p[0];
            const south = p[1];
            p = proj4(source, dest, [extent.xmax, extent.ymax]);
            const east = p[0];
            const north = p[1];
            const rectangle = { west: west, south: south, east: east, north: north };
            return createStratumInstance(RectangleTraits, rectangle);
        }
        return undefined;
    }
    get info() {
        return [
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogItem.dataDescription"),
                content: this._featureServer.description
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogItem.copyrightText"),
                content: this._featureServer.copyrightText
            })
        ];
    }
    get legends() {
        if (!this._item.useStyleInformationFromService ||
            !this._featureServer.drawingInfo) {
            return undefined;
        }
        const renderer = this._featureServer.drawingInfo.renderer;
        const rendererType = renderer.type;
        let infos;
        if (rendererType === "uniqueValue") {
            infos = renderer.uniqueValueInfos;
        }
        else if (rendererType === "classBreaks") {
            infos = renderer.classBreakInfos;
        }
        else if (rendererType === "simple") {
            infos = [renderer];
        }
        else {
            return undefined;
        }
        const items = [];
        infos.forEach(info => {
            var _a;
            const label = replaceUnderscores(info.label);
            const symbol = info.symbol;
            if (!symbol || symbol.style === "esriSLSNull") {
                return;
            }
            const color = symbol.color;
            const imageUrl = symbol.imageData
                ? proxyCatalogItemUrl(this._item, `data:${symbol.contentType};base64,${symbol.imageData}`)
                : undefined;
            const outlineColor = (_a = symbol.outline) === null || _a === void 0 ? void 0 : _a.color;
            items.push(createStratumInstance(LegendItemTraits, {
                title: label,
                imageUrl,
                color: color
                    ? convertEsriColorToCesiumColor(color).toCssColorString()
                    : undefined,
                outlineColor: outlineColor
                    ? convertEsriColorToCesiumColor(outlineColor).toCssColorString()
                    : undefined
            }));
        });
        return [createStratumInstance(LegendTraits, { items })];
    }
}
FeatureServerStratum.stratumName = "featureServer";
__decorate([
    computed
], FeatureServerStratum.prototype, "shortReport", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "maximumScale", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "name", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "dataCustodian", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "rectangle", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "info", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "legends", null);
StratumOrder.addLoadStratum(FeatureServerStratum.stratumName);
export default class ArcGisFeatureServerCatalogItem extends MappableMixin(UrlMixin(CatalogMemberMixin(CreateModel(ArcGisFeatureServerCatalogItemTraits)))) {
    get type() {
        return ArcGisFeatureServerCatalogItem.type;
    }
    get typeName() {
        return i18next.t("models.arcGisFeatureServerCatalogItem.name");
    }
    forceLoadMetadata() {
        return FeatureServerStratum.load(this).then(stratum => {
            runInAction(() => {
                this.strata.set(FeatureServerStratum.stratumName, stratum);
            });
        });
    }
    async forceLoadMapItems() {
        const that = this;
        if (isDefined(that.geoJsonItem)) {
            (await that.geoJsonItem.loadMapItems()).throwIfError();
            const featureServerData = that.featureServerData;
            if (that.useStyleInformationFromService &&
                featureServerData &&
                featureServerData.drawingInfo) {
                const renderer = featureServerData.drawingInfo.renderer;
                const rendererType = renderer.type;
                that.mapItems.forEach(mapItem => {
                    if (!(mapItem instanceof GeoJsonDataSource))
                        return;
                    const entities = mapItem.entities;
                    entities.suspendEvents();
                    // A 'simple' renderer only applies a single style to all features
                    if (rendererType === "simple") {
                        const simpleRenderer = renderer;
                        const symbol = simpleRenderer.symbol;
                        if (symbol) {
                            entities.values.forEach(function (entity) {
                                updateEntityWithEsriStyle(entity, symbol, that);
                            });
                        }
                        // For a 'uniqueValue' renderer symbology gets applied via feature properties.
                    }
                    else if (renderer.type === "uniqueValue") {
                        const uniqueValueRenderer = renderer;
                        const rendererObj = setupUniqueValueRenderer(uniqueValueRenderer);
                        entities.values.forEach(function (entity) {
                            const symbol = getUniqueValueSymbol(entity, uniqueValueRenderer, rendererObj);
                            if (symbol) {
                                updateEntityWithEsriStyle(entity, symbol, that);
                            }
                        });
                        // For a 'classBreaks' renderer symbology gets applied via classes or ranges of data.
                    }
                    else if (renderer.type === "classBreaks") {
                        const classBreaksRenderer = renderer;
                        entities.values.forEach(function (entity) {
                            const symbol = getClassBreaksSymbol(entity, classBreaksRenderer);
                            if (symbol) {
                                updateEntityWithEsriStyle(entity, symbol, that);
                            }
                        });
                    }
                    entities.resumeEvents();
                });
            }
        }
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    get geoJsonItem() {
        const stratum = (this.strata.get(FeatureServerStratum.stratumName));
        return isDefined(stratum) ? stratum.geoJsonItem : undefined;
    }
    get featureServerData() {
        const stratum = (this.strata.get(FeatureServerStratum.stratumName));
        return isDefined(stratum) ? stratum.featureServerData : undefined;
    }
    get mapItems() {
        if (isDefined(this.geoJsonItem)) {
            return this.geoJsonItem.mapItems.map(mapItem => {
                mapItem.show = this.show;
                return mapItem;
            });
        }
        return [];
    }
}
ArcGisFeatureServerCatalogItem.type = "esri-featureServer";
__decorate([
    computed
], ArcGisFeatureServerCatalogItem.prototype, "cacheDuration", null);
__decorate([
    computed
], ArcGisFeatureServerCatalogItem.prototype, "geoJsonItem", null);
__decorate([
    computed
], ArcGisFeatureServerCatalogItem.prototype, "featureServerData", null);
__decorate([
    computed
], ArcGisFeatureServerCatalogItem.prototype, "mapItems", null);
function setupUniqueValueRenderer(renderer) {
    const out = {};
    for (var i = 0; i < renderer.uniqueValueInfos.length; i++) {
        const val = renderer.uniqueValueInfos[i].value;
        out[val] = renderer.uniqueValueInfos[i];
    }
    return out;
}
function getUniqueValueSymbol(entity, uniqueValueRenderer, rendererObj) {
    if (!entity.properties) {
        return uniqueValueRenderer.defaultSymbol;
    }
    let entityUniqueValue = entity.properties[uniqueValueRenderer.field1].getValue();
    // accumulate values if there is more than one field defined
    if (uniqueValueRenderer.fieldDelimiter && uniqueValueRenderer.field2) {
        const val2 = entity.properties[uniqueValueRenderer.field2].getValue();
        if (val2) {
            entityUniqueValue += uniqueValueRenderer.fieldDelimiter + val2;
            if (uniqueValueRenderer.field3) {
                const val3 = entity.properties[uniqueValueRenderer.field3].getValue();
                if (val3) {
                    entityUniqueValue += uniqueValueRenderer.fieldDelimiter + val3;
                }
            }
        }
    }
    const uniqueValueInfo = rendererObj[entityUniqueValue];
    if (uniqueValueInfo && uniqueValueInfo.symbol) {
        return uniqueValueInfo.symbol;
    }
    else {
        return uniqueValueRenderer.defaultSymbol;
    }
}
function getClassBreaksSymbol(entity, classBreaksRenderer) {
    if (!entity.properties) {
        return classBreaksRenderer.defaultSymbol;
    }
    let entityValue = entity.properties[classBreaksRenderer.field].getValue();
    for (var i = 0; i < classBreaksRenderer.classBreakInfos.length; i++) {
        if (entityValue <= classBreaksRenderer.classBreakInfos[i].classMaxValue) {
            return classBreaksRenderer.classBreakInfos[i].symbol;
        }
    }
    return classBreaksRenderer.defaultSymbol;
}
export function convertEsriColorToCesiumColor(esriColor) {
    return Color.fromBytes(esriColor[0], esriColor[1], esriColor[2], esriColor[3]);
}
function updateEntityWithEsriStyle(entity, symbol, catalogItem) {
    // type of geometry is point and the applied style is image
    // TODO: tweek the svg support
    if (symbol.type === "esriPMS") {
        // Replace a general Cesium Point with a billboard
        if (entity.point && symbol.imageData) {
            entity.billboard = new BillboardGraphics({
                image: new ConstantProperty(proxyCatalogItemUrl(catalogItem, `data:${symbol.contentType};base64,${symbol.imageData}`)),
                heightReference: new ConstantProperty(catalogItem.clampToGround
                    ? HeightReference.RELATIVE_TO_GROUND
                    : undefined),
                width: new ConstantProperty(convertEsriPointSizeToPixels(symbol.width)),
                height: new ConstantProperty(convertEsriPointSizeToPixels(symbol.height)),
                rotation: new ConstantProperty(symbol.angle)
            });
            if (symbol.xoffset || symbol.yoffset) {
                const x = isDefined(symbol.xoffset) ? symbol.xoffset : 0;
                const y = isDefined(symbol.yoffset) ? symbol.yoffset : 0;
                entity.billboard.pixelOffset = new ConstantProperty(new Cartesian3(x, y));
            }
            entity.point.show = new ConstantProperty(false);
        }
    }
    else if (symbol.type === "esriSMS") {
        // Update the styling of the Cesium Point
        // TODO extend support for cross, diamond, square, x, triangle
        if (entity.point && symbol.color) {
            entity.point.color = new ConstantProperty(convertEsriColorToCesiumColor(symbol.color));
            entity.point.pixelSize = new ConstantProperty(convertEsriPointSizeToPixels(symbol.size));
            if (symbol.outline) {
                entity.point.outlineColor = new ConstantProperty(convertEsriColorToCesiumColor(symbol.outline.color));
                entity.point.outlineWidth = new ConstantProperty(convertEsriPointSizeToPixels(symbol.outline.width));
            }
        }
    }
    else if (symbol.type === "esriSLS") {
        /* Update the styling of the Cesium Polyline */
        if (entity.polyline) {
            if (isDefined(symbol.width)) {
                entity.polyline.width = new ConstantProperty(convertEsriPointSizeToPixels(symbol.width));
            }
            const color = symbol.color ? symbol.color : defaultColor;
            /*
              For line containing dashes PolylineDashMaterialProperty is used.
              Definition is done using the line patterns converted from hex to decimal dashPattern.
              Source for some of the line patterns is https://www.opengl.org.ru/docs/pg/0204.html, others are created manually
            */
            esriPolylineStyle(entity, color, symbol.style);
        }
    }
    else if (symbol.type === "esriSFS") {
        // Update the styling of the Cesium Polygon
        if (entity.polygon) {
            const color = symbol.color ? symbol.color : defaultFillColor;
            // feature picking doesn't work when the polygon interior is transparent, so
            // use an almost-transparent color instead
            if (color[3] === 0) {
                color[3] = 1;
            }
            entity.polygon.material = new ColorMaterialProperty(new ConstantProperty(convertEsriColorToCesiumColor(color)));
            if (symbol.style === "esriSFSNull" &&
                symbol.outline &&
                symbol.outline.style === "esriSLSNull") {
                entity.polygon.show = new ConstantProperty(false);
            }
            else {
                entity.polygon.material = new ColorMaterialProperty(new ConstantProperty(convertEsriColorToCesiumColor(color)));
            }
            if (symbol.outline) {
                const outlineColor = symbol.outline.color
                    ? symbol.outline.color
                    : defaultOutlineColor;
                /* It can actually happen that entity has both polygon and polyline defined at same time,
                    check the implementation of GeoJsonCatalogItem for details. */
                entity.polygon.outlineColor = new ColorMaterialProperty(new ConstantProperty(convertEsriColorToCesiumColor(outlineColor)));
                entity.polygon.outlineWidth = new ConstantProperty(convertEsriPointSizeToPixels(symbol.outline.width));
                if (entity.polyline) {
                    esriPolylineStyle(entity, outlineColor, symbol.outline.style);
                    entity.polyline.width = new ConstantProperty(convertEsriPointSizeToPixels(symbol.outline.width));
                    entity.polygon.outline = entity.polyline.material;
                }
            }
        }
    }
}
function esriPolylineStyle(entity, color, style) {
    if (entity.polyline) {
        if (style) {
            const patternValue = getLineStyleCesium(style);
            if (patternValue) {
                entity.polyline.material = new PolylineDashMaterialProperty({
                    color: convertEsriColorToCesiumColor(color),
                    dashPattern: new ConstantProperty(patternValue)
                });
            }
            else if (style === "esriSLSSolid") {
                // it is simple line just define color
                entity.polyline.material = new ColorMaterialProperty(convertEsriColorToCesiumColor(color));
            }
            else if (style === "esriSLSDash") {
                // default PolylineDashMaterialProperty is dashed line ` -` (0x00FF)
                entity.polyline.material = new PolylineDashMaterialProperty({
                    color: convertEsriColorToCesiumColor(color)
                });
            }
        }
        else {
            // we don't know how to handle style make it default
            entity.polyline.material = new ColorMaterialProperty(convertEsriColorToCesiumColor(color));
        }
        if (style === "esriSLSNull") {
            entity.polyline.show = new ConstantProperty(false);
        }
    }
}
// ESRI uses points for styling while cesium uses pixels
export function convertEsriPointSizeToPixels(pointSize) {
    // 1 px = 0.75 point
    // 1 point = 4/3 point
    return (pointSize * 4) / 3;
}
function loadGeoJson(catalogItem) {
    return loadJson(buildGeoJsonUrl(catalogItem)).then(function (json) {
        return json;
    });
}
function loadMetadata(catalogItem) {
    const metaUrl = buildMetadataUrl(catalogItem);
    return loadJson(metaUrl).then(function (json) {
        return json;
    });
}
function buildMetadataUrl(catalogItem) {
    return proxyCatalogItemUrl(catalogItem, new URI(catalogItem.url).addQuery("f", "json").toString());
}
function buildGeoJsonUrl(catalogItem) {
    const url = cleanUrl(catalogItem.url || "0d");
    const urlComponents = splitLayerIdFromPath(url);
    const layerId = urlComponents.layerId;
    if (!isDefined(layerId)) {
        throw networkRequestError({
            title: i18next.t("models.arcGisFeatureServerCatalogItem.invalidServiceTitle"),
            message: i18next.t("models.arcGisFeatureServerCatalogItem.invalidServiceMessage")
        });
    }
    return proxyCatalogItemUrl(catalogItem, new URI(urlComponents.urlWithoutLayerId)
        .segment("query")
        .addQuery("f", "json")
        .addQuery("layerDefs", "{" + layerId + ':"' + catalogItem.layerDef + '"}')
        .addQuery("outSR", "4326")
        .toString());
}
function splitLayerIdFromPath(url) {
    const regex = /^(.*FeatureServer)\/(\d+)/;
    const matches = url.match(regex);
    if (isDefined(matches) && matches !== null && matches.length > 2) {
        return {
            layerId: matches[2],
            urlWithoutLayerId: matches[1]
        };
    }
    return {
        urlWithoutLayerId: url
    };
}
function cleanUrl(url) {
    // Strip off the search portion of the URL
    const uri = new URI(url);
    uri.search("");
    return uri.toString();
}
//# sourceMappingURL=ArcGisFeatureServerCatalogItem.js.map
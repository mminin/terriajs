var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import uniqWith from "lodash-es/uniqWith";
import { computed, runInAction } from "mobx";
import WebMercatorTilingScheme from "terriajs-cesium/Source/Core/WebMercatorTilingScheme";
import ArcGisMapServerImageryProvider from "terriajs-cesium/Source/Scene/ArcGisMapServerImageryProvider";
import URI from "urijs";
import createDiscreteTimesFromIsoSegments from "../../../Core/createDiscreteTimes";
import createTransformerAllowUndefined from "../../../Core/createTransformerAllowUndefined";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import loadJson from "../../../Core/loadJson";
import replaceUnderscores from "../../../Core/replaceUnderscores";
import TerriaError, { networkRequestError } from "../../../Core/TerriaError";
import proj4definitions from "../../../Map/Proj4Definitions";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import DiscretelyTimeVaryingMixin from "../../../ModelMixins/DiscretelyTimeVaryingMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import ArcGisMapServerCatalogItemTraits from "../../../Traits/TraitsClasses/ArcGisMapServerCatalogItemTraits";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import LegendTraits, { LegendItemTraits } from "../../../Traits/TraitsClasses/LegendTraits";
import { RectangleTraits } from "../../../Traits/TraitsClasses/MappableTraits";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import getToken from "../../getToken";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
import MinMaxLevelMixin from "./../../../ModelMixins/MinMaxLevelMixin";
import { scaleDenominatorToLevel } from "../../../Core/scaleToDenominator";
const proj4 = require("proj4").default;
class MapServerStratum extends LoadableStratum(ArcGisMapServerCatalogItemTraits) {
    constructor(_item, _mapServer, _allLayers, _legends, token) {
        super();
        this._item = _item;
        this._mapServer = _mapServer;
        this._allLayers = _allLayers;
        this._legends = _legends;
        this.token = token;
    }
    duplicateLoadableStratum(newModel) {
        return new MapServerStratum(newModel, this._mapServer, this._allLayers, this._legends, this.token);
    }
    get mapServerData() {
        return this._mapServer;
    }
    static async load(item) {
        if (!isDefined(item.uri)) {
            throw new TerriaError({
                title: i18next.t("models.arcGisMapServerCatalogItem.invalidUrlTitle"),
                message: i18next.t("models.arcGisMapServerCatalogItem.invalidUrlMessage")
            });
        }
        let token;
        if (isDefined(item.tokenUrl)) {
            token = await getToken(item.terria, item.tokenUrl, item.url);
        }
        let layerId;
        const lastSegment = item.uri.segment(-1);
        if (lastSegment && lastSegment.match(/\d+/)) {
            // URL is a single REST layer, like .../arcgis/rest/services/Society/Society_SCRC/MapServer/16
            layerId = lastSegment;
        }
        let serviceUri = getBaseURI(item);
        let layersUri = getBaseURI(item).segment(layerId || "layers"); // either 'layers' or a number
        let legendUri = getBaseURI(item).segment("legend");
        if (isDefined(token)) {
            serviceUri = serviceUri.addQuery("token", token);
            layersUri = layersUri.addQuery("token", token);
            legendUri = legendUri.addQuery("token", token);
        }
        // TODO: if tokenUrl, fetch and pass token as parameter
        const serviceMetadata = await getJson(item, serviceUri);
        if (!isDefined(serviceMetadata)) {
            throw networkRequestError({
                title: i18next.t("models.arcGisService.invalidServerTitle"),
                message: i18next.t("models.arcGisService.invalidServerMessage")
            });
        }
        let layersMetadataResponse = await getJson(item, layersUri);
        const legendMetadata = await getJson(item, legendUri);
        // TODO: some error handling on these requests would be nice
        let layers;
        // Use the slightly more basic layer metadata
        if (isDefined(serviceMetadata.layers)) {
            layers = serviceMetadata.layers;
        }
        if (isDefined(layersMetadataResponse === null || layersMetadataResponse === void 0 ? void 0 : layersMetadataResponse.layers)) {
            layers = layersMetadataResponse.layers;
            // If layersMetadata is only a single layer -> shove into an array
        }
        else if (isDefined(layersMetadataResponse === null || layersMetadataResponse === void 0 ? void 0 : layersMetadataResponse.id)) {
            layers = [layersMetadataResponse];
        }
        if (!isDefined(layers) || layers.length === 0) {
            throw networkRequestError({
                title: i18next.t("models.arcGisMapServerCatalogItem.noLayersFoundTitle"),
                message: i18next.t("models.arcGisMapServerCatalogItem.noLayersFoundMessage", item)
            });
        }
        const stratum = new MapServerStratum(item, serviceMetadata, layers, legendMetadata, token);
        return stratum;
    }
    get allLayers() {
        return filterOutUndefined(findLayers(this._allLayers, this._item.layers));
    }
    get maximumScale() {
        return Math.min(...filterOutUndefined(this.allLayers.map(({ maxScale }) => maxScale)));
    }
    get name() {
        // single layer
        if (this.allLayers.length === 1 &&
            this.allLayers[0].name &&
            this.allLayers[0].name.length > 0) {
            return replaceUnderscores(this.allLayers[0].name);
        }
        // group of layers
        else if (this._mapServer.documentInfo &&
            this._mapServer.documentInfo.Title &&
            this._mapServer.documentInfo.Title.length > 0) {
            return replaceUnderscores(this._mapServer.documentInfo.Title);
        }
        else if (this._mapServer.mapName && this._mapServer.mapName.length > 0) {
            return replaceUnderscores(this._mapServer.mapName);
        }
    }
    get dataCustodian() {
        if (this._mapServer.documentInfo &&
            this._mapServer.documentInfo.Author &&
            this._mapServer.documentInfo.Author.length > 0) {
            return this._mapServer.documentInfo.Author;
        }
    }
    get rectangle() {
        const rectangle = {
            west: Infinity,
            south: Infinity,
            east: -Infinity,
            north: -Infinity
        };
        // If we only have the summary layer info
        if (!("extent" in this._allLayers[0])) {
            getRectangleFromLayer(this.mapServerData.fullExtent, rectangle);
        }
        else {
            getRectangleFromLayers(rectangle, this._allLayers);
        }
        if (rectangle.west === Infinity)
            return undefined;
        return createStratumInstance(RectangleTraits, rectangle);
    }
    get discreteTimes() {
        if (this._mapServer.timeInfo === undefined)
            return undefined;
        // Add union type - as `time` is always defined
        const result = [];
        createDiscreteTimesFromIsoSegments(result, new Date(this._mapServer.timeInfo.timeExtent[0]).toISOString(), new Date(this._mapServer.timeInfo.timeExtent[1]).toISOString(), undefined, this._item.maxRefreshIntervals);
        return result;
    }
    get info() {
        const layer = this.allLayers[0];
        if (!isDefined(layer)) {
            return [];
        }
        return [
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogItem.dataDescription"),
                content: layer.description
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogItem.serviceDescription"),
                content: this._mapServer.description
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogItem.copyrightText"),
                content: isDefined(layer.copyrightText) && layer.copyrightText.length > 0
                    ? layer.copyrightText
                    : this._mapServer.copyrightText
            })
        ];
    }
    get legends() {
        var _a;
        const layers = isDefined(this._item.layers)
            ? this._item.layers.split(",")
            : [];
        const noDataRegex = /^No[\s_-]?Data$/i;
        const labelsRegex = /_Labels$/;
        let items = [];
        (((_a = this._legends) === null || _a === void 0 ? void 0 : _a.layers) || []).forEach(l => {
            if (noDataRegex.test(l.layerName) || labelsRegex.test(l.layerName)) {
                return;
            }
            if (layers.length > 0 &&
                layers.indexOf(l.layerId.toString()) < 0 &&
                layers.indexOf(l.layerName) < 0) {
                // layer not selected
                return;
            }
            l.legend.forEach(leg => {
                const title = replaceUnderscores(leg.label !== "" ? leg.label : l.layerName);
                const dataUrl = "data:" + leg.contentType + ";base64," + leg.imageData;
                items.push(createStratumInstance(LegendItemTraits, {
                    title,
                    imageUrl: dataUrl,
                    imageWidth: leg.width,
                    imageHeight: leg.height
                }));
            });
        });
        items = uniqWith(items, (a, b) => a.imageUrl === b.imageUrl);
        return [createStratumInstance(LegendTraits, { items })];
    }
}
MapServerStratum.stratumName = "mapServer";
__decorate([
    computed
], MapServerStratum.prototype, "allLayers", null);
__decorate([
    computed
], MapServerStratum.prototype, "maximumScale", null);
__decorate([
    computed
], MapServerStratum.prototype, "name", null);
__decorate([
    computed
], MapServerStratum.prototype, "dataCustodian", null);
__decorate([
    computed
], MapServerStratum.prototype, "rectangle", null);
__decorate([
    computed
], MapServerStratum.prototype, "discreteTimes", null);
__decorate([
    computed
], MapServerStratum.prototype, "info", null);
__decorate([
    computed
], MapServerStratum.prototype, "legends", null);
StratumOrder.addLoadStratum(MapServerStratum.stratumName);
export default class ArcGisMapServerCatalogItem extends MappableMixin(UrlMixin(DiscretelyTimeVaryingMixin(MinMaxLevelMixin(CatalogMemberMixin(CreateModel(ArcGisMapServerCatalogItemTraits)))))) {
    constructor() {
        super(...arguments);
        this._createImageryProvider = createTransformerAllowUndefined((time) => {
            const stratum = (this.strata.get(MapServerStratum.stratumName));
            if (!isDefined(this.url) || !isDefined(stratum)) {
                return;
            }
            const params = Object.assign({}, this.parameters);
            if (time !== undefined) {
                params.time = time;
            }
            const maximumLevel = scaleDenominatorToLevel(this.maximumScale, true, false);
            const dynamicRequired = this.layers && this.layers.length > 0;
            const layers = this.layerIds || this.layers;
            const imageryProvider = new ArcGisMapServerImageryProvider({
                url: cleanAndProxyUrl(this, getBaseURI(this).toString()),
                layers: layers,
                tilingScheme: new WebMercatorTilingScheme(),
                maximumLevel: maximumLevel,
                parameters: params,
                enablePickFeatures: this.allowFeaturePicking,
                usePreCachedTilesIfAvailable: !dynamicRequired,
                mapServerData: stratum.mapServerData,
                token: stratum.token,
                credit: this.attribution
            });
            return this.updateRequestImage(imageryProvider, false);
        });
    }
    get typeName() {
        return i18next.t("models.arcGisMapServerCatalogItem.name");
    }
    get type() {
        return ArcGisMapServerCatalogItem.type;
    }
    async forceLoadMetadata() {
        const stratum = await MapServerStratum.load(this);
        runInAction(() => {
            this.strata.set(MapServerStratum.stratumName, stratum);
        });
    }
    forceLoadMapItems() {
        return Promise.resolve();
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    get discreteTimes() {
        const mapServerStratum = this.strata.get(MapServerStratum.stratumName);
        return mapServerStratum === null || mapServerStratum === void 0 ? void 0 : mapServerStratum.discreteTimes;
    }
    get _currentImageryParts() {
        const dateAsUnix = this.currentDiscreteTimeTag === undefined
            ? undefined
            : new Date(this.currentDiscreteTimeTag).getTime().toString();
        const imageryProvider = this._createImageryProvider(dateAsUnix);
        if (imageryProvider === undefined) {
            return undefined;
        }
        return {
            imageryProvider,
            alpha: this.opacity,
            show: this.show,
            clippingRectangle: this.clipToRectangle ? this.cesiumRectangle : undefined
        };
    }
    get _nextImageryParts() {
        if (this.nextDiscreteTimeTag) {
            const dateAsUnix = new Date(this.nextDiscreteTimeTag).getTime();
            const imageryProvider = this._createImageryProvider(dateAsUnix.toString());
            if (imageryProvider === undefined) {
                return undefined;
            }
            imageryProvider.enablePickFeatures = false;
            return {
                imageryProvider,
                alpha: 0.0,
                show: true,
                clippingRectangle: this.clipToRectangle
                    ? this.cesiumRectangle
                    : undefined
            };
        }
        else {
            return undefined;
        }
    }
    get mapItems() {
        const result = [];
        const current = this._currentImageryParts;
        if (current) {
            result.push(current);
        }
        const next = this._nextImageryParts;
        if (next) {
            result.push(next);
        }
        return result;
    }
    get layers() {
        if (super.layers) {
            return super.layers;
        }
        if (isDefined(this.uri)) {
            const lastSegment = this.uri.segment(-1);
            if (isDefined(lastSegment) && lastSegment.match(/\d+/)) {
                return lastSegment;
            }
        }
    }
    get layerIds() {
        const stratum = (this.strata.get(MapServerStratum.stratumName));
        const ids = stratum ? stratum.allLayers.map(l => l.id) : [];
        return ids.length === 0 ? undefined : ids.join(",");
    }
    get allSelectedLayers() {
        const stratum = (this.strata.get(MapServerStratum.stratumName));
        if (!isDefined(stratum)) {
            return [];
        }
        if (!isDefined(this.layers)) {
            // if no layer is specified, return all layers
            return stratum.allLayers;
        }
        const layerIds = this.layers.split(",");
        return stratum.allLayers.filter(({ id }) => layerIds.find(x => x == id.toString()));
    }
}
ArcGisMapServerCatalogItem.type = "esri-mapServer";
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "cacheDuration", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "discreteTimes", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "_currentImageryParts", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "_nextImageryParts", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "mapItems", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "layers", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "layerIds", null);
__decorate([
    computed
], ArcGisMapServerCatalogItem.prototype, "allSelectedLayers", null);
function getBaseURI(item) {
    const uri = new URI(item.url);
    const lastSegment = uri.segment(-1);
    if (lastSegment && lastSegment.match(/\d+/)) {
        uri.segment(-1, "");
    }
    return uri;
}
async function getJson(item, uri) {
    try {
        const response = await loadJson(proxyCatalogItemUrl(item, uri.addQuery("f", "json").toString()));
        return response;
    }
    catch (err) {
        console.log(err);
        return undefined;
    }
}
/* Given a comma-separated string of layer names, returns the layer objects corresponding to them. */
function findLayers(layers, names) {
    function findLayer(layers, id) {
        var idLowerCase = id.toLowerCase();
        var foundByName;
        for (var i = 0; i < layers.length; ++i) {
            var layer = layers[i];
            if (layer.id.toString() === id) {
                return layer;
            }
            else if (isDefined(layer.name) &&
                layer.name.toLowerCase() === idLowerCase) {
                foundByName = layer;
            }
        }
        return foundByName;
    }
    if (!isDefined(names)) {
        // If a list of layers is not specified, we're using all layers.
        return layers;
    }
    return names.split(",").map(function (id) {
        return findLayer(layers, id);
    });
}
function updateBbox(extent, rectangle) {
    if (extent.xmin < rectangle.west)
        rectangle.west = extent.xmin;
    if (extent.ymin < rectangle.south)
        rectangle.south = extent.ymin;
    if (extent.xmax > rectangle.east)
        rectangle.east = extent.xmax;
    if (extent.ymax > rectangle.north)
        rectangle.north = extent.ymax;
}
function getRectangleFromLayer(extent, rectangle) {
    var _a, _b, _c;
    const wkidCode = (_b = (_a = extent === null || extent === void 0 ? void 0 : extent.spatialReference) === null || _a === void 0 ? void 0 : _a.latestWkid) !== null && _b !== void 0 ? _b : (_c = extent === null || extent === void 0 ? void 0 : extent.spatialReference) === null || _c === void 0 ? void 0 : _c.wkid;
    if (isDefined(extent) && isDefined(wkidCode)) {
        if (wkidCode === 4326) {
            return updateBbox(extent, rectangle);
        }
        const wkid = "EPSG:" + wkidCode;
        if (!isDefined(proj4definitions[wkid])) {
            return;
        }
        const source = new proj4.Proj(proj4definitions[wkid]);
        const dest = new proj4.Proj("EPSG:4326");
        let p = proj4(source, dest, [extent.xmin, extent.ymin]);
        const west = p[0];
        const south = p[1];
        p = proj4(source, dest, [extent.xmax, extent.ymax]);
        const east = p[0];
        const north = p[1];
        return updateBbox({ xmin: west, ymin: south, xmax: east, ymax: north }, rectangle);
    }
}
function getRectangleFromLayers(rectangle, layers) {
    layers.forEach(function (item) {
        item.extent && getRectangleFromLayer(item.extent, rectangle);
    });
}
function cleanAndProxyUrl(catalogItem, url) {
    return proxyCatalogItemUrl(catalogItem, cleanUrl(url));
}
function cleanUrl(url) {
    // Strip off the search portion of the URL
    var uri = new URI(url);
    uri.search("");
    return uri.toString();
}
//# sourceMappingURL=ArcGisMapServerCatalogItem.js.map
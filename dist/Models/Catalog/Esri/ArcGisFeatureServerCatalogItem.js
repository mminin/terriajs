var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed, runInAction } from "mobx";
import Color from "terriajs-cesium/Source/Core/Color";
import URI from "urijs";
import isDefined from "../../../Core/isDefined";
import loadJson from "../../../Core/loadJson";
import replaceUnderscores from "../../../Core/replaceUnderscores";
import { networkRequestError } from "../../../Core/TerriaError";
import featureDataToGeoJson from "../../../Map/PickedFeatures/featureDataToGeoJson";
import proj4definitions from "../../../Map/Vector/Proj4Definitions";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GeoJsonMixin from "../../../ModelMixins/GeojsonMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import ArcGisFeatureServerCatalogItemTraits from "../../../Traits/TraitsClasses/ArcGisFeatureServerCatalogItemTraits";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import { RectangleTraits } from "../../../Traits/TraitsClasses/MappableTraits";
import TableColorStyleTraits, { EnumColorTraits } from "../../../Traits/TraitsClasses/Table/ColorStyleTraits";
import TableOutlineStyleTraits, { BinOutlineSymbolTraits, EnumOutlineSymbolTraits, OutlineSymbolTraits } from "../../../Traits/TraitsClasses/Table/OutlineStyleTraits";
import TablePointSizeStyleTraits from "../../../Traits/TraitsClasses/Table/PointSizeStyleTraits";
import TablePointStyleTraits, { BinPointSymbolTraits, EnumPointSymbolTraits, PointSymbolTraits } from "../../../Traits/TraitsClasses/Table/PointStyleTraits";
import TableStyleTraits from "../../../Traits/TraitsClasses/Table/StyleTraits";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
const proj4 = require("proj4").default;
class FeatureServerStratum extends LoadableStratum(ArcGisFeatureServerCatalogItemTraits) {
    constructor(_item, _featureServer, _esriJson) {
        super();
        this._item = _item;
        this._featureServer = _featureServer;
        this._esriJson = _esriJson;
    }
    duplicateLoadableStratum(newModel) {
        return new FeatureServerStratum(newModel, this._esriJson);
    }
    get featureServerData() {
        return this._featureServer;
    }
    static async load(item) {
        if (item.url === undefined) {
            new FeatureServerStratum(item, undefined, undefined);
        }
        const metaUrl = buildMetadataUrl(item);
        const featureServer = await loadJson(metaUrl);
        const stratum = new FeatureServerStratum(item, featureServer, undefined);
        return stratum;
    }
    get shortReport() {
        var _a;
        // Show notice if reached
        if (((_a = this._item.readyData) === null || _a === void 0 ? void 0 : _a.features) !== undefined &&
            this._item.readyData.features.length >= this._item.maxFeatures) {
            return i18next.t("models.arcGisFeatureServerCatalogItem.reachedMaxFeatureLimit", this._item);
        }
        return undefined;
    }
    get maximumScale() {
        var _a;
        return (_a = this._featureServer) === null || _a === void 0 ? void 0 : _a.maxScale;
    }
    get name() {
        var _a;
        if (((_a = this._featureServer) === null || _a === void 0 ? void 0 : _a.name) !== undefined &&
            this._featureServer.name.length > 0) {
            return replaceUnderscores(this._featureServer.name);
        }
    }
    get dataCustodian() {
        var _a, _b, _c;
        if (((_a = this._featureServer) === null || _a === void 0 ? void 0 : _a.documentInfo) && ((_b = this._featureServer) === null || _b === void 0 ? void 0 : _b.documentInfo.Author) &&
            ((_c = this._featureServer) === null || _c === void 0 ? void 0 : _c.documentInfo.Author.length) > 0) {
            return this._featureServer.documentInfo.Author;
        }
    }
    get rectangle() {
        var _a, _b, _c, _d;
        const extent = (_a = this._featureServer) === null || _a === void 0 ? void 0 : _a.extent;
        const wkidCode = (_c = (_b = extent === null || extent === void 0 ? void 0 : extent.spatialReference) === null || _b === void 0 ? void 0 : _b.latestWkid) !== null && _c !== void 0 ? _c : (_d = extent === null || extent === void 0 ? void 0 : extent.spatialReference) === null || _d === void 0 ? void 0 : _d.wkid;
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
        var _a, _b;
        return [
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogItem.dataDescription"),
                content: (_a = this._featureServer) === null || _a === void 0 ? void 0 : _a.description
            }),
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.arcGisMapServerCatalogItem.copyrightText"),
                content: (_b = this._featureServer) === null || _b === void 0 ? void 0 : _b.copyrightText
            })
        ];
    }
    get supportsPagination() {
        if (this._featureServer === undefined ||
            this._featureServer.advancedQueryCapabilities === undefined) {
            return false;
        }
        return !!this._featureServer.advancedQueryCapabilities.supportsPagination;
    }
    get activeStyle() {
        return "ESRI";
    }
    get styles() {
        var _a, _b, _c;
        const renderer = (_b = (_a = this._featureServer) === null || _a === void 0 ? void 0 : _a.drawingInfo) === null || _b === void 0 ? void 0 : _b.renderer;
        if (!renderer)
            return [];
        const rendererType = renderer.type;
        if (rendererType === "simple") {
            const simpleRenderer = renderer;
            const symbol = simpleRenderer.symbol;
            if (!symbol)
                return [];
            const symbolStyle = esriSymbolToTableStyle(symbol, simpleRenderer.label);
            return [
                createStratumInstance(TableStyleTraits, {
                    id: "ESRI",
                    hidden: false,
                    color: createStratumInstance(TableColorStyleTraits, {
                        nullColor: (_c = symbolStyle.color) !== null && _c !== void 0 ? _c : "#ffffff"
                    }),
                    pointSize: symbolStyle.pointSize,
                    point: createStratumInstance(TablePointStyleTraits, {
                        null: symbolStyle.point
                    }),
                    outline: createStratumInstance(TableOutlineStyleTraits, {
                        null: symbolStyle.outline
                    })
                })
            ];
        }
        else if (rendererType === "uniqueValue") {
            const uniqueValueRenderer = renderer;
            const symbolStyles = uniqueValueRenderer.uniqueValueInfos.map((v) => {
                return esriSymbolToTableStyle(v.symbol, v.label);
            });
            const defaultSymbolStyle = esriSymbolToTableStyle(uniqueValueRenderer.defaultSymbol);
            // Only include color if there are any styles which aren't esriPMS
            const includeColor = !!uniqueValueRenderer.uniqueValueInfos.find((u) => { var _a; return ((_a = u.symbol) === null || _a === void 0 ? void 0 : _a.type) !== "esriPMS"; });
            if (uniqueValueRenderer.field2 || uniqueValueRenderer.field3) {
                console.log(`WARNING: Terria only supports ArcGisFeatureService UniqueValueRenderers with a single field (\`field1\`), not multiple fields (\`field2\` or \`field3\`)`);
            }
            return [
                createStratumInstance(TableStyleTraits, {
                    id: "ESRI",
                    hidden: false,
                    color: includeColor
                        ? createStratumInstance(TableColorStyleTraits, {
                            colorColumn: uniqueValueRenderer.field1,
                            enumColors: uniqueValueRenderer.uniqueValueInfos.map((v, i) => {
                                var _a;
                                return createStratumInstance(EnumColorTraits, {
                                    value: v.value,
                                    color: (_a = symbolStyles[i].color) !== null && _a !== void 0 ? _a : "#ffffff"
                                });
                            }),
                            nullColor: defaultSymbolStyle.color
                        })
                        : createStratumInstance(TableColorStyleTraits, {
                            nullColor: "#FFFFFF"
                        }),
                    pointSize: createStratumInstance(TablePointSizeStyleTraits, {}),
                    point: createStratumInstance(TablePointStyleTraits, {
                        column: uniqueValueRenderer.field1,
                        enum: uniqueValueRenderer.uniqueValueInfos.map((v, i) => createStratumInstance(EnumPointSymbolTraits, {
                            value: v.value,
                            ...symbolStyles[i].point
                        })),
                        null: defaultSymbolStyle.point
                    }),
                    outline: createStratumInstance(TableOutlineStyleTraits, {
                        column: uniqueValueRenderer.field1,
                        enum: uniqueValueRenderer.uniqueValueInfos.map((v, i) => createStratumInstance(EnumOutlineSymbolTraits, {
                            value: v.value,
                            ...symbolStyles[i].outline
                        })),
                        null: defaultSymbolStyle.outline
                    })
                })
            ];
        }
        else {
            const classBreaksRenderer = renderer;
            const symbolStyles = classBreaksRenderer.classBreakInfos.map((c) => esriSymbolToTableStyle(c.symbol, c.label));
            const defaultSymbolStyle = esriSymbolToTableStyle(classBreaksRenderer.defaultSymbol);
            // Only include color if there are any styles which aren't esriPMS
            const includeColor = !!classBreaksRenderer.classBreakInfos.find((u) => { var _a; return ((_a = u.symbol) === null || _a === void 0 ? void 0 : _a.type) !== "esriPMS"; });
            return [
                createStratumInstance(TableStyleTraits, {
                    id: "ESRI",
                    hidden: false,
                    color: includeColor
                        ? createStratumInstance(TableColorStyleTraits, {
                            colorColumn: classBreaksRenderer.field,
                            binColors: symbolStyles.map((s) => { var _a; return (_a = s.color) !== null && _a !== void 0 ? _a : ""; }),
                            binMaximums: classBreaksRenderer.classBreakInfos.map((c) => c.classMaxValue),
                            nullColor: defaultSymbolStyle.color
                        })
                        : createStratumInstance(TableColorStyleTraits, {
                            nullColor: "#FFFFFF"
                        }),
                    pointSize: createStratumInstance(TablePointSizeStyleTraits, {}),
                    point: createStratumInstance(TablePointStyleTraits, {
                        column: classBreaksRenderer.field,
                        bin: classBreaksRenderer.classBreakInfos.map((c, i) => createStratumInstance(BinPointSymbolTraits, {
                            maxValue: c.classMaxValue,
                            ...symbolStyles[i].point
                        })),
                        null: defaultSymbolStyle.point
                    }),
                    outline: createStratumInstance(TableOutlineStyleTraits, {
                        column: classBreaksRenderer.field,
                        bin: classBreaksRenderer.classBreakInfos.map((c, i) => createStratumInstance(BinOutlineSymbolTraits, {
                            maxValue: c.classMaxValue,
                            ...symbolStyles[i].outline
                        })),
                        null: defaultSymbolStyle.outline
                    })
                })
            ];
        }
    }
}
FeatureServerStratum.stratumName = "featureServer";
__decorate([
    computed
], FeatureServerStratum.prototype, "featureServerData", null);
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
], FeatureServerStratum.prototype, "supportsPagination", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "activeStyle", null);
__decorate([
    computed
], FeatureServerStratum.prototype, "styles", null);
StratumOrder.addLoadStratum(FeatureServerStratum.stratumName);
export default class ArcGisFeatureServerCatalogItem extends GeoJsonMixin(UrlMixin(CatalogMemberMixin(CreateModel(ArcGisFeatureServerCatalogItemTraits)))) {
    get type() {
        return ArcGisFeatureServerCatalogItem.type;
    }
    get typeName() {
        return i18next.t("models.arcGisFeatureServerCatalogItem.name");
    }
    async forceLoadMetadata() {
        if (this.strata.get(FeatureServerStratum.stratumName) === undefined) {
            const stratum = await FeatureServerStratum.load(this);
            runInAction(() => {
                this.strata.set(FeatureServerStratum.stratumName, stratum);
            });
        }
    }
    async forceLoadGeojsonData() {
        var _a, _b;
        const getEsriLayerJson = async (resultOffset) => await loadJson(this.buildEsriJsonUrl(resultOffset));
        if (!this.supportsPagination) {
            // Make a single request without pagination
            return ((_a = featureDataToGeoJson(await getEsriLayerJson())) !== null && _a !== void 0 ? _a : {
                type: "FeatureCollection",
                features: []
            });
        }
        // Esri Feature Servers have a maximum limit to how many features they'll return at once, so for a service with many
        // features, we have to make multiple requests. We can't figure out how many features we need to request ahead of
        // time (there's an API for it but it times out for services with thousands of features), so we just keep trying
        // until we run out of features or hit the limit
        const featuresPerRequest = this.featuresPerRequest;
        const maxFeatures = this.maxFeatures;
        let combinedEsriLayerJson = await getEsriLayerJson(0);
        const mapObjectIds = (features) => features.map((feature) => { var _a; return (_a = feature.attributes.OBJECTID) !== null && _a !== void 0 ? _a : feature.attributes.objectid; });
        const seenIDs = new Set(mapObjectIds(combinedEsriLayerJson.features));
        let currentOffset = 0;
        let exceededTransferLimit = combinedEsriLayerJson.exceededTransferLimit;
        while (combinedEsriLayerJson.features.length <= maxFeatures &&
            exceededTransferLimit === true) {
            currentOffset += featuresPerRequest;
            const newEsriLayerJson = await getEsriLayerJson(currentOffset);
            if (newEsriLayerJson.features === undefined ||
                newEsriLayerJson.features.length === 0) {
                break;
            }
            const newIds = mapObjectIds(newEsriLayerJson.features);
            if (newIds.every((id) => seenIDs.has(id))) {
                // We're getting data that we've received already, assume have everything we need and stop fetching
                break;
            }
            newIds.forEach((id) => seenIDs.add(id));
            combinedEsriLayerJson.features = combinedEsriLayerJson.features.concat(newEsriLayerJson.features);
            exceededTransferLimit = newEsriLayerJson.exceededTransferLimit;
        }
        return ((_b = featureDataToGeoJson(combinedEsriLayerJson)) !== null && _b !== void 0 ? _b : {
            type: "FeatureCollection",
            features: []
        });
    }
    get featureServerData() {
        const stratum = (this.strata.get(FeatureServerStratum.stratumName));
        return isDefined(stratum) ? stratum.featureServerData : undefined;
    }
    /**
     * Constructs the url for a request to a feature server
     * @param resultOffset Allows for pagination of results.
     *  See https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer-.htm
     */
    buildEsriJsonUrl(resultOffset) {
        const url = cleanUrl(this.url || "0d");
        const urlComponents = splitLayerIdFromPath(url);
        const layerId = urlComponents.layerId;
        if (!isDefined(layerId)) {
            throw networkRequestError({
                title: i18next.t("models.arcGisFeatureServerCatalogItem.invalidServiceTitle"),
                message: i18next.t("models.arcGisFeatureServerCatalogItem.invalidServiceMessage")
            });
        }
        // We used to make a call to a different ArcGIS API endpoint
        // (https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-.htm) which took a
        // `layerdef` parameter, which is more or less equivalent to `where`. To avoid breaking old catalog items, we need
        // to use `layerDef` if `where` hasn't been set
        const where = this.where === "1=1" ? this.layerDef : this.where;
        const uri = new URI(url)
            .segment("query")
            .addQuery("f", "json")
            .addQuery("where", where)
            .addQuery("outFields", "*")
            .addQuery("outSR", "4326");
        if (resultOffset !== undefined) {
            // Pagination specific parameters
            uri
                .addQuery("resultRecordCount", this.featuresPerRequest)
                .addQuery("resultOffset", resultOffset);
        }
        return proxyCatalogItemUrl(this, uri.toString());
    }
}
ArcGisFeatureServerCatalogItem.type = "esri-featureServer";
__decorate([
    computed
], ArcGisFeatureServerCatalogItem.prototype, "featureServerData", null);
export function convertEsriColorToCesiumColor(esriColor) {
    if (!esriColor)
        return;
    return Color.fromBytes(esriColor[0], esriColor[1], esriColor[2], esriColor[3]);
}
// ESRI uses points for styling while cesium uses pixels
export function convertEsriPointSizeToPixels(pointSize) {
    if (!isDefined(pointSize))
        return undefined;
    // 1 px = 0.75 point
    // 1 point = 4/3 point
    return (pointSize * 4) / 3;
}
function buildMetadataUrl(catalogItem) {
    return proxyCatalogItemUrl(catalogItem, new URI(catalogItem.url).addQuery("f", "json").toString());
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
function esriSymbolToTableStyle(symbol, label) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (!symbol)
        return {};
    return {
        // For esriPMS - just use white color
        // This is so marker icons aren't colored by default
        color: symbol.type === "esriPMS"
            ? "#FFFFFF"
            : (_a = convertEsriColorToCesiumColor(symbol.color)) === null || _a === void 0 ? void 0 : _a.toCssColorString(),
        pointSize: createStratumInstance(TablePointSizeStyleTraits, {}),
        point: createStratumInstance(PointSymbolTraits, {
            marker: symbol.type === "esriPMS"
                ? `data:${symbol.contentType};base64,${symbol.imageData}`
                : convertEsriMarkerToMaki(symbol.style),
            // symbol.size is used by "esriSMS"
            // height and width is used by "esriPMS"
            height: (_b = convertEsriPointSizeToPixels(symbol.size)) !== null && _b !== void 0 ? _b : convertEsriPointSizeToPixels(symbol.height),
            width: (_c = convertEsriPointSizeToPixels(symbol.size)) !== null && _c !== void 0 ? _c : convertEsriPointSizeToPixels(symbol.width),
            rotation: symbol.angle,
            pixelOffset: [(_d = symbol.xoffset) !== null && _d !== void 0 ? _d : 0, (_e = symbol.yoffset) !== null && _e !== void 0 ? _e : 0],
            legendTitle: label || undefined
        }),
        outline: ((_f = symbol.outline) === null || _f === void 0 ? void 0 : _f.style) !== "esriSLSNull"
            ? createStratumInstance(OutlineSymbolTraits, {
                color: (_h = convertEsriColorToCesiumColor((_g = symbol.outline) === null || _g === void 0 ? void 0 : _g.color)) === null || _h === void 0 ? void 0 : _h.toCssColorString(),
                // Use width if Line style
                width: symbol.type === "esriSLS"
                    ? convertEsriPointSizeToPixels(symbol.width)
                    : convertEsriPointSizeToPixels((_j = symbol.outline) === null || _j === void 0 ? void 0 : _j.width),
                legendTitle: label || undefined
            })
            : undefined
    };
}
function convertEsriMarkerToMaki(esri) {
    switch (esri) {
        case "esriSMSCross":
            return "hospital";
        case "esriSMSDiamond":
            return "diamond";
        case "esriSMSSquare":
            return "square";
        case "esriSMSTriangle":
            return "triangle";
        case "esriSMSX":
            return "cross";
        case "esriSMSCircle":
        default:
            return "point";
    }
}
//# sourceMappingURL=ArcGisFeatureServerCatalogItem.js.map
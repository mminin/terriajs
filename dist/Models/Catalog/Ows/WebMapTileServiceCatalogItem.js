var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed, runInAction } from "mobx";
import defined from "terriajs-cesium/Source/Core/defined";
import WebMercatorTilingScheme from "terriajs-cesium/Source/Core/WebMercatorTilingScheme";
import WebMapTileServiceImageryProvider from "terriajs-cesium/Source/Scene/WebMapTileServiceImageryProvider";
import URI from "urijs";
import containsAny from "../../../Core/containsAny";
import isDefined from "../../../Core/isDefined";
import TerriaError from "../../../Core/TerriaError";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GetCapabilitiesMixin from "../../../ModelMixins/GetCapabilitiesMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import LegendTraits from "../../../Traits/TraitsClasses/LegendTraits";
import WebMapTileServiceCatalogItemTraits from "../../../Traits/TraitsClasses/WebMapTileServiceCatalogItemTraits";
import isReadOnlyArray from "../../../Core/isReadOnlyArray";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import WebMapTileServiceCapabilities from "./WebMapTileServiceCapabilities";
class GetCapabilitiesStratum extends LoadableStratum(WebMapTileServiceCatalogItemTraits) {
    constructor(catalogItem, capabilities) {
        super();
        this.catalogItem = catalogItem;
        this.capabilities = capabilities;
    }
    static async load(catalogItem, capabilities) {
        if (!isDefined(catalogItem.getCapabilitiesUrl)) {
            throw new TerriaError({
                title: i18next.t("models.webMapTileServiceCatalogItem.missingUrlTitle"),
                message: i18next.t("models.webMapTileServiceCatalogItem.missingUrlMessage")
            });
        }
        if (!isDefined(capabilities))
            capabilities = await WebMapTileServiceCapabilities.fromUrl(proxyCatalogItemUrl(catalogItem, catalogItem.getCapabilitiesUrl, catalogItem.getCapabilitiesCacheDuration));
        return new GetCapabilitiesStratum(catalogItem, capabilities);
    }
    duplicateLoadableStratum(model) {
        return new GetCapabilitiesStratum(model, this.capabilities);
    }
    get layer() {
        let layer;
        if (this.catalogItem.uri !== undefined) {
            const query = this.catalogItem.uri.query(true);
            layer = query.layer;
        }
        return layer;
    }
    get info() {
        const result = [
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webMapTileServiceCatalogItem.getCapabilitiesUrl"),
                content: this.catalogItem.getCapabilitiesUrl
            })
        ];
        let layerAbstract;
        const layer = this.capabilitiesLayer;
        if (layer &&
            layer.Abstract &&
            !containsAny(layer.Abstract, WebMapTileServiceCatalogItem.abstractsToIgnore)) {
            result.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webMapTileServiceCatalogItem.dataDescription"),
                content: layer.Abstract
            }));
            layerAbstract = layer.Abstract;
        }
        const serviceIdentification = this.capabilities && this.capabilities.ServiceIdentification;
        if (serviceIdentification) {
            if (serviceIdentification.Abstract &&
                !containsAny(serviceIdentification.Abstract, WebMapTileServiceCatalogItem.abstractsToIgnore) &&
                serviceIdentification.Abstract !== layerAbstract) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webMapTileServiceCatalogItem.serviceDescription"),
                    content: serviceIdentification.Abstract
                }));
            }
            // Show the Access Constraints if it isn't "none" (because that's the default, and usually a lie).
            if (serviceIdentification.AccessConstraints &&
                !/^none$/i.test(serviceIdentification.AccessConstraints)) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webMapTileServiceCatalogItem.accessConstraints"),
                    content: serviceIdentification.AccessConstraints
                }));
            }
            // Show the Access Constraints if it isn't "none" (because that's the default, and usually a lie).
            if (serviceIdentification.Fees &&
                !/^none$/i.test(serviceIdentification.Fees)) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webMapTileServiceCatalogItem.fees"),
                    content: serviceIdentification.Fees
                }));
            }
        }
        const serviceProvider = this.capabilities && this.capabilities.ServiceProvider;
        if (serviceProvider) {
            result.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webMapTileServiceCatalogItem.serviceContact"),
                content: getServiceContactInformation(serviceProvider) || ""
            }));
        }
        if (!isDefined(this.catalogItem.tileMatrixSet)) {
            result.push(createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webMapTileServiceCatalogItem.noUsableTileMatrixTitle"),
                content: i18next.t("models.webMapTileServiceCatalogItem.noUsableTileMatrixMessage")
            }));
        }
        return result;
    }
    get infoSectionOrder() {
        return [
            i18next.t("preview.disclaimer"),
            i18next.t("models.webMapTileServiceCatalogItem.noUsableTileMatrixTitle"),
            i18next.t("description.name"),
            i18next.t("preview.datasetDescription"),
            i18next.t("models.webMapTileServiceCatalogItem.dataDescription"),
            i18next.t("preview.serviceDescription"),
            i18next.t("models.webMapTileServiceCatalogItem.serviceDescription"),
            i18next.t("preview.resourceDescription"),
            i18next.t("preview.licence"),
            i18next.t("preview.accessConstraints"),
            i18next.t("models.webMapTileServiceCatalogItem.accessConstraints"),
            i18next.t("models.webMapTileServiceCatalogItem.fees"),
            i18next.t("preview.author"),
            i18next.t("preview.contact"),
            i18next.t("models.webMapTileServiceCatalogItem.serviceContact"),
            i18next.t("preview.created"),
            i18next.t("preview.modified"),
            i18next.t("preview.updateFrequency"),
            i18next.t("models.webMapTileServiceCatalogItem.getCapabilitiesUrl")
        ];
    }
    get shortReport() {
        return !isDefined(this.catalogItem.tileMatrixSet)
            ? `${i18next.t("models.webMapTileServiceCatalogItem.noUsableTileMatrixTitle")}: ${i18next.t("models.webMapTileServiceCatalogItem.noUsableTileMatrixMessage")}`
            : undefined;
    }
    get legends() {
        var _a;
        const layerAvailableStyles = (_a = this.catalogItem.availableStyles.find((candidate) => { var _a; return candidate.layerName === ((_a = this.capabilitiesLayer) === null || _a === void 0 ? void 0 : _a.Identifier); })) === null || _a === void 0 ? void 0 : _a.styles;
        const layerStyle = layerAvailableStyles === null || layerAvailableStyles === void 0 ? void 0 : layerAvailableStyles.find((candidate) => candidate.identifier === this.catalogItem.style);
        if (isDefined(layerStyle === null || layerStyle === void 0 ? void 0 : layerStyle.legend)) {
            return [
                createStratumInstance(LegendTraits, {
                    url: layerStyle.legend.url,
                    urlMimeType: layerStyle.legend.urlMimeType
                })
            ];
        }
    }
    get capabilitiesLayer() {
        let result = this.catalogItem.layer
            ? this.capabilities.findLayer(this.catalogItem.layer)
            : undefined;
        return result;
    }
    get availableStyles() {
        const result = [];
        if (!this.capabilities) {
            return result;
        }
        const layer = this.capabilitiesLayer;
        if (!layer) {
            return result;
        }
        const styles = layer && layer.Style
            ? Array.isArray(layer.Style)
                ? layer.Style
                : [layer.Style]
            : [];
        result.push({
            layerName: layer === null || layer === void 0 ? void 0 : layer.Identifier,
            styles: styles.map((style) => {
                let wmtsLegendUrl = isReadOnlyArray(style.LegendURL)
                    ? style.LegendURL[0]
                    : style.LegendURL;
                let legendUri, legendMimeType;
                if (wmtsLegendUrl && wmtsLegendUrl["xlink:href"]) {
                    legendUri = new URI(decodeURIComponent(wmtsLegendUrl["xlink:href"]));
                    legendMimeType = wmtsLegendUrl.Format;
                }
                const legend = !legendUri
                    ? undefined
                    : createStratumInstance(LegendTraits, {
                        url: legendUri.toString(),
                        urlMimeType: legendMimeType
                    });
                return {
                    identifier: style.Identifier,
                    isDefault: style.isDefault,
                    abstract: style.Abstract,
                    legend: legend
                };
            })
        });
        return result;
    }
    get usableTileMatrixSets() {
        const usableTileMatrixSets = {
            "urn:ogc:def:wkss:OGC:1.0:GoogleMapsCompatible": {
                identifiers: ["0"],
                tileWidth: 256,
                tileHeight: 256
            }
        };
        const standardTilingScheme = new WebMercatorTilingScheme();
        const matrixSets = this.capabilities.tileMatrixSets;
        if (matrixSets === undefined) {
            return;
        }
        for (let i = 0; i < matrixSets.length; i++) {
            const matrixSet = matrixSets[i];
            if (!matrixSet.SupportedCRS ||
                (!/EPSG.*900913/.test(matrixSet.SupportedCRS) &&
                    !/EPSG.*3857/.test(matrixSet.SupportedCRS))) {
                continue;
            }
            // Usable tile matrix sets must have a single 256x256 tile at the root.
            const matrices = matrixSet.TileMatrix;
            if (!isDefined(matrices) || matrices.length < 1) {
                continue;
            }
            const levelZeroMatrix = matrices[0];
            if (!isDefined(levelZeroMatrix.TopLeftCorner)) {
                continue;
            }
            var levelZeroTopLeftCorner = levelZeroMatrix.TopLeftCorner.split(" ");
            var startX = parseFloat(levelZeroTopLeftCorner[0]);
            var startY = parseFloat(levelZeroTopLeftCorner[1]);
            const rectangleInMeters = standardTilingScheme.rectangleToNativeRectangle(standardTilingScheme.rectangle);
            if (Math.abs(startX - rectangleInMeters.west) > 1 ||
                Math.abs(startY - rectangleInMeters.north) > 1) {
                continue;
            }
            if (defined(matrixSet.TileMatrix) && matrixSet.TileMatrix.length > 0) {
                const ids = matrixSet.TileMatrix.map(function (item) {
                    return item.Identifier;
                });
                const firstTile = matrixSet.TileMatrix[0];
                usableTileMatrixSets[matrixSet.Identifier] = {
                    identifiers: ids,
                    tileWidth: firstTile.TileWidth,
                    tileHeight: firstTile.TileHeight
                };
            }
        }
        return usableTileMatrixSets;
    }
    get rectangle() {
        const layer = this.capabilitiesLayer;
        if (!layer) {
            return;
        }
        const bbox = layer.WGS84BoundingBox;
        if (bbox) {
            const lowerCorner = bbox.LowerCorner.split(" ");
            const upperCorner = bbox.UpperCorner.split(" ");
            return {
                west: parseFloat(lowerCorner[0]),
                south: parseFloat(lowerCorner[1]),
                east: parseFloat(upperCorner[0]),
                north: parseFloat(upperCorner[1])
            };
        }
    }
    get style() {
        var _a, _b, _c, _d;
        if (!isDefined(this.catalogItem.layer))
            return;
        const layerAvailableStyles = (_a = this.availableStyles.find((candidate) => { var _a; return candidate.layerName === ((_a = this.capabilitiesLayer) === null || _a === void 0 ? void 0 : _a.Identifier); })) === null || _a === void 0 ? void 0 : _a.styles;
        return ((_c = (_b = layerAvailableStyles === null || layerAvailableStyles === void 0 ? void 0 : layerAvailableStyles.find((style) => style.isDefault)) === null || _b === void 0 ? void 0 : _b.identifier) !== null && _c !== void 0 ? _c : (_d = layerAvailableStyles === null || layerAvailableStyles === void 0 ? void 0 : layerAvailableStyles[0]) === null || _d === void 0 ? void 0 : _d.identifier);
    }
}
GetCapabilitiesStratum.stratumName = "wmtsServer";
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "layer", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "info", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "infoSectionOrder", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "shortReport", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "legends", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "capabilitiesLayer", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "availableStyles", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "usableTileMatrixSets", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "rectangle", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "style", null);
class WebMapTileServiceCatalogItem extends MappableMixin(GetCapabilitiesMixin(UrlMixin(CatalogMemberMixin(CreateModel(WebMapTileServiceCatalogItemTraits))))) {
    constructor() {
        super(...arguments);
        // hide elements in the info section which might show information about the datasource
        this._sourceInfoItemNames = [
            i18next.t("models.webMapTileServiceCatalogItem.getCapabilitiesUrl")
        ];
    }
    get type() {
        return WebMapTileServiceCatalogItem.type;
    }
    async createGetCapabilitiesStratumFromParent(capabilities) {
        const stratum = await GetCapabilitiesStratum.load(this, capabilities);
        runInAction(() => {
            this.strata.set(GetCapabilitiesMixin.getCapabilitiesStratumName, stratum);
        });
    }
    async forceLoadMetadata() {
        if (this.strata.get(GetCapabilitiesMixin.getCapabilitiesStratumName) !==
            undefined)
            return;
        const stratum = await GetCapabilitiesStratum.load(this);
        runInAction(() => {
            this.strata.set(GetCapabilitiesMixin.getCapabilitiesStratumName, stratum);
        });
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    get imageryProvider() {
        var _a, _b, _c, _d, _e;
        const stratum = (this.strata.get(GetCapabilitiesMixin.getCapabilitiesStratumName));
        if (!isDefined(this.layer) ||
            !isDefined(this.url) ||
            !isDefined(stratum) ||
            !isDefined(this.style)) {
            return;
        }
        const layer = stratum.capabilitiesLayer;
        const layerIdentifier = layer === null || layer === void 0 ? void 0 : layer.Identifier;
        if (!isDefined(layer) || !isDefined(layerIdentifier)) {
            return;
        }
        let format = "image/png";
        const formats = layer.Format;
        if (formats &&
            (formats === null || formats === void 0 ? void 0 : formats.indexOf("image/png")) === -1 &&
            (formats === null || formats === void 0 ? void 0 : formats.indexOf("image/jpeg")) !== -1) {
            format = "image/jpeg";
        }
        // if layer has defined ResourceURL we should use it because some layers support only Restful encoding. See #2927
        const resourceUrl = layer.ResourceURL;
        let baseUrl = new URI(this.url).search("").toString();
        if (resourceUrl) {
            if (Array.isArray(resourceUrl)) {
                for (let i = 0; i < resourceUrl.length; i++) {
                    const url = resourceUrl[i];
                    if (url.format.indexOf(format) !== -1 ||
                        url.format.indexOf("png") !== -1) {
                        baseUrl = url.template;
                    }
                }
            }
            else {
                if (format === resourceUrl.format ||
                    resourceUrl.format.indexOf("png") !== -1) {
                    baseUrl = resourceUrl.template;
                }
            }
        }
        const tileMatrixSet = this.tileMatrixSet;
        if (!isDefined(tileMatrixSet)) {
            return;
        }
        const imageryProvider = new WebMapTileServiceImageryProvider({
            url: proxyCatalogItemUrl(this, baseUrl),
            layer: layerIdentifier,
            style: this.style,
            tileMatrixSetID: tileMatrixSet.id,
            tileMatrixLabels: tileMatrixSet.labels,
            minimumLevel: (_a = this.minimumLevel) !== null && _a !== void 0 ? _a : tileMatrixSet.minLevel,
            maximumLevel: (_b = this.maximumLevel) !== null && _b !== void 0 ? _b : tileMatrixSet.maxLevel,
            tileWidth: (_c = this.tileWidth) !== null && _c !== void 0 ? _c : tileMatrixSet.tileWidth,
            tileHeight: (_e = (_d = this.tileHeight) !== null && _d !== void 0 ? _d : this.minimumLevel) !== null && _e !== void 0 ? _e : tileMatrixSet.tileHeight,
            tilingScheme: new WebMercatorTilingScheme(),
            format,
            credit: this.attribution,
            enablePickFeatures: this.allowFeaturePicking
        });
        return imageryProvider;
    }
    get tileMatrixSet() {
        const stratum = (this.strata.get(GetCapabilitiesMixin.getCapabilitiesStratumName));
        if (!this.layer) {
            return;
        }
        const layer = stratum.capabilitiesLayer;
        if (!layer) {
            return;
        }
        const usableTileMatrixSets = stratum.usableTileMatrixSets;
        let tileMatrixSetLinks = [];
        if (layer === null || layer === void 0 ? void 0 : layer.TileMatrixSetLink) {
            if (Array.isArray(layer === null || layer === void 0 ? void 0 : layer.TileMatrixSetLink)) {
                tileMatrixSetLinks = [...layer === null || layer === void 0 ? void 0 : layer.TileMatrixSetLink];
            }
            else {
                tileMatrixSetLinks = [layer.TileMatrixSetLink];
            }
        }
        let tileMatrixSetId = "urn:ogc:def:wkss:OGC:1.0:GoogleMapsCompatible";
        let maxLevel = 0;
        let minLevel = 0;
        let tileWidth = 256;
        let tileHeight = 256;
        let tileMatrixSetLabels = [];
        for (let i = 0; i < tileMatrixSetLinks.length; i++) {
            const tileMatrixSet = tileMatrixSetLinks[i].TileMatrixSet;
            if (usableTileMatrixSets && usableTileMatrixSets[tileMatrixSet]) {
                tileMatrixSetId = tileMatrixSet;
                tileMatrixSetLabels = usableTileMatrixSets[tileMatrixSet].identifiers;
                tileWidth = Number(usableTileMatrixSets[tileMatrixSet].tileWidth);
                tileHeight = Number(usableTileMatrixSets[tileMatrixSet].tileHeight);
                break;
            }
        }
        if (Array.isArray(tileMatrixSetLabels)) {
            const levels = tileMatrixSetLabels.map((label) => {
                const lastIndex = label.lastIndexOf(":");
                return Math.abs(Number(label.substring(lastIndex + 1)));
            });
            maxLevel = levels.reduce((currentMaximum, level) => {
                return level > currentMaximum ? level : currentMaximum;
            }, 0);
            minLevel = levels.reduce((currentMaximum, level) => {
                return level < currentMaximum ? level : currentMaximum;
            }, 0);
        }
        return {
            id: tileMatrixSetId,
            labels: tileMatrixSetLabels,
            maxLevel: maxLevel,
            minLevel: minLevel,
            tileWidth: tileWidth,
            tileHeight: tileHeight
        };
    }
    forceLoadMapItems() {
        return Promise.resolve();
    }
    get mapItems() {
        if (isDefined(this.imageryProvider)) {
            return [
                {
                    alpha: this.opacity,
                    show: this.show,
                    imageryProvider: this.imageryProvider,
                    clippingRectangle: this.clipToRectangle
                        ? this.cesiumRectangle
                        : undefined
                }
            ];
        }
        return [];
    }
    get defaultGetCapabilitiesUrl() {
        if (this.uri) {
            return this.uri
                .clone()
                .setSearch({
                service: "WMTS",
                version: "1.0.0",
                request: "GetCapabilities"
            })
                .toString();
        }
        else {
            return undefined;
        }
    }
}
/**
 * The collection of strings that indicate an Abstract property should be ignored.  If these strings occur anywhere
 * in the Abstract, the Abstract will not be used.  This makes it easy to filter out placeholder data like
 * Geoserver's "A compliant implementation of WMTS..." stock abstract.
 */
WebMapTileServiceCatalogItem.abstractsToIgnore = [
    "A compliant implementation of WMTS service.",
    "This is the reference implementation of WMTS 1.0.0"
];
WebMapTileServiceCatalogItem.type = "wmts";
__decorate([
    computed
], WebMapTileServiceCatalogItem.prototype, "cacheDuration", null);
__decorate([
    computed
], WebMapTileServiceCatalogItem.prototype, "imageryProvider", null);
__decorate([
    computed
], WebMapTileServiceCatalogItem.prototype, "tileMatrixSet", null);
__decorate([
    computed
], WebMapTileServiceCatalogItem.prototype, "mapItems", null);
export function getServiceContactInformation(contactInfo) {
    var _a;
    let text = "";
    if (contactInfo.ProviderName && contactInfo.ProviderName.length > 0) {
        text += contactInfo.ProviderName + "<br/>";
    }
    if (contactInfo.ProviderSite && contactInfo.ProviderSite["xlink:href"]) {
        text += contactInfo.ProviderSite["xlink:href"] + "<br/>";
    }
    const serviceContact = contactInfo.ServiceContact;
    if (serviceContact) {
        const invidualName = serviceContact.InvidualName;
        if (invidualName && invidualName.length > 0) {
            text += invidualName + "<br/>";
        }
        const contactInfo = (_a = serviceContact.ContactInfo) === null || _a === void 0 ? void 0 : _a.Address;
        if (contactInfo &&
            isDefined(contactInfo.ElectronicMailAddress) &&
            contactInfo.ElectronicMailAddress.length > 0) {
            text += `[${contactInfo.ElectronicMailAddress}](mailto:${contactInfo.ElectronicMailAddress})`;
        }
    }
    return text;
}
export default WebMapTileServiceCatalogItem;
//# sourceMappingURL=WebMapTileServiceCatalogItem.js.map
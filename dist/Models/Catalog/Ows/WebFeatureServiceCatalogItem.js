var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed, isObservableArray, runInAction } from "mobx";
import combine from "terriajs-cesium/Source/Core/combine";
import containsAny from "../../../Core/containsAny";
import isDefined from "../../../Core/isDefined";
import isReadOnlyArray from "../../../Core/isReadOnlyArray";
import loadText from "../../../Core/loadText";
import TerriaError from "../../../Core/TerriaError";
import gmlToGeoJson from "../../../Map/gmlToGeoJson";
import GeoJsonMixin, { toFeatureCollection } from "../../../ModelMixins/GeojsonMixin";
import GetCapabilitiesMixin from "../../../ModelMixins/GetCapabilitiesMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import xml2json from "../../../ThirdParty/xml2json";
import { InfoSectionTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import WebFeatureServiceCatalogItemTraits from "../../../Traits/TraitsClasses/WebFeatureServiceCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import WebFeatureServiceCapabilities, { getRectangleFromLayer } from "./WebFeatureServiceCapabilities";
class GetCapabilitiesStratum extends LoadableStratum(WebFeatureServiceCatalogItemTraits) {
    constructor(catalogItem, capabilities) {
        super();
        this.catalogItem = catalogItem;
        this.capabilities = capabilities;
    }
    static async load(catalogItem, capabilities) {
        if (!isDefined(catalogItem.getCapabilitiesUrl)) {
            throw new TerriaError({
                title: i18next.t("models.webFeatureServiceCatalogItem.missingUrlTitle"),
                message: i18next.t("models.webFeatureServiceCatalogItem.missingUrlMessage")
            });
        }
        if (!isDefined(capabilities))
            capabilities = await WebFeatureServiceCapabilities.fromUrl(proxyCatalogItemUrl(catalogItem, catalogItem.getCapabilitiesUrl, catalogItem.getCapabilitiesCacheDuration));
        return new GetCapabilitiesStratum(catalogItem, capabilities);
    }
    duplicateLoadableStratum(model) {
        return new GetCapabilitiesStratum(model, this.capabilities);
    }
    get capabilitiesFeatureTypes() {
        const lookup = name => [
            name,
            this.capabilities && this.capabilities.findLayer(name)
        ];
        return new Map(this.catalogItem.typeNamesArray.map(lookup));
    }
    get info() {
        const result = [
            createStratumInstance(InfoSectionTraits, {
                name: i18next.t("models.webFeatureServiceCatalogItem.getCapabilitiesUrl"),
                content: this.catalogItem.getCapabilitiesUrl
            })
        ];
        let firstDataDescription;
        for (const layer of this.capabilitiesFeatureTypes.values()) {
            if (!layer ||
                !layer.Abstract ||
                containsAny(layer.Abstract, WebFeatureServiceCatalogItem.abstractsToIgnore)) {
                continue;
            }
            const suffix = this.capabilitiesFeatureTypes.size === 1 ? "" : ` - ${layer.Title}`;
            const name = `${i18next.t("models.webFeatureServiceCatalogItem.abstract")}${suffix}`;
            result.push(createStratumInstance(InfoSectionTraits, {
                name,
                content: layer.Abstract
            }));
            firstDataDescription = firstDataDescription || layer.Abstract;
        }
        // Show the service abstract if there is one and if it isn't the Geoserver default "A compliant implementation..."
        const service = this.capabilities && this.capabilities.service;
        if (service) {
            if (service &&
                service.Abstract &&
                !containsAny(service.Abstract, WebFeatureServiceCatalogItem.abstractsToIgnore) &&
                service.Abstract !== firstDataDescription) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webFeatureServiceCatalogItem.abstract"),
                    content: service.Abstract
                }));
            }
            // Show the Access Constraints if it isn't "none" (because that's the default, and usually a lie).
            if (service.AccessConstraints &&
                !/^none$/i.test(service.AccessConstraints)) {
                result.push(createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.webFeatureServiceCatalogItem.accessConstraints"),
                    content: service.AccessConstraints
                }));
            }
        }
        return result;
    }
    get infoSectionOrder() {
        let layerDescriptions = [
            i18next.t("models.webFeatureServiceCatalogItem.abstract")
        ];
        // If more than one layer, push layer description titles for each applicable layer
        if (this.capabilitiesFeatureTypes.size > 1) {
            layerDescriptions = [];
            this.capabilitiesFeatureTypes.forEach(layer => {
                if (layer &&
                    layer.Abstract &&
                    !containsAny(layer.Abstract, WebFeatureServiceCatalogItem.abstractsToIgnore)) {
                    layerDescriptions.push(`${i18next.t("models.webFeatureServiceCatalogItem.abstract")} - ${layer.Title}`);
                }
            });
        }
        return [
            i18next.t("preview.disclaimer"),
            i18next.t("description.name"),
            ...layerDescriptions,
            i18next.t("preview.datasetDescription"),
            i18next.t("preview.serviceDescription"),
            i18next.t("models.webFeatureServiceCatalogItem.serviceDescription"),
            i18next.t("preview.resourceDescription"),
            i18next.t("preview.licence"),
            i18next.t("preview.accessConstraints"),
            i18next.t("models.webFeatureServiceCatalogItem.accessConstraints"),
            i18next.t("preview.author"),
            i18next.t("preview.contact"),
            i18next.t("models.webFeatureServiceCatalogItem.serviceContact"),
            i18next.t("preview.created"),
            i18next.t("preview.modified"),
            i18next.t("preview.updateFrequency"),
            i18next.t("models.webFeatureServiceCatalogItem.getCapabilitiesUrl")
        ];
    }
    get rectangle() {
        const layers = [
            ...this.capabilitiesFeatureTypes.values()
        ].filter(isDefined);
        // Only return first layer's rectangle - as we don't support multiple WFS layers
        return layers.length > 0 ? getRectangleFromLayer(layers[0]) : undefined;
    }
    get isGeoServer() {
        if (!this.capabilities) {
            return undefined;
        }
        if (!this.capabilities.service ||
            !this.capabilities.service.KeywordList ||
            !this.capabilities.service.KeywordList.Keyword) {
            return false;
        }
        const keyword = this.capabilities.service.KeywordList.Keyword;
        if (isReadOnlyArray(keyword)) {
            return keyword.indexOf("GEOSERVER") >= 0;
        }
        else {
            return keyword === "GEOSERVER";
        }
    }
}
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "capabilitiesFeatureTypes", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "info", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "infoSectionOrder", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "rectangle", null);
__decorate([
    computed
], GetCapabilitiesStratum.prototype, "isGeoServer", null);
class WebFeatureServiceCatalogItem extends GetCapabilitiesMixin(UrlMixin(GeoJsonMixin(CreateModel(WebFeatureServiceCatalogItemTraits)))) {
    constructor() {
        super(...arguments);
        // hide elements in the info section which might show information about the datasource
        this._sourceInfoItemNames = [
            i18next.t("models.webFeatureServiceCatalogItem.getCapabilitiesUrl")
        ];
    }
    get type() {
        return WebFeatureServiceCatalogItem.type;
    }
    get defaultGetCapabilitiesUrl() {
        if (this.uri) {
            return this.uri
                .clone()
                .setSearch({
                service: "WFS",
                version: "1.1.0",
                request: "GetCapabilities"
            })
                .toString();
        }
        else {
            return undefined;
        }
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
    async forceLoadGeojsonData() {
        var _a;
        const getCapabilitiesStratum = this.strata.get(GetCapabilitiesMixin.getCapabilitiesStratumName);
        if (!this.uri) {
            throw new TerriaError({
                sender: this,
                title: i18next.t("models.webFeatureServiceCatalogItem.missingUrlTitle"),
                message: i18next.t("models.webFeatureServiceCatalogItem.missingUrlMessage", this)
            });
        }
        // Check if layers exist
        const missingLayers = this.typeNamesArray.filter(layer => !getCapabilitiesStratum.capabilitiesFeatureTypes.has(layer));
        if (missingLayers.length > 0) {
            throw new TerriaError({
                sender: this,
                title: i18next.t("models.webFeatureServiceCatalogItem.noLayerFoundTitle"),
                message: i18next.t("models.webFeatureServiceCatalogItem.noLayerFoundMessage", this)
            });
        }
        // Check if geojson output is supported (by checking GetCapabilities OutputTypes OR FeatureType OutputTypes)
        const hasOutputFormat = (outputFormats) => {
            return isDefined(outputFormats === null || outputFormats === void 0 ? void 0 : outputFormats.find(format => ["json", "JSON", "application/json"].includes(format)));
        };
        const supportsGeojson = hasOutputFormat(getCapabilitiesStratum.capabilities.outputTypes) ||
            [...getCapabilitiesStratum.capabilitiesFeatureTypes.values()].reduce((hasGeojson, current) => hasGeojson && hasOutputFormat(current === null || current === void 0 ? void 0 : current.OutputFormats), true);
        const url = this.uri
            .clone()
            .setSearch(combine({
            service: "WFS",
            request: "GetFeature",
            typeName: this.typeNames,
            version: "1.1.0",
            outputFormat: supportsGeojson ? "JSON" : "gml3",
            srsName: "urn:ogc:def:crs:EPSG::4326",
            maxFeatures: this.maxFeatures
        }, this.parameters))
            .toString();
        const getFeatureResponse = await loadText(proxyCatalogItemUrl(this, url));
        // Check for errors (if supportsGeojson and the request returns XML, OR the response includes ExceptionReport)
        if ((supportsGeojson && getFeatureResponse.startsWith("<")) ||
            getFeatureResponse.includes("ExceptionReport")) {
            let errorMessage;
            try {
                errorMessage = (_a = xml2json(getFeatureResponse).Exception) === null || _a === void 0 ? void 0 : _a.ExceptionText;
            }
            catch { }
            throw new TerriaError({
                sender: this,
                title: i18next.t("models.webFeatureServiceCatalogItem.missingDataTitle"),
                message: `${i18next.t("models.webFeatureServiceCatalogItem.missingDataMessage", this)} ${isDefined(errorMessage) ? `<br/>Error: ${errorMessage}` : ""}`
            });
        }
        let geojsonData = supportsGeojson
            ? JSON.parse(getFeatureResponse)
            : gmlToGeoJson(getFeatureResponse);
        const fc = toFeatureCollection(geojsonData);
        if (fc)
            return fc;
        throw TerriaError.from("Invalid geojson data - only FeatureCollection and Feature are supported");
    }
    get typeNamesArray() {
        if (Array.isArray(this.typeNames)) {
            return this.typeNames;
        }
        else if (this.typeNames) {
            return this.typeNames.split(",");
        }
        else {
            return [];
        }
    }
    get shortReport() {
        var _a;
        // Show notice if reached
        if (isObservableArray((_a = this.readyData) === null || _a === void 0 ? void 0 : _a.features) &&
            this.readyData.features.length >= this.maxFeatures) {
            return i18next.t("models.webFeatureServiceCatalogItem.reachedMaxFeatureLimit", this);
        }
        return undefined;
    }
}
/**
 * The collection of strings that indicate an Abstract property should be ignored.  If these strings occur anywhere
 * in the Abstract, the Abstract will not be used.  This makes it easy to filter out placeholder data like
 * Geoserver's "A compliant implementation of WFS..." stock abstract.
 */
WebFeatureServiceCatalogItem.abstractsToIgnore = [
    "A compliant implementation of WFS",
    "This is the reference implementation of WFS 1.0.0 and WFS 1.1.0, supports all WFS operations including Transaction."
];
WebFeatureServiceCatalogItem.type = "wfs";
__decorate([
    computed
], WebFeatureServiceCatalogItem.prototype, "typeNamesArray", null);
__decorate([
    computed
], WebFeatureServiceCatalogItem.prototype, "shortReport", null);
export default WebFeatureServiceCatalogItem;
//# sourceMappingURL=WebFeatureServiceCatalogItem.js.map
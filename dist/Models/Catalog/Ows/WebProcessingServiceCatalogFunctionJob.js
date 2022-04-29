var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, isObservableArray, observable, runInAction, toJS } from "mobx";
import Mustache from "mustache";
import URI from "urijs";
import isDefined from "../../../Core/isDefined";
import TerriaError from "../../../Core/TerriaError";
import CatalogFunctionJobMixin from "../../../ModelMixins/CatalogFunctionJobMixin";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import XmlRequestMixin from "../../../ModelMixins/XmlRequestMixin";
import xml2json from "../../../ThirdParty/xml2json";
import { ShortReportTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import { FeatureInfoTemplateTraits } from "../../../Traits/TraitsClasses/FeatureInfoTraits";
import WebProcessingServiceCatalogFunctionJobTraits from "../../../Traits/TraitsClasses/WebProcessingServiceCatalogFunctionJobTraits";
import CatalogMemberFactory from "../CatalogMemberFactory";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import GeoJsonCatalogItem from "../CatalogItems/GeoJsonCatalogItem";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
import updateModelFromJson from "../../Definition/updateModelFromJson";
import upsertModelFromJson from "../../Definition/upsertModelFromJson";
const executeWpsTemplate = require("./ExecuteWpsTemplate.xml");
const createGuid = require("terriajs-cesium/Source/Core/createGuid").default;
class WpsLoadableStratum extends LoadableStratum(WebProcessingServiceCatalogFunctionJobTraits) {
    constructor(item) {
        super();
        this.item = item;
    }
    duplicateLoadableStratum(newModel) {
        return new WpsLoadableStratum(newModel);
    }
    static async load(item) {
        return new WpsLoadableStratum(item);
    }
    get shortReportSections() {
        const reports = this.item.outputs
            .map(output => {
            let report;
            if (isDefined(output.Data.LiteralData)) {
                report = createStratumInstance(ShortReportTraits, {
                    name: output.Title,
                    content: formatOutputValue(output.Title, output.Data.LiteralData)
                });
            }
            return report;
        })
            .filter(isDefined);
        return reports;
    }
    get featureInfoTemplate() {
        var _a;
        const template = [
            "#### Inputs\n\n" + ((_a = this.item.info.find(info => info.name === "Inputs")) === null || _a === void 0 ? void 0 : _a.content),
            "#### Outputs\n\n" + this.outputsSectionHtml
        ].join("\n\n");
        return createStratumInstance(FeatureInfoTemplateTraits, {
            template
        });
    }
    get outputsSectionHtml() {
        const outputsSection = '<table class="cesium-infoBox-defaultTable">' +
            this.item.outputs.reduce((previousValue, output) => {
                if (!isDefined(output.Data) ||
                    (!isDefined(output.Data.LiteralData) &&
                        !isDefined(output.Data.ComplexData))) {
                    return previousValue;
                }
                let content = "";
                if (isDefined(output.Data.LiteralData)) {
                    content = formatOutputValue(output.Title, output.Data.LiteralData);
                }
                else if (isDefined(output.Data.ComplexData)) {
                    if (output.Data.ComplexData.mimeType === "text/csv") {
                        content =
                            '<chart can-download="true" hide-buttons="false" title="' +
                                output.Title +
                                "\" data='" +
                                output.Data.ComplexData +
                                '\' styling: "feature-info">';
                    }
                    else if (output.Data.ComplexData.mimeType ===
                        "application/vnd.terriajs.catalog-member+json") {
                        content = "Chart " + output.Title + " generated.";
                    }
                    // Support other types of ComplexData here as it becomes necessary.
                }
                return (previousValue +
                    "<tr>" +
                    '<td style="vertical-align: middle">' +
                    output.Title +
                    "</td>" +
                    "<td>" +
                    content +
                    "</td>" +
                    "</tr>");
            }, "") +
            "</table>";
        return outputsSection;
    }
    get rectangle() {
        var _a;
        return (_a = this.item.geoJsonItem) === null || _a === void 0 ? void 0 : _a.rectangle;
    }
}
WpsLoadableStratum.stratumName = "wpsLoadable";
__decorate([
    computed
], WpsLoadableStratum.prototype, "shortReportSections", null);
__decorate([
    computed
], WpsLoadableStratum.prototype, "featureInfoTemplate", null);
__decorate([
    computed
], WpsLoadableStratum.prototype, "outputsSectionHtml", null);
__decorate([
    computed
], WpsLoadableStratum.prototype, "rectangle", null);
__decorate([
    action
], WpsLoadableStratum, "load", null);
StratumOrder.addLoadStratum(WpsLoadableStratum.stratumName);
export default class WebProcessingServiceCatalogFunctionJob extends XmlRequestMixin(CatalogFunctionJobMixin(CreateModel(WebProcessingServiceCatalogFunctionJobTraits))) {
    constructor() {
        super(...arguments);
        this.proxyCacheDuration = "1d";
    }
    get type() {
        return WebProcessingServiceCatalogFunctionJob.type;
    }
    get typeName() {
        return i18next.t("models.webProcessingService.wpsResult");
    }
    get executeUrlParameters() {
        return {
            service: "WPS",
            request: "Execute",
            version: "1.0.0"
        };
    }
    /**
     * Returns the proxied URL for the Execute endpoint.
     */
    get executeUrl() {
        if (!isDefined(this.url)) {
            return;
        }
        const uri = new URI(this.url).query(this.executeUrlParameters);
        return proxyCatalogItemUrl(this, uri.toString(), this.proxyCacheDuration);
    }
    async _invoke() {
        if (!isDefined(this.identifier) ||
            !isDefined(this.executeUrl) ||
            !isDefined(this.wpsParameters)) {
            throw `Identifier, executeUrl and wpsParameters must be set`;
        }
        const identifier = this.identifier;
        const executeUrl = this.executeUrl;
        const parameters = {
            ...this.executeUrlParameters,
            Identifier: htmlEscapeText(identifier),
            DataInputs: toJS(this.wpsParameters),
            storeExecuteResponse: toJS(this.storeSupported),
            status: toJS(this.statusSupported)
        };
        let promise;
        if (this.executeWithHttpGet) {
            promise = this.getXml(executeUrl, {
                ...parameters,
                DataInputs: parameters.DataInputs.map(({ inputIdentifier: id, inputValue: val }) => `${id}=${val}`).join(";")
            });
        }
        else {
            const executeXml = Mustache.render(executeWpsTemplate, parameters);
            promise = this.postXml(executeUrl, executeXml);
        }
        const executeResponseXml = await promise;
        if (!executeResponseXml ||
            !executeResponseXml.documentElement ||
            executeResponseXml.documentElement.localName !== "ExecuteResponse") {
            throw `Invalid XML response for WPS ExecuteResponse`;
        }
        const json = xml2json(executeResponseXml);
        // Check if finished
        if (this.checkStatus(json)) {
            // set result
            runInAction(() => this.setTrait(CommonStrata.user, "wpsResponse", json));
            return true;
        }
        // If not finished, set response URL for polling
        runInAction(() => this.setTrait(CommonStrata.user, "wpsResponseUrl", json.statusLocation));
        return false;
    }
    /**
     * Return true for finished, false for running, throw error otherwise
     */
    checkStatus(json) {
        var _a, _b;
        const status = json.Status;
        if (!isDefined(status)) {
            throw new TerriaError({
                sender: this,
                title: i18next.t("models.webProcessingService.invalidResponseErrorTitle"),
                message: i18next.t("models.webProcessingService.invalidResponseErrorMessage", {
                    name: this.name
                })
            });
        }
        if (isDefined(status.ProcessFailed)) {
            throw ((_b = (_a = status.ProcessFailed.ExceptionReport) === null || _a === void 0 ? void 0 : _a.Exception) === null || _b === void 0 ? void 0 : _b.ExceptionText) ||
                JSON.stringify(status.ProcessFailed);
        }
        else if (isDefined(status.ProcessSucceeded)) {
            return true;
        }
        return false;
    }
    async pollForResults() {
        if (!isDefined(this.wpsResponseUrl)) {
            return true;
        }
        const promise = this.getXml(proxyCatalogItemUrl(this, this.wpsResponseUrl, "0d"));
        const xml = await promise;
        const json = xml2json(xml);
        return this.checkStatus(json);
    }
    async downloadResults() {
        if (isDefined(this.wpsResponseUrl) && !isDefined(this.wpsResponse)) {
            const url = proxyCatalogItemUrl(this, this.wpsResponseUrl, "0d");
            const wpsResponse = xml2json(await this.getXml(url));
            runInAction(() => {
                this.setTrait(CommonStrata.user, "wpsResponse", wpsResponse);
            });
        }
        if (!isDefined(this.wpsResponse))
            return;
        const reports = [];
        const outputs = runInAction(() => this.outputs);
        const results = [];
        await Promise.all(outputs.map(async (output, i) => {
            if (!output.Data.ComplexData) {
                return;
            }
            let reportContent = output.Data.ComplexData;
            if (output.Data.ComplexData.mimeType === "text/csv") {
                reportContent =
                    '<collapsible title="' +
                        output.Title +
                        '" open="' +
                        (i === 0 ? "true" : "false") +
                        '">';
                reportContent +=
                    '<chart can-download="true" hide-buttons="false" title="' +
                        output.Title +
                        "\" data='" +
                        output.Data.ComplexData.text +
                        '\' styling="histogram"></chart>';
                reportContent += "</collapsible>";
            }
            else if (output.Data.ComplexData.mimeType ===
                "application/vnd.terriajs.catalog-member+json") {
                // Create a catalog member from the embedded json
                const json = JSON.parse(output.Data.ComplexData.text);
                const catalogItem = await this.createCatalogItemFromJson(json);
                if (isDefined(catalogItem)) {
                    if (CatalogMemberMixin.isMixedInto(catalogItem))
                        results.push(catalogItem);
                    reportContent = "Chart " + output.Title + " generated.";
                }
            }
            reports.push(createStratumInstance(ShortReportTraits, {
                name: output.Title,
                content: reportContent
            }));
        }));
        // Create geojson catalog item for input features
        const geojsonFeatures = runInAction(() => this.geojsonFeatures);
        if (isDefined(geojsonFeatures)) {
            runInAction(() => {
                this.geoJsonItem = new GeoJsonCatalogItem(createGuid(), this.terria);
                updateModelFromJson(this.geoJsonItem, CommonStrata.user, {
                    name: `${this.name} Input Features`,
                    // Use cesium primitives so we don't have to deal with feature picking/selection
                    forceCesiumPrimitives: true,
                    geoJsonData: {
                        type: "FeatureCollection",
                        features: geojsonFeatures,
                        totalFeatures: this.geojsonFeatures.length
                    }
                });
            });
            (await this.geoJsonItem.loadMapItems()).throwIfError;
        }
        runInAction(() => {
            this.setTrait(CommonStrata.user, "shortReportSections", reports);
        });
        return results;
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
    async forceLoadMetadata() {
        await super.forceLoadMetadata();
        const stratum = await WpsLoadableStratum.load(this);
        runInAction(() => {
            this.strata.set(WpsLoadableStratum.stratumName, stratum);
        });
    }
    async forceLoadMapItems() {
        if (isDefined(this.geoJsonItem)) {
            const geoJsonItem = this.geoJsonItem;
            (await geoJsonItem.loadMapItems()).throwIfError();
        }
    }
    /**
     * Returns all the process outputs skipping process contexts and empty outputs
     */
    get outputs() {
        const wpsResponse = this.wpsResponse;
        if (!wpsResponse ||
            !wpsResponse.ProcessOutputs ||
            !wpsResponse.ProcessOutputs.Output) {
            return [];
        }
        const obj = wpsResponse.ProcessOutputs.Output;
        const outputs = Array.isArray(obj) || isObservableArray(obj) ? obj : [obj];
        return outputs.filter(o => o.Identifier !== ".context" && isDefined(o.Data));
    }
    async createCatalogItemFromJson(json) {
        let itemJson = json;
        try {
            if (this.forceConvertResultsToV8 ||
                // If startData.version has version 0.x.x - user catalog-converter to convert result
                ("version" in itemJson &&
                    typeof itemJson.version === "string" &&
                    itemJson.version.startsWith("0"))) {
                itemJson = await convertResultV7toV8(json);
            }
        }
        catch (e) {
            throw e;
        }
        const catalogItem = upsertModelFromJson(CatalogMemberFactory, this.terria, this.uniqueId || "", CommonStrata.user, {
            ...itemJson,
            id: createGuid()
        }, {
            addModelToTerria: false
        }).throwIfError({
            title: "WPS output error",
            message: `Failed to create Terria model from WPS output${itemJson.name ? `: ${itemJson.name}` : ""}`
        });
        return catalogItem;
    }
}
WebProcessingServiceCatalogFunctionJob.type = "wps-result";
__decorate([
    observable
], WebProcessingServiceCatalogFunctionJob.prototype, "geoJsonItem", void 0);
__decorate([
    computed
], WebProcessingServiceCatalogFunctionJob.prototype, "executeUrl", null);
__decorate([
    action
], WebProcessingServiceCatalogFunctionJob.prototype, "checkStatus", null);
__decorate([
    computed
], WebProcessingServiceCatalogFunctionJob.prototype, "mapItems", null);
__decorate([
    computed
], WebProcessingServiceCatalogFunctionJob.prototype, "outputs", null);
function formatOutputValue(title, value) {
    if (!isDefined(value)) {
        return "";
    }
    const values = value.split(",");
    return values.reduce(function (previousValue, currentValue) {
        if (value.match(/[.\/](png|jpg|jpeg|gif|svg)/i)) {
            return (previousValue +
                '<a href="' +
                currentValue +
                '"><img src="' +
                currentValue +
                '" alt="' +
                title +
                '" /></a>');
        }
        else if (currentValue.indexOf("http:") === 0 ||
            currentValue.indexOf("https:") === 0) {
            const uri = new URI(currentValue);
            return (previousValue +
                '<a href="' +
                currentValue +
                '">' +
                uri.filename() +
                "</a>");
        }
        else {
            return previousValue + currentValue;
        }
    }, "");
}
async function convertResultV7toV8(input) {
    const { convertMember, convertCatalog } = await import("catalog-converter");
    if (typeof input.type === "string") {
        const { member, messages } = convertMember(input);
        if (member === null)
            throw TerriaError.combine(messages.map(m => TerriaError.from(m.message)), "Error converting v7 item to v8");
        return member;
    }
    else {
        const { result, messages } = convertCatalog(input);
        if (result === null)
            throw TerriaError.combine(messages.map(m => TerriaError.from(m.message)), "Error converting v7 catalog to v8");
        return result;
    }
}
function htmlEscapeText(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
//# sourceMappingURL=WebProcessingServiceCatalogFunctionJob.js.map
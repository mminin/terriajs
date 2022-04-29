var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed, runInAction } from "mobx";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import RequestErrorEvent from "terriajs-cesium/Source/Core/RequestErrorEvent";
import URI from "urijs";
import AsyncLoader from "../Core/AsyncLoader";
import isDefined from "../Core/isDefined";
import loadBlob from "../Core/loadBlob";
import loadXML from "../Core/loadXML";
import Result from "../Core/Result";
import TerriaError, { networkRequestError } from "../Core/TerriaError";
import proxyCatalogItemUrl from "../Models/Catalog/proxyCatalogItemUrl";
import ResultPendingCatalogItem from "../Models/Catalog/ResultPendingCatalogItem";
import CommonStrata from "../Models/Definition/CommonStrata";
import createStratumInstance from "../Models/Definition/createStratumInstance";
import LoadableStratum from "../Models/Definition/LoadableStratum";
import StratumOrder from "../Models/Definition/StratumOrder";
import UserDrawing from "../Models/UserDrawing";
import xml2json from "../ThirdParty/xml2json";
import { InfoSectionTraits } from "../Traits/TraitsClasses/CatalogMemberTraits";
import ExportWebCoverageServiceTraits, { WebCoverageServiceParameterTraits } from "../Traits/TraitsClasses/ExportWebCoverageServiceTraits";
import { getName } from "./CatalogMemberMixin";
import ExportableMixin from "./ExportableMixin";
import filterOutUndefined from "../Core/filterOutUndefined";
const sprintf = require("terriajs-cesium/Source/ThirdParty/sprintf").default;
/** Call WCS GetCapabilities to get list of:
 * - available coverages
 * - available CRS
 * - available file formats
 *
 * Note: not currently used
 */
class WebCoverageServiceCapabilitiesStratum extends LoadableStratum(ExportWebCoverageServiceTraits) {
    constructor(catalogItem, capabilities) {
        super();
        this.catalogItem = catalogItem;
        this.capabilities = capabilities;
    }
    static async load(catalogItem) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!catalogItem.linkedWcsUrl)
            throw "`linkedWcsUrl` is undefined";
        const url = new URI(catalogItem.linkedWcsUrl)
            .query({
            service: "WCS",
            request: "GetCapabilities",
            version: "2.0.0"
        })
            .toString();
        const capabilitiesXml = await loadXML(proxyCatalogItemUrl(catalogItem, url));
        const json = xml2json(capabilitiesXml);
        if (!isDefined(json.ServiceMetadata)) {
            throw networkRequestError({
                title: "Invalid GetCapabilities",
                message: `The URL ${url} was retrieved successfully but it does not appear to be a valid Web Coverage Service (WCS) GetCapabilities document.` +
                    `\n\nEither the catalog file has been set up incorrectly, or the server address has changed.`
            });
        }
        const coverages = (_b = (_a = json.Contents) === null || _a === void 0 ? void 0 : _a.CoverageSummary) !== null && _b !== void 0 ? _b : [];
        const formats = (_d = (_c = json.ServiceMetadata) === null || _c === void 0 ? void 0 : _c.formatSupported) !== null && _d !== void 0 ? _d : [];
        const crs = (_h = (_g = (_f = (_e = json.ServiceMetadata) === null || _e === void 0 ? void 0 : _e.Extension) === null || _f === void 0 ? void 0 : _f.CrsMetadata) === null || _g === void 0 ? void 0 : _g.crsSupported) !== null && _h !== void 0 ? _h : [];
        return new WebCoverageServiceCapabilitiesStratum(catalogItem, {
            coverages,
            formats,
            crs
        });
    }
    duplicateLoadableStratum(model) {
        return new WebCoverageServiceCapabilitiesStratum(model, this.capabilities);
    }
}
WebCoverageServiceCapabilitiesStratum.stratumName = "wcsCapabilitiesStratum";
/** Call WCS DescribeCoverage for a specific coverageId to get:
 * - Native CRS
 * - Native format
 */
class WebCoverageServiceDescribeCoverageStratum extends LoadableStratum(ExportWebCoverageServiceTraits) {
    constructor(catalogItem, coverage) {
        super();
        this.catalogItem = catalogItem;
        this.coverage = coverage;
    }
    static async load(catalogItem) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (!catalogItem.linkedWcsUrl)
            throw "`linkedWcsUrl` is undefined";
        if (!catalogItem.linkedWcsCoverage)
            throw "`linkedWcsCoverage` is undefined";
        const url = new URI(catalogItem.linkedWcsUrl)
            .query({
            service: "WCS",
            request: "DescribeCoverage",
            version: "2.0.0",
            coverageId: catalogItem.linkedWcsCoverage
        })
            .toString();
        const capabilitiesXml = await loadXML(proxyCatalogItemUrl(catalogItem, url));
        const json = xml2json(capabilitiesXml);
        if (typeof ((_a = json.CoverageDescription) === null || _a === void 0 ? void 0 : _a.CoverageId) !== "string") {
            throw networkRequestError({
                title: "Invalid DescribeCoverage",
                message: `The URL ${url} was retrieved successfully but it does not appear to be a valid Web Coverage Service (WCS) DescribeCoverage document.` +
                    `\n\nEither the catalog file has been set up incorrectly, or the server address has changed.`
            });
        }
        const nativeFormat = (_c = (_b = json.CoverageDescription) === null || _b === void 0 ? void 0 : _b.ServiceParameters) === null || _c === void 0 ? void 0 : _c.nativeFormat;
        // Try get native CRS from domainSet and then boundedBy
        const nativeCrs = (_l = (_g = (_f = (_e = (_d = json.CoverageDescription) === null || _d === void 0 ? void 0 : _d.domainSet) === null || _e === void 0 ? void 0 : _e.Grid) === null || _f === void 0 ? void 0 : _f.srsName) !== null && _g !== void 0 ? _g : (_k = (_j = (_h = json.CoverageDescription) === null || _h === void 0 ? void 0 : _h.boundedBy) === null || _j === void 0 ? void 0 : _j.EnvelopeWithTimePeriod) === null || _k === void 0 ? void 0 : _k.srsName) !== null && _l !== void 0 ? _l : (_p = (_o = (_m = json.CoverageDescription) === null || _m === void 0 ? void 0 : _m.boundedBy) === null || _o === void 0 ? void 0 : _o.Envelope) === null || _p === void 0 ? void 0 : _p.srsName;
        return new WebCoverageServiceDescribeCoverageStratum(catalogItem, {
            nativeFormat,
            nativeCrs
        });
    }
    get linkedWcsParameters() {
        return createStratumInstance(WebCoverageServiceParameterTraits, {
            outputCrs: this.coverage.nativeCrs,
            outputFormat: this.coverage.nativeFormat
        });
    }
    duplicateLoadableStratum(model) {
        return new WebCoverageServiceDescribeCoverageStratum(model, this.coverage);
    }
}
WebCoverageServiceDescribeCoverageStratum.stratumName = "wcsDescribeCoverageStratum";
__decorate([
    computed
], WebCoverageServiceDescribeCoverageStratum.prototype, "linkedWcsParameters", null);
function ExportWebCoverageServiceMixin(Base) {
    class ExportWebCoverageServiceMixin extends ExportableMixin(Base) {
        constructor() {
            super(...arguments);
            this._wcsCapabilitiesLoader = new AsyncLoader(this.loadWcsCapabilities.bind(this));
            this._wcsDescribeCoverageLoader = new AsyncLoader(this.loadWcsDescribeCoverage.bind(this));
        }
        get isLoadingWcsMetadata() {
            return (this._wcsCapabilitiesLoader.isLoading ||
                this._wcsDescribeCoverageLoader.isLoading);
        }
        async loadWcsMetadata(force) {
            const results = await Promise.all([
                // Disable GetCapabilities loader until we need it
                // this._wcsCapabilitiesLoader.load(force),
                this._wcsDescribeCoverageLoader.load(force)
            ]);
            return Result.combine(results, {
                message: `Failed to load \`${getName(this)}\` WebCoverageService metadata`,
                importance: -1
            });
        }
        async loadWcsCapabilities() {
            const capabilities = await WebCoverageServiceCapabilitiesStratum.load(this);
            runInAction(() => this.strata.set(WebCoverageServiceCapabilitiesStratum.stratumName, capabilities));
        }
        async loadWcsDescribeCoverage() {
            const describeCoverage = await WebCoverageServiceDescribeCoverageStratum.load(this);
            runInAction(() => this.strata.set(WebCoverageServiceDescribeCoverageStratum.stratumName, describeCoverage));
        }
        // ExportableMixin overrides
        get _canExportData() {
            return isDefined(this.linkedWcsCoverage) && isDefined(this.linkedWcsUrl);
        }
        _exportData() {
            return new Promise((resolve, reject) => {
                const terria = this.terria;
                runInAction(() => (terria.pickedFeatures = undefined));
                let rectangle;
                const userDrawing = new UserDrawing({
                    terria: this.terria,
                    messageHeader: "Click two points to draw a retangle extent.",
                    buttonText: "Download Extent",
                    onPointClicked: () => {
                        var _a, _b, _c, _d, _e;
                        if (userDrawing.pointEntities.entities.values.length >= 2) {
                            rectangle = (_e = (_d = (_c = (_b = (_a = userDrawing === null || userDrawing === void 0 ? void 0 : userDrawing.otherEntities) === null || _a === void 0 ? void 0 : _a.entities) === null || _b === void 0 ? void 0 : _b.getById("rectangle")) === null || _c === void 0 ? void 0 : _c.rectangle) === null || _d === void 0 ? void 0 : _d.coordinates) === null || _e === void 0 ? void 0 : _e.getValue(this.terria.timelineClock.currentTime);
                        }
                    },
                    onCleanUp: async () => {
                        if (isDefined(rectangle)) {
                            if (!this.linkedWcsUrl || !this.linkedWcsCoverage)
                                return;
                            return this.downloadCoverage(rectangle)
                                .then(resolve)
                                .catch(reject);
                        }
                        else {
                            reject("Invalid drawn extent.");
                        }
                    },
                    allowPolygon: false,
                    drawRectangle: true
                });
                userDrawing.enterDrawMode();
            });
        }
        /** Generate WCS GetCoverage URL */
        getCoverageUrl(bbox) {
            var _a, _b;
            try {
                let error = undefined;
                if (this.linkedWcsParameters.duplicateSubsetValues &&
                    this.linkedWcsParameters.duplicateSubsetValues.length > 0) {
                    let message = `WebCoverageService (WCS) only supports one value per dimension.\n\n  `;
                    // Add message for each duplicate subset
                    message += this.linkedWcsParameters.duplicateSubsetValues.map(subset => `- Multiple dimension values have been set for \`${subset.key}\`. WCS GetCoverage request will use the first value (\`${subset.key} = "${subset.value}"\`).`);
                    error = new TerriaError({
                        title: "Warning: export may not reflect displayed data",
                        message,
                        importance: 1
                    });
                }
                // Make query parameter object
                const query = {
                    service: "WCS",
                    request: "GetCoverage",
                    version: "2.0.0",
                    coverageId: this.linkedWcsCoverage,
                    format: this.linkedWcsParameters.outputFormat,
                    // Add subsets for bbox, time and dimensions
                    subset: [
                        `Long(${CesiumMath.toDegrees(bbox.west)},${CesiumMath.toDegrees(bbox.east)})`,
                        `Lat(${CesiumMath.toDegrees(bbox.south)},${CesiumMath.toDegrees(bbox.north)})`,
                        // Turn subsets into `key=(value)` format
                        ...filterOutUndefined(((_a = this.linkedWcsParameters.subsets) !== null && _a !== void 0 ? _a : []).map(subset => subset.key && subset.value
                            ? `${subset.key}(${
                            // Wrap string values in double quotes
                            typeof subset.value === "string"
                                ? `"${subset.value}"`
                                : subset.value})`
                            : undefined))
                    ],
                    subsettingCrs: "EPSG:4326",
                    outputCrs: this.linkedWcsParameters.outputCrs
                };
                // Add linkedWcsParameters.additionalParameters ontop of query object
                Object.assign(query, ((_b = this.linkedWcsParameters.additionalParameters) !== null && _b !== void 0 ? _b : []).reduce((q, current) => {
                    if (typeof current.key === "string") {
                        q[current.key] = current.value;
                    }
                    return q;
                }, {}));
                return new Result(new URI(this.linkedWcsUrl).query(query).toString(), error);
            }
            catch (e) {
                return Result.error(e);
            }
        }
        /** This function downloads WCS coverage for a given bbox (in radians)
         * It will also create a "pendingWorkbenchItem" with loading indicator and short description.
         */
        async downloadCoverage(bbox) {
            var _a, _b, _c, _d, _e, _f, _g;
            // Create pending workbench item
            const now = new Date();
            const timestamp = sprintf("%04d-%02d-%02dT%02d:%02d:%02d", now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
            const pendingWorkbenchItem = new ResultPendingCatalogItem(`WCS: ${getName(this)} ${timestamp}`, this.terria);
            try {
                runInAction(() => {
                    pendingWorkbenchItem.loadPromise = new Promise(() => { });
                    pendingWorkbenchItem.loadMetadata();
                    // Add WCS loading metadata message to shortReport
                    pendingWorkbenchItem.setTrait(CommonStrata.user, "shortReport", i18next.t("models.wcs.asyncResultLoadingMetadata", {
                        name: getName(this),
                        timestamp: timestamp
                    }));
                });
                pendingWorkbenchItem.terria.workbench.add(pendingWorkbenchItem);
                // Load WCS metadata (DescribeCoverage request)
                (await this.loadWcsMetadata()).throwIfError();
                // Get WCS URL
                // This will throw an error if URL is undefined
                // It will raise an error if URL is defined, but an error has occurred
                const urlResult = this.getCoverageUrl(bbox);
                const url = urlResult.throwIfUndefined({
                    message: "Failed to generate WCS GetCoverage request URL",
                    importance: 2 // Higher importance than error message in `getCoverageUrl()`
                });
                urlResult.raiseError(this.terria, `Error occurred while generating WCS GetCoverage URL`);
                runInAction(() => {
                    // Add WCS "pending" message to shortReport
                    pendingWorkbenchItem.setTrait(CommonStrata.user, "shortReport", i18next.t("models.wcs.asyncPendingDescription", {
                        name: getName(this),
                        timestamp: timestamp
                    }));
                    // Create info section from URL query parameters
                    const info = createStratumInstance(InfoSectionTraits, {
                        name: "Inputs",
                        content: `<table class="cesium-infoBox-defaultTable">${Object.entries(new URI(url).query(true)).reduce((previousValue, [key, value]) => `${previousValue}<tr><td style="vertical-align: middle">${key}</td><td>${value}</td></tr>`, "")}</table>`
                    });
                    pendingWorkbenchItem.setTrait(CommonStrata.user, "info", [info]);
                });
                const blob = await loadBlob(proxyCatalogItemUrl(this, url));
                runInAction(() => pendingWorkbenchItem.terria.workbench.remove(pendingWorkbenchItem));
                return { name: `${getName(this)} clip.tiff`, file: blob };
            }
            catch (error) {
                if (error instanceof TerriaError) {
                    throw error;
                }
                // Attempt to get error message out of XML response
                if (error instanceof RequestErrorEvent &&
                    isDefined((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.type) &&
                    ((_b = error.response.type) === null || _b === void 0 ? void 0 : _b.indexOf("xml")) !== -1) {
                    try {
                        const xml = new DOMParser().parseFromString(await error.response.text(), "text/xml");
                        if (xml.documentElement.localName === "ServiceExceptionReport" ||
                            xml.documentElement.localName === "ExceptionReport") {
                            const message = (_e = (_d = (_c = xml.getElementsByTagName("ServiceException")) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.innerHTML) !== null && _e !== void 0 ? _e : (_g = (_f = xml.getElementsByTagName("ows:ExceptionText")) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.innerHTML;
                            if (isDefined(message)) {
                                error = message;
                            }
                        }
                    }
                    catch (xmlParseError) {
                        console.log("Failed to parse WCS response");
                        console.log(xmlParseError);
                    }
                }
                throw new TerriaError({
                    sender: this,
                    title: i18next.t("models.wcs.exportFailedTitle"),
                    message: i18next.t("models.wcs.exportFailedMessageII", {
                        error
                    })
                });
            }
            finally {
                runInAction(() => pendingWorkbenchItem.terria.workbench.remove(pendingWorkbenchItem));
            }
        }
        dispose() {
            super.dispose();
            this._wcsCapabilitiesLoader.dispose();
            this._wcsDescribeCoverageLoader.dispose();
        }
    }
    __decorate([
        computed
    ], ExportWebCoverageServiceMixin.prototype, "isLoadingWcsMetadata", null);
    __decorate([
        computed
    ], ExportWebCoverageServiceMixin.prototype, "_canExportData", null);
    return ExportWebCoverageServiceMixin;
}
(function (ExportWebCoverageServiceMixin) {
    function isMixedInto(model) {
        return (model &&
            "loadWcsMetadata" in model &&
            typeof model.loadWcsMetadata === "function");
    }
    ExportWebCoverageServiceMixin.isMixedInto = isMixedInto;
    StratumOrder.addLoadStratum(WebCoverageServiceCapabilitiesStratum.stratumName);
    StratumOrder.addLoadStratum(WebCoverageServiceDescribeCoverageStratum.stratumName);
})(ExportWebCoverageServiceMixin || (ExportWebCoverageServiceMixin = {}));
export default ExportWebCoverageServiceMixin;
//# sourceMappingURL=ExportWebCoverageServiceMixin.js.map
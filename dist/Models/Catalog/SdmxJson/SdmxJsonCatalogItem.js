var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed, runInAction } from "mobx";
import RequestErrorEvent from "terriajs-cesium/Source/Core/RequestErrorEvent";
import Resource from "terriajs-cesium/Source/Core/Resource";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import TerriaError, { TerriaErrorSeverity } from "../../../Core/TerriaError";
import TableMixin from "../../../ModelMixins/TableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import Csv from "../../../Table/Csv";
import TableAutomaticStylesStratum from "../../../Table/TableAutomaticStylesStratum";
import SdmxCatalogItemTraits from "../../../Traits/TraitsClasses/SdmxCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import StratumOrder from "../../Definition/StratumOrder";
import { filterEnums } from "../../SelectableDimensions/SelectableDimensions";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import { SdmxJsonDataflowStratum } from "./SdmxJsonDataflowStratum";
import { sdmxErrorString, SdmxHttpErrorCodes } from "./SdmxJsonServerStratum";
export default class SdmxJsonCatalogItem extends TableMixin(UrlMixin(CreateModel(SdmxCatalogItemTraits))) {
    static get type() {
        return "sdmx-json";
    }
    constructor(id, terria, sourceReference) {
        super(id, terria, sourceReference);
        this.strata.set(TableAutomaticStylesStratum.stratumName, new TableAutomaticStylesStratum(this));
    }
    async forceLoadMetadata() {
        // Load SdmxJsonDataflowStratum if needed
        if (!this.strata.has(SdmxJsonDataflowStratum.stratumName)) {
            const stratum = await SdmxJsonDataflowStratum.load(this);
            runInAction(() => {
                this.strata.set(SdmxJsonDataflowStratum.stratumName, stratum);
            });
        }
        await this.loadRegionProviderList();
    }
    get type() {
        return SdmxJsonCatalogItem.type;
    }
    get cacheDuration() {
        return super.cacheDuration || "1d";
    }
    /**
     * Map SdmxDimensionTraits to SelectableDimension
     */
    get sdmxSelectableDimensions() {
        return this.dimensions.map((dim) => {
            var _a;
            return {
                id: dim.id,
                name: dim.name,
                options: dim.options,
                selectedId: dim.selectedId,
                allowUndefined: dim.allowUndefined,
                disable: dim.disable ||
                    ((_a = this.columns.find((col) => col.name === dim.id)) === null || _a === void 0 ? void 0 : _a.type) === "region",
                setDimensionValue: async (stratumId, value) => {
                    var _a;
                    let dimensionTraits = (_a = this.dimensions) === null || _a === void 0 ? void 0 : _a.find((sdmxDim) => sdmxDim.id === dim.id);
                    if (!isDefined(dimensionTraits)) {
                        dimensionTraits = this.addObject(stratumId, "dimensions", dim.id);
                    }
                    dimensionTraits.setTrait(stratumId, "selectedId", value);
                    (await this.loadMapItems()).raiseError(this.terria);
                }
            };
        });
    }
    get selectableDimensions() {
        return filterOutUndefined([
            ...super.selectableDimensions.filter((d) => { var _a; return d.id !== ((_a = this.styleDimensions) === null || _a === void 0 ? void 0 : _a.id); }),
            ...this.sdmxSelectableDimensions
        ]);
    }
    /**
     * Returns base URL (from traits), as SdmxJsonCatalogItem will override `url` property with SDMX Data request
     */
    get baseUrl() {
        return super.url;
    }
    get url() {
        if (!super.url)
            return;
        // Get dataKey - this is used to filter dataflows by dimension values - it must be compliant with the KeyType defined in the SDMX WADL (period separated dimension values) - dimension order is very important!
        // We must sort the dimensions by position as traits lose their order across strata
        const dataKey = this.dimensions
            .slice()
            .sort((a, b) => (isDefined(a.position) ? a.position : this.dimensions.length) -
            (isDefined(b.position) ? b.position : this.dimensions.length))
            // If a dimension is disabled, use empty string (which is wildcard)
            .map((dim) => {
            var _a;
            return !dim.disable &&
                ((_a = this.columns.find((col) => col.name === dim.id)) === null || _a === void 0 ? void 0 : _a.type) !== "region"
                ? dim.selectedId
                : "";
        })
            .join(".");
        return `${super.url}/data/${this.dataflowId}/${dataKey}`;
    }
    async forceLoadTableData() {
        if (!this.url)
            return;
        try {
            const csvString = await new Resource({
                url: proxyCatalogItemUrl(this, this.url),
                headers: {
                    Accept: "application/vnd.sdmx.data+csv; version=1.0.0"
                }
            }).fetch();
            if (!isDefined(csvString)) {
                throw new TerriaError({
                    title: i18next.t("models.sdmxCatalogItem.loadDataErrorTitle"),
                    message: i18next.t("models.sdmxCatalogItem.loadDataErrorMessage", this)
                });
            }
            return await Csv.parseString(csvString, true);
        }
        catch (error) {
            if (error instanceof RequestErrorEvent &&
                typeof error.response === "string") {
                // If no results and we have selcetable dimensions, give message regarding dimensions
                // This message will include values for each selectable dimension
                if (error.statusCode === SdmxHttpErrorCodes.NoResults &&
                    this.selectableDimensions.length > 0) {
                    throw new TerriaError({
                        message: i18next.t("models.sdmxCatalogItem.noResultsWithDimensions", {
                            dimensions: filterEnums(this.selectableDimensions)
                                .filter((dim) => { var _a; return !dim.disable && ((_a = dim.options) === null || _a === void 0 ? void 0 : _a.length) !== 1; })
                                .map((dim) => {
                                var _a, _b, _c;
                                // Format string into `${dimenion name} = ${dimenion selected value}
                                return `- ${dim.name} = \`${(_c = (_b = (_a = dim.options) === null || _a === void 0 ? void 0 : _a.find((option) => option.id === dim.selectedId)) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : dim.selectedId}\``;
                            })
                                .join("\n")
                        }),
                        title: i18next.t("models.sdmxCatalogItem.loadDataErrorTitle", this),
                        severity: TerriaErrorSeverity.Warning,
                        importance: 1,
                        overrideRaiseToUser: true
                    });
                }
                throw new TerriaError({
                    message: sdmxErrorString.has(error.statusCode)
                        ? `${sdmxErrorString.get(error.statusCode)}: ${error.response}`
                        : `${error.response}`,
                    title: i18next.t("models.sdmxCatalogItem.loadDataErrorTitle", this)
                });
            }
            else {
                throw TerriaError.from(error, {
                    message: i18next.t("models.sdmxCatalogItem.loadDataErrorTitle", this)
                });
            }
        }
    }
}
__decorate([
    computed
], SdmxJsonCatalogItem.prototype, "cacheDuration", null);
__decorate([
    computed
], SdmxJsonCatalogItem.prototype, "sdmxSelectableDimensions", null);
__decorate([
    computed
], SdmxJsonCatalogItem.prototype, "selectableDimensions", null);
__decorate([
    computed
], SdmxJsonCatalogItem.prototype, "baseUrl", null);
__decorate([
    computed
], SdmxJsonCatalogItem.prototype, "url", null);
StratumOrder.addLoadStratum(TableAutomaticStylesStratum.stratumName);
//# sourceMappingURL=SdmxJsonCatalogItem.js.map
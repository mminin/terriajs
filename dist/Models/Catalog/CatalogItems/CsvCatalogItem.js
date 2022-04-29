var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed, runInAction } from "mobx";
import isDefined from "../../../Core/isDefined";
import TerriaError from "../../../Core/TerriaError";
import AutoRefreshingMixin from "../../../ModelMixins/AutoRefreshingMixin";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import TableMixin from "../../../ModelMixins/TableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import Csv from "../../../Table/Csv";
import TableAutomaticStylesStratum from "../../../Table/TableAutomaticStylesStratum";
import CsvCatalogItemTraits from "../../../Traits/TraitsClasses/CsvCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
// Types of CSVs:
// - Points - Latitude and longitude columns or address
// - Regions - Region column
// - Chart - No spatial reference at all
// - Other geometry - e.g. a WKT column
// Types of time varying:
// - ID+time column -> point moves, region changes (continuously?) over time
// - points, no ID, time -> "blips" with a duration (perhaps provided by another column)
//
export default class CsvCatalogItem extends TableMixin(AutoRefreshingMixin(UrlMixin(CatalogMemberMixin(CreateModel(CsvCatalogItemTraits))))) {
    constructor(id, terria, sourceReference) {
        super(id, terria, sourceReference);
        this.strata.set(TableAutomaticStylesStratum.stratumName, new TableAutomaticStylesStratum(this));
    }
    static get type() {
        return "csv";
    }
    get type() {
        return CsvCatalogItem.type;
    }
    setFileInput(file) {
        this._csvFile = file;
    }
    get hasLocalData() {
        return isDefined(this._csvFile);
    }
    get _canExportData() {
        return (isDefined(this._csvFile) ||
            isDefined(this.csvString) ||
            isDefined(this.url));
    }
    get cacheDuration() {
        return super.cacheDuration || "1d";
    }
    async _exportData() {
        if (isDefined(this._csvFile)) {
            return {
                name: (this.name || this.uniqueId),
                file: this._csvFile
            };
        }
        if (isDefined(this.csvString)) {
            return {
                name: (this.name || this.uniqueId),
                file: new Blob([this.csvString])
            };
        }
        if (isDefined(this.url)) {
            return this.url;
        }
        throw new TerriaError({
            sender: this,
            message: "No data available to download."
        });
    }
    /*
     * The polling URL to use for refreshing data.
     */
    get refreshUrl() {
        return this.polling.url || this.url;
    }
    /*
     * Called by AutoRefreshingMixin to get the polling interval
     */
    get refreshInterval() {
        if (this.refreshUrl) {
            return this.polling.seconds;
        }
    }
    /*
     * Hook called by AutoRefreshingMixin to refresh data.
     *
     * The refresh happens only if a `refreshUrl` is defined.
     * If `shouldReplaceData` is true, then the new data replaces current data,
     * otherwise new data is appended to current data.
     */
    refreshData() {
        if (!this.refreshUrl) {
            return;
        }
        Csv.parseUrl(proxyCatalogItemUrl(this, this.refreshUrl), true, this.ignoreRowsStartingWithComment).then(dataColumnMajor => {
            runInAction(() => {
                if (this.polling.shouldReplaceData) {
                    this.dataColumnMajor = dataColumnMajor;
                }
                else {
                    this.append(dataColumnMajor);
                }
            });
        });
    }
    forceLoadTableData() {
        if (this.csvString !== undefined) {
            return Csv.parseString(this.csvString, true, this.ignoreRowsStartingWithComment);
        }
        else if (this._csvFile !== undefined) {
            return Csv.parseFile(this._csvFile, true, this.ignoreRowsStartingWithComment);
        }
        else if (this.url !== undefined) {
            return Csv.parseUrl(proxyCatalogItemUrl(this, this.url), true, this.ignoreRowsStartingWithComment);
        }
        else {
            return Promise.reject(new TerriaError({
                sender: this,
                title: i18next.t("models.csv.unableToLoadItemTitle"),
                message: i18next.t("models.csv.unableToLoadItemMessage")
            }));
        }
    }
}
__decorate([
    computed
], CsvCatalogItem.prototype, "hasLocalData", null);
__decorate([
    computed
], CsvCatalogItem.prototype, "_canExportData", null);
__decorate([
    computed
], CsvCatalogItem.prototype, "cacheDuration", null);
__decorate([
    computed
], CsvCatalogItem.prototype, "refreshUrl", null);
__decorate([
    computed
], CsvCatalogItem.prototype, "refreshInterval", null);
StratumOrder.addLoadStratum(TableAutomaticStylesStratum.stratumName);
//# sourceMappingURL=CsvCatalogItem.js.map
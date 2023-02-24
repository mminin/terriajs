var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import dateFormat from "dateformat";
import { get as _get, map as _map } from "lodash";
import { computed, observable, runInAction } from "mobx";
import URI from "urijs";
import isDefined from "../../../Core/isDefined";
import loadJson from "../../../Core/loadJson";
import AutoRefreshingMixin from "../../../ModelMixins/AutoRefreshingMixin";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import TableMixin from "../../../ModelMixins/TableMixin";
import TableAutomaticStylesStratum from "../../../Table/TableAutomaticStylesStratum";
import ApiTableCatalogItemTraits from "../../../Traits/TraitsClasses/ApiTableCatalogItemTraits";
import TableStyleTraits from "../../../Traits/TraitsClasses/Table/StyleTraits";
import TableTimeStyleTraits from "../../../Traits/TraitsClasses/Table/TimeStyleTraits";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import saveModelToJson from "../../Definition/saveModelToJson";
import StratumOrder from "../../Definition/StratumOrder";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
export class ApiTableStratum extends LoadableStratum(ApiTableCatalogItemTraits) {
    constructor(catalogItem) {
        super();
        this.catalogItem = catalogItem;
    }
    duplicateLoadableStratum(model) {
        return new ApiTableStratum(model);
    }
    // Set time id columns to `idKey`
    get defaultStyle() {
        return createStratumInstance(TableStyleTraits, {
            time: createStratumInstance(TableTimeStyleTraits, {
                idColumns: this.catalogItem.idKey ? [this.catalogItem.idKey] : undefined
            })
        });
    }
}
ApiTableStratum.stratumName = "apiTable";
__decorate([
    computed
], ApiTableStratum.prototype, "defaultStyle", null);
StratumOrder.addLoadStratum(ApiTableStratum.stratumName);
/**
 * THE API AND TRAITS OF THIS EXPERIMENTAL CATALOG ITEM SHOULD BE CONSIDERED IN
 * ALPHA. EXPECT BREAKING CHANGES.
 *
 * This is a generic, one-size-fits-most catalog item for deriving tables from
 * external APIs. Currently only supports JSON APIs, and doesn't support region
 * mapping. Also currently only supports a single API to get values from, and a
 * single API to get positions from.
 */
export class ApiTableCatalogItem extends AutoRefreshingMixin(TableMixin(CatalogMemberMixin(CreateModel(ApiTableCatalogItemTraits)))) {
    constructor(id, terria) {
        super(id, terria);
        this.apiResponses = [];
        this.hasData = false;
        this.strata.set(TableAutomaticStylesStratum.stratumName, new TableAutomaticStylesStratum(this));
        this.strata.set(ApiTableStratum.stratumName, new ApiTableStratum(this));
    }
    get type() {
        return ApiTableCatalogItem.type;
    }
    get apiDataIsLoaded() {
        return this.apiResponses.length > 0;
    }
    loadDataFromApis() {
        const apisWithUrl = this.apis.filter((api) => api.url);
        const apiUrls = apisWithUrl.map((api) => proxyCatalogItemUrl(this, api.url));
        return Promise.all(apisWithUrl.map(async (api, idx) => {
            let data = await loadJson(apiUrls[idx], undefined, api.requestData
                ? saveModelToJson(api.requestData)
                : undefined, api.postRequestDataAsFormData);
            if (api.responseDataPath !== undefined) {
                data = getResponseDataPath(data, api.responseDataPath);
            }
            return Promise.resolve({
                data,
                api
            });
        })).then((values) => {
            runInAction(() => {
                const columnMajorData = new Map();
                values
                    .filter((val) => val.api.kind === "COLUMN_MAJOR") // column major rows only
                    .map((val, i) => {
                    // add the column name to each column
                    val.data["TERRIA_columnName"] =
                        val.api.columnMajorColumnNames[i];
                    return val.data;
                })
                    .flat()
                    // make row id/data pairs for columnMajorData map
                    .map((data) => Object.entries(data))
                    .flat()
                    // merge rows with the same id
                    .forEach((rowPart) => {
                    const id = rowPart[0];
                    const value = rowPart[1];
                    const row = {};
                    row["value"] = value; // add the id to the row's data
                    row[this.idKey] = id;
                    if (columnMajorData.has(id)) {
                        let currentRow = columnMajorData.get(id);
                        columnMajorData.set(id, { currentRow, ...value });
                    }
                    else {
                        columnMajorData.set(id, row);
                    }
                });
                if (columnMajorData.size !== 0) {
                    this.apiResponses = Array.from(columnMajorData.values());
                    return;
                }
                // Make map of ids to values that are constant for that id
                const perIdData = new Map(values
                    .filter((val) => val.api.kind === "PER_ID") // per id only
                    .map((val) => val.data) // throw away api, keep data
                    .reduce((curr, prev) => curr.concat(prev), []) // flatten
                    // make id/data pair for perIdData map
                    .map((data) => [data[this.idKey], data]));
                // Merge PER_ID data with *all* PER_ROW data (this may result in the same PER_ID data row being added to multiple PER_ROW data row)
                const perRowData = values
                    .filter((val) => val.api.kind === "PER_ROW")
                    .map((val) => val.data)
                    .reduce((curr, prev) => curr.concat(prev), [])
                    .map((row) => Object.assign(row, isDefined(row[this.idKey]) ? perIdData.get(row[this.idKey]) : {}));
                this.apiResponses = perRowData;
            });
        });
    }
    makeTableColumns(addHeaders) {
        return this.columns.map((col) => { var _a; return (addHeaders ? [(_a = col.name) !== null && _a !== void 0 ? _a : ""] : []); });
    }
    apiResponseToTable() {
        const columnMajorTable = this.makeTableColumns(!this.hasData);
        if (!this.apiDataIsLoaded) {
            // No data yet, just return the headers
            return columnMajorTable;
        }
        // Fill in column values from the API response
        this.apiResponses.forEach((response) => {
            this.columns.forEach((col, mappingIdx) => {
                var _a;
                if (!isDefined(col.name))
                    return;
                // Append the new value to the correct column
                columnMajorTable[mappingIdx].push(`${(_a = response[col.name]) !== null && _a !== void 0 ? _a : ""}`);
            });
        });
        return columnMajorTable;
    }
    async forceLoadMetadata() {
        return Promise.resolve();
    }
    async forceLoadTableData() {
        return this.loadDataFromApis()
            .then(() => {
            runInAction(() => {
                const newTableData = this.apiResponseToTable();
                this.shouldAppendNewData
                    ? this.append(newTableData)
                    : (this.dataColumnMajor = newTableData);
                this.hasData = true;
            });
        })
            .then(() => undefined);
    }
    refreshData() {
        this.loadDataFromApis().then(() => {
            runInAction(() => {
                const newTableData = this.apiResponseToTable();
                this.shouldAppendNewData
                    ? this.append(newTableData)
                    : (this.dataColumnMajor = newTableData);
            });
        });
    }
    addQueryParams(api) {
        const uri = new URI(api.url);
        const substituteDateTimesInQueryParam = (param) => {
            if (param.startsWith("DATE!")) {
                const dateFormatString = param.slice(param.indexOf("!") + 1);
                const now = new Date();
                return dateFormat(now, dateFormatString);
            }
            return param;
        };
        // Add common query parameters
        let useUpdateParams = this.hasData && this.updateQueryParameters.length > 0;
        const commonQueryParameters = useUpdateParams
            ? this.updateQueryParameters
            : this.queryParameters;
        commonQueryParameters.forEach((query) => {
            uri.addQuery(query.name, substituteDateTimesInQueryParam(query.value));
        });
        // Add API-specific query parameters
        useUpdateParams = this.hasData && api.updateQueryParameters.length > 0;
        const specificQueryParameters = useUpdateParams
            ? api.updateQueryParameters
            : api.queryParameters;
        specificQueryParameters.forEach((query) => {
            uri.addQuery(query.name, substituteDateTimesInQueryParam(query.value));
        });
        return uri.toString();
    }
}
ApiTableCatalogItem.type = "api-table";
__decorate([
    observable
], ApiTableCatalogItem.prototype, "apiResponses", void 0);
__decorate([
    observable
], ApiTableCatalogItem.prototype, "hasData", void 0);
__decorate([
    computed
], ApiTableCatalogItem.prototype, "apiDataIsLoaded", null);
/**
 * Return the value at json path of the data object.
 *
 * This works exactly like the lodash.get() function but adds support for
 * traversing array objects.  For eg, the lodash.get() does not support a path
 * like: `a.users[].name`, but this function will correctly return a `{name}[]`
 * array if they exist. The particular syntax for array traversal
 * is borrowed from `jq` CLI tool.
 */
function getResponseDataPath(data, jsonPath) {
    // Split the path at `[].` or `[]`
    const pathSegments = jsonPath.split(/\[\]\.?/);
    const getPath = (data, path) => path === ""
        ? data
        : Array.isArray(data)
            ? _map(data, path)
            : _get(data, path);
    return pathSegments.reduce((nextData, segment) => getPath(nextData, segment), data);
}
StratumOrder.addLoadStratum(TableAutomaticStylesStratum.stratumName);
//# sourceMappingURL=ApiTableCatalogItem.js.map
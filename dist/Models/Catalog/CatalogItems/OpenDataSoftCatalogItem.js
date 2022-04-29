var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ApiClient, fromCatalog } from "@opendatasoft/api-client";
import i18next from "i18next";
import { computed, runInAction } from "mobx";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import TimeInterval from "terriajs-cesium/Source/Core/TimeInterval";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import flatten from "../../../Core/flatten";
import isDefined from "../../../Core/isDefined";
import { isJsonObject } from "../../../Core/Json";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import FeatureInfoMixin from "../../../ModelMixins/FeatureInfoMixin";
import TableMixin from "../../../ModelMixins/TableMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import TableAutomaticStylesStratum from "../../../Table/TableAutomaticStylesStratum";
import { MetadataUrlTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import DimensionTraits from "../../../Traits/TraitsClasses/DimensionTraits";
import { FeatureInfoTemplateTraits } from "../../../Traits/TraitsClasses/FeatureInfoTraits";
import OpenDataSoftCatalogItemTraits from "../../../Traits/TraitsClasses/OpenDataSoftCatalogItemTraits";
import TableColumnTraits from "../../../Traits/TraitsClasses/TableColumnTraits";
import TableStyleTraits from "../../../Traits/TraitsClasses/TableStyleTraits";
import TableTimeStyleTraits from "../../../Traits/TraitsClasses/TableTimeStyleTraits";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import Feature from "../../Feature";
import LoadableStratum from "../../Definition/LoadableStratum";
import { isValidDataset } from "../CatalogGroups/OpenDataSoftCatalogGroup";
import StratumOrder from "../../Definition/StratumOrder";
// Column name to use for OpenDataSoft Record IDs
const RECORD_ID_COL = "record_id";
export class OpenDataSoftDatasetStratum extends LoadableStratum(OpenDataSoftCatalogItemTraits) {
    constructor(catalogItem, dataset, pointTimeSeries) {
        super();
        this.catalogItem = catalogItem;
        this.dataset = dataset;
        this.pointTimeSeries = pointTimeSeries;
    }
    static async load(catalogItem) {
        var _a, _b;
        if (!catalogItem.url)
            throw "`url` must be set";
        if (!catalogItem.datasetId)
            throw "`datasetId` must be set";
        const client = new ApiClient({
            domain: catalogItem.url
        });
        const response = await client.get(fromCatalog()
            .dataset(catalogItem.datasetId)
            .itself());
        const dataset = response.dataset;
        if (!isValidDataset(dataset))
            throw `Could not find dataset \`${catalogItem.datasetId}\``;
        // Try to retrieve information about geo-referenced (point or polygon/region) time-series
        let pointTimeSeries;
        const timeField = (_a = catalogItem.timeFieldName) !== null && _a !== void 0 ? _a : getTimeField(dataset);
        const geoPointField = (_b = catalogItem.geoPoint2dFieldName) !== null && _b !== void 0 ? _b : getGeoPointField(dataset);
        if (timeField && geoPointField) {
            // Get aggregation of time values for each feature (point/polygon)
            const counts = (await client.get(fromCatalog()
                .dataset(catalogItem.datasetId)
                .records()
                .select(`min(${timeField}) as min_time, max(${timeField}) as max_time, count(${timeField}) as num`)
                .groupBy(geoPointField)
                .limit(100))).records;
            if (counts) {
                pointTimeSeries = counts === null || counts === void 0 ? void 0 : counts.reduce((agg, current) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    const samples = (_b = (_a = current === null || current === void 0 ? void 0 : current.record) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.num;
                    const minTime = ((_d = (_c = current === null || current === void 0 ? void 0 : current.record) === null || _c === void 0 ? void 0 : _c.fields) === null || _d === void 0 ? void 0 : _d.min_time) ? new Date((_f = (_e = current === null || current === void 0 ? void 0 : current.record) === null || _e === void 0 ? void 0 : _e.fields) === null || _f === void 0 ? void 0 : _f.min_time)
                        : undefined;
                    const maxTime = ((_h = (_g = current === null || current === void 0 ? void 0 : current.record) === null || _g === void 0 ? void 0 : _g.fields) === null || _h === void 0 ? void 0 : _h.max_time) ? new Date((_k = (_j = current === null || current === void 0 ? void 0 : current.record) === null || _j === void 0 ? void 0 : _j.fields) === null || _k === void 0 ? void 0 : _k.max_time)
                        : undefined;
                    let intervalSec;
                    if (minTime && maxTime && samples) {
                        intervalSec =
                            (maxTime.getTime() - minTime.getTime()) / (samples * 1000);
                    }
                    agg.push({
                        samples,
                        minTime,
                        maxTime,
                        intervalSec
                    });
                    return agg;
                }, []);
            }
        }
        return new OpenDataSoftDatasetStratum(catalogItem, dataset, pointTimeSeries);
    }
    duplicateLoadableStratum(model) {
        return new OpenDataSoftDatasetStratum(model, this.dataset, this.pointTimeSeries);
    }
    get name() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.dataset.metas) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : this.dataset.dataset_id;
    }
    get description() {
        var _a, _b;
        return (_b = (_a = this.dataset.metas) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.description;
    }
    get metadataUrls() {
        return [
            createStratumInstance(MetadataUrlTraits, {
                title: i18next.t("models.openDataSoft.viewDatasetPage"),
                url: `${this.catalogItem.url}/explore/dataset/${this.dataset.dataset_id}/information/`
            })
        ];
    }
    /** Find field to visualise by default (i.e. colorColumn)
     *  It will find the field in this order:
     * - First of type "double"
     * - First of type "int"
     * - First of type "text"
     */
    get colorFieldName() {
        var _a, _b, _c;
        return (_c = ((_b = (_a = this.usefulFields.find(f => f.type === "double")) !== null && _a !== void 0 ? _a : this.usefulFields.find(f => f.type === "int")) !== null && _b !== void 0 ? _b : this.usefulFields.find(f => f.type === "text"))) === null || _c === void 0 ? void 0 : _c.name;
    }
    get geoPoint2dFieldName() {
        return getGeoPointField(this.dataset);
    }
    get timeFieldName() {
        return getTimeField(this.dataset);
    }
    get regionFieldName() {
        var _a, _b;
        // Find first field which matches a region type
        return (_b = (_a = this.dataset.fields) === null || _a === void 0 ? void 0 : _a.find(f => this.catalogItem.matchRegionType(f.name) ||
            this.catalogItem.matchRegionType(f.label))) === null || _b === void 0 ? void 0 : _b.name;
    }
    get recordsCount() {
        var _a, _b;
        return (_b = (_a = this.dataset.metas) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.records_count;
    }
    /** Number of features in timeseries */
    get pointsCount() {
        var _a;
        return (_a = this.pointTimeSeries) === null || _a === void 0 ? void 0 : _a.length;
    }
    /** Get the maximum number of samples for a given point (or sensor) */
    get maxPointSamples() {
        if (!this.pointTimeSeries)
            return;
        return Math.max(...this.pointTimeSeries.map(p => { var _a; return (_a = p.samples) !== null && _a !== void 0 ? _a : 0; }));
    }
    /** Should we select all fields (properties) in each record?
     * - Less than 10 fields
     * - Less than 10000 records
     * - There is no colorFieldName (no suitable default field - eg number - to visualise)
     * - There is no geoPoint and no time field
     *
     */
    get selectAllFields() {
        var _a, _b;
        return (((_b = (_a = this.dataset.fields) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) <= 10 ||
            (isDefined(this.recordsCount) && this.recordsCount < 10000) ||
            !this.catalogItem.colorFieldName ||
            !(this.catalogItem.geoPoint2dFieldName || this.catalogItem.timeFieldName));
    }
    get selectFields() {
        var _a, _b;
        if (this.selectAllFields) {
            // Filter out fields with GeoJSON and fields which could be lat/lon as all point information is provided with field types "geo_point" (See `getGeoPointField()`)
            return filterOutUndefined((_b = (_a = this.dataset.fields) === null || _a === void 0 ? void 0 : _a.filter(f => {
                var _a, _b;
                return f.type !== "geo_shape" &&
                    !["lat", "lon", "long", "latitude", "longitude"].includes((_b = (_a = f.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "");
            }).map(f => f.name)) !== null && _b !== void 0 ? _b : []).join(", ");
        }
        return filterOutUndefined([
            this.catalogItem.timeFieldName,
            // If aggregating time - avergage color field
            this.aggregateTime
                ? `avg(${this.catalogItem.colorFieldName}) as ${this.catalogItem.colorFieldName}`
                : this.catalogItem.colorFieldName,
            // Otherwise use region field or geopoint field (in that order)
            this.catalogItem.geoPoint2dFieldName,
            this.catalogItem.regionFieldName
        ]).join(", ");
    }
    get groupByFields() {
        // If aggregating time - use RANGE group by clause to average values over a date range (eg `aggregateTime = "1 day"`)
        // See https://help.opendatasoft.com/apis/ods-search-v2/#group-by-clause
        if (this.aggregateTime && this.timeFieldName && this.geoPoint2dFieldName) {
            return `${this.geoPoint2dFieldName},RANGE(${this.timeFieldName}, ${this.aggregateTime}) as ${this.timeFieldName}`;
        }
    }
    // Hide geopoint column
    get geoPoint2dColumn() {
        if (this.catalogItem.geoPoint2dFieldName) {
            return createStratumInstance(TableColumnTraits, {
                name: this.catalogItem.geoPoint2dFieldName,
                type: "hidden"
            });
        }
    }
    // Set reigon column type
    get regionColumn() {
        if (this.catalogItem.regionFieldName) {
            return createStratumInstance(TableColumnTraits, {
                name: this.catalogItem.regionFieldName,
                type: "region"
            });
        }
    }
    // Set colour column type and title
    get colorColumn() {
        var _a;
        if (!this.catalogItem.colorFieldName)
            return;
        const f = (_a = this.dataset.fields) === null || _a === void 0 ? void 0 : _a.find(f => f.name === this.catalogItem.colorFieldName);
        if (f) {
            return createStratumInstance(TableColumnTraits, {
                name: f.name,
                title: f.label,
                type: f.type === "double" || f.type === "int" ? "scalar" : undefined
            });
        }
    }
    // Set time column type and title
    get timeColumn() {
        var _a;
        if (!this.catalogItem.timeFieldName)
            return;
        const f = (_a = this.dataset.fields) === null || _a === void 0 ? void 0 : _a.find(f => f.name === this.catalogItem.timeFieldName);
        if (f) {
            return createStratumInstance(TableColumnTraits, {
                name: f.name,
                title: f.label,
                type: "time"
            });
        }
    }
    // Set all other column types and title
    get otherColumns() {
        var _a, _b, _c;
        return ((_c = (_b = (_a = this.dataset.fields) === null || _a === void 0 ? void 0 : _a.filter(f => f.name !== this.catalogItem.timeFieldName &&
            f.name !== this.catalogItem.colorFieldName &&
            f.name !== this.catalogItem.regionFieldName)) === null || _b === void 0 ? void 0 : _b.map(f => createStratumInstance(TableColumnTraits, {
            name: f.name,
            title: f.label,
            type: isIdField(f.name) ? "hidden" : undefined
        }))) !== null && _c !== void 0 ? _c : []);
    }
    get columns() {
        return filterOutUndefined([
            this.timeColumn,
            this.colorColumn,
            this.regionColumn,
            this.geoPoint2dColumn,
            ...(!this.selectAllFields ? [] : this.otherColumns)
        ]);
    }
    /** Set default style traits for points (lat/lon) and time */
    get defaultStyle() {
        var _a;
        return createStratumInstance(TableStyleTraits, {
            regionColumn: this.regionFieldName,
            latitudeColumn: this.catalogItem.geoPoint2dFieldName &&
                !this.catalogItem.regionFieldName
                ? "lat"
                : undefined,
            longitudeColumn: this.catalogItem.geoPoint2dFieldName &&
                !this.catalogItem.regionFieldName
                ? "lon"
                : undefined,
            time: createStratumInstance(TableTimeStyleTraits, {
                // If we are viewing a timeseries with only 1 sample per point - spreadStart/EndTime
                spreadStartTime: isDefined(this.maxPointSamples) && this.maxPointSamples === 1,
                spreadFinishTime: isDefined(this.maxPointSamples) && this.maxPointSamples === 1,
                timeColumn: (_a = this.timeColumn) === null || _a === void 0 ? void 0 : _a.name,
                idColumns: this.catalogItem.geoPoint2dFieldName
                    ? ["lat", "lon"]
                    : undefined
            })
        });
    }
    /** If `selectAllFields` is false, we have to fetch record information with the Record API */
    get featureInfoUrlTemplate() {
        if (!this.catalogItem.datasetId ||
            !this.catalogItem.url ||
            this.selectAllFields)
            return;
        return `${this.catalogItem.url}/api/v2/catalog/datasets/${this.catalogItem.datasetId}/records/{${RECORD_ID_COL}}`;
    }
    get featureInfoTemplate() {
        var _a, _b, _c;
        if (!this.catalogItem.datasetId ||
            !this.catalogItem.url ||
            this.selectAllFields)
            return;
        let template = '<table class="cesium-infoBox-defaultTable">';
        // Function to format row with title and value
        const row = (title, value) => `<tr><td style="vertical-align: middle">${title}</td><td>${value}</td></tr>`;
        // Add fields (exepct for geo_* fields)
        template += (_b = (_a = this.dataset.fields) === null || _a === void 0 ? void 0 : _a.filter(field => field.type !== "geo_point_2d" && field.type !== "geo_shape")) === null || _b === void 0 ? void 0 : _b.map(field => { var _a, _b; return row((_b = (_a = field.label) !== null && _a !== void 0 ? _a : field.name) !== null && _b !== void 0 ? _b : "", `{{record.fields.${field.name}}}`); }).join("");
        // Add region mapping info
        const regionType = (_c = this.catalogItem.activeTableStyle.regionColumn) === null || _c === void 0 ? void 0 : _c.regionType;
        if (regionType)
            template += row(regionType === null || regionType === void 0 ? void 0 : regionType.description, `{{${regionType === null || regionType === void 0 ? void 0 : regionType.nameProp}}}`);
        // Add timeSeries chart if more than one time observation
        if (this.catalogItem.discreteTimes &&
            this.catalogItem.discreteTimes.length > 1) {
            const chartName = `${this.catalogItem.name}: {{${this.catalogItem.activeTableStyle.title}}}`;
            template += `</table><chart title="${chartName}" x-column="{{terria.timeSeries.xName}}" y-column="{{terria.timeSeries.yName}}" >{{terria.timeSeries.data}}</chart>`;
        }
        return createStratumInstance(FeatureInfoTemplateTraits, { template });
    }
    /** Try to find a sensible currentTime based on the latest timeInterval which has values for all points
     * This is biased for real-time sensor data - where we would usually want to see the latest values.
     * As we are fetching the last 1000 records, there may be time intervals which are incomplete. Ideally we want to see all sensors with some data by default.
     */
    get currentTime() {
        var _a, _b;
        if (!this.pointTimeSeries && this.catalogItem.geoPoint2dFieldName)
            return;
        const lastDate = (_b = (_a = this.catalogItem.activeTableStyle) === null || _a === void 0 ? void 0 : _a.timeColumn) === null || _b === void 0 ? void 0 : _b.valuesAsJulianDates.maximum;
        if (!this.catalogItem.activeTableStyle.timeIntervals ||
            !this.catalogItem.activeTableStyle.rowGroups ||
            !lastDate)
            return;
        // Group all time intervals for each row group (each Point feature)
        // This calculates the start/stop dates for each row group
        const groupIntervals = this.catalogItem.activeTableStyle.rowGroups.map(([id, rows]) => {
            let start;
            let stop;
            rows.forEach(rowId => {
                var _a;
                const interval = (_a = this.catalogItem.activeTableStyle.timeIntervals[rowId]) !== null && _a !== void 0 ? _a : undefined;
                if (interval === null || interval === void 0 ? void 0 : interval.start) {
                    start =
                        !start || JulianDate.lessThan(interval.start, start)
                            ? interval.start
                            : start;
                }
                if (interval === null || interval === void 0 ? void 0 : interval.stop) {
                    stop =
                        !stop || JulianDate.lessThan(stop, interval.stop)
                            ? interval.stop
                            : stop;
                }
            });
            return new TimeInterval({ start, stop });
        });
        // Find intersection of groupIntervals - this will roughly estimate the time interval which is the "most complete" - that is to say, the time interval which has the most groups (or points) with data
        if (groupIntervals.length > 0) {
            const totalInterval = groupIntervals.reduce((intersection, current) => intersection
                ? TimeInterval.intersect(intersection, current)
                : current, undefined);
            // If intersection is found - use last date
            if (totalInterval &&
                !totalInterval.isEmpty &&
                !JulianDate.lessThan(lastDate, totalInterval.stop)) {
                return totalInterval.stop.toString();
            }
        }
        // If no intersection is found - use last date for entire dataset
        return lastDate.toString();
    }
    /** Get fields with useful infomation (for visualisation). Eg numbers, text, not IDs, not region... */
    get usefulFields() {
        var _a, _b;
        return ((_b = (_a = this.dataset.fields) === null || _a === void 0 ? void 0 : _a.filter(f => {
            var _a, _b, _c;
            return ["double", "int", "text"].includes((_a = f.type) !== null && _a !== void 0 ? _a : "") &&
                !["lat", "lon", "long", "latitude", "longitude"].includes((_c = (_b = f.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()) !== null && _c !== void 0 ? _c : "") &&
                !isIdField(f.name) &&
                !isIdField(f.label) &&
                f.name !== this.catalogItem.regionFieldName &&
                !this.catalogItem.matchRegionType(f.name) &&
                !this.catalogItem.matchRegionType(f.label);
        })) !== null && _b !== void 0 ? _b : []);
    }
    /** Convert usefulFields to a Dimenion (which gets turned into a SelectableDimension in OpenDataSoftCatalogItem).
     * This means we can chose which field to "select" when downloading data.
     */
    get availableFields() {
        if (!this.selectAllFields)
            return createStratumInstance(DimensionTraits, {
                id: "available-fieds",
                name: "Fields",
                selectedId: this.catalogItem.colorFieldName,
                options: this.usefulFields.map(f => ({
                    id: f.name,
                    name: f.label,
                    value: undefined
                }))
            });
    }
    get activeStyle() {
        return this.catalogItem.colorFieldName;
    }
}
OpenDataSoftDatasetStratum.stratumName = "openDataSoftDataset";
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "name", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "description", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "metadataUrls", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "colorFieldName", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "geoPoint2dFieldName", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "timeFieldName", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "regionFieldName", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "recordsCount", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "pointsCount", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "maxPointSamples", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "selectAllFields", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "selectFields", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "groupByFields", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "geoPoint2dColumn", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "regionColumn", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "colorColumn", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "timeColumn", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "otherColumns", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "columns", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "defaultStyle", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "featureInfoUrlTemplate", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "featureInfoTemplate", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "currentTime", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "usefulFields", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "availableFields", null);
__decorate([
    computed
], OpenDataSoftDatasetStratum.prototype, "activeStyle", null);
/** Column is hidden if the name starts or ends with `id` */
function isIdField(...names) {
    return names
        .filter(isDefined)
        .reduce((hide, name) => hide ||
        name.toLowerCase().startsWith("id") ||
        name.toLowerCase().endsWith("id"), false);
}
function getGeoPointField(dataset) {
    var _a, _b;
    return (_b = (_a = dataset.fields) === null || _a === void 0 ? void 0 : _a.find(f => f.type === "geo_point_2d")) === null || _b === void 0 ? void 0 : _b.name;
}
function getTimeField(dataset) {
    var _a, _b;
    return (_b = (_a = dataset.fields) === null || _a === void 0 ? void 0 : _a.find(f => f.type === "datetime")) === null || _b === void 0 ? void 0 : _b.name;
}
StratumOrder.addLoadStratum(OpenDataSoftDatasetStratum.stratumName);
export default class OpenDataSoftCatalogItem extends FeatureInfoMixin(TableMixin(UrlMixin(CatalogMemberMixin(CreateModel(OpenDataSoftCatalogItemTraits))))) {
    constructor(id, terria, sourceReference) {
        super(id, terria, sourceReference);
        this.strata.set(TableAutomaticStylesStratum.stratumName, new TableAutomaticStylesStratum(this));
    }
    get type() {
        return OpenDataSoftCatalogItem.type;
    }
    buildFeatureFromPickResult(_screenPosition, pickResult) {
        var _a, _b, _c, _d, _e;
        const feature = new Feature(pickResult === null || pickResult === void 0 ? void 0 : pickResult.id);
        // If feature is time-series, we have to make sure that recordId is set in feature.proprties
        // Otherwise we won't be able to use featureInfoUrlTemplate in FeatureInfoMixin
        const recordId = (_d = (_c = (_b = (_a = pickResult === null || pickResult === void 0 ? void 0 : pickResult.id) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.getValue) === null || _c === void 0 ? void 0 : _c.call(_b, this.terria.timelineClock.currentTime)) === null || _d === void 0 ? void 0 : _d[RECORD_ID_COL];
        (_e = feature.properties) === null || _e === void 0 ? void 0 : _e.addProperty(RECORD_ID_COL, recordId);
        return feature;
    }
    async forceLoadMetadata() {
        if (!this.strata.has(OpenDataSoftDatasetStratum.stratumName)) {
            const stratum = await OpenDataSoftDatasetStratum.load(this);
            runInAction(() => {
                this.strata.set(OpenDataSoftDatasetStratum.stratumName, stratum);
            });
        }
    }
    get apiClient() {
        return new ApiClient({
            domain: this.url
        });
    }
    async forceLoadTableData() {
        var _a;
        if (!this.datasetId || !this.url)
            return [];
        let data = [];
        let q = fromCatalog()
            .dataset(this.datasetId)
            .records()
            .limit(100);
        // If fetching time - order records by latest time
        if (this.timeFieldName)
            q = q.orderBy(`${this.timeFieldName} DESC`);
        if (this.selectFields) {
            q = q.select(this.selectFields);
        }
        if (this.groupByFields) {
            q = q.groupBy(this.groupByFields);
        }
        const stratum = this.strata.get(OpenDataSoftDatasetStratum.stratumName);
        // Fetch maximum of 1000 records
        const recordsToFetch = Math.min(1000, (_a = stratum === null || stratum === void 0 ? void 0 : stratum.recordsCount) !== null && _a !== void 0 ? _a : 1000);
        // Get 1000 records (in chunks of 100)
        const records = flatten(await Promise.all(new Array(Math.ceil(recordsToFetch / 100))
            .fill(0)
            .map(async (v, index) => { var _a; return (_a = (await this.apiClient.get(q.offset(index * 100))).records) !== null && _a !== void 0 ? _a : []; })));
        if (records && records.length > 0) {
            // Set up columns object
            const cols = {};
            cols[RECORD_ID_COL] = new Array(records.length).fill("");
            if (this.geoPoint2dFieldName) {
                cols["lat"] = new Array(records.length).fill("");
                cols["lon"] = new Array(records.length).fill("");
            }
            if (this.timeFieldName) {
                cols[this.timeFieldName] = new Array(records.length).fill("");
            }
            records.forEach((record, index) => {
                var _a, _b, _c, _d;
                if (!((_a = record.record) === null || _a === void 0 ? void 0 : _a.id))
                    return;
                // Manually add Record ID
                cols[RECORD_ID_COL][index] = (_b = record.record) === null || _b === void 0 ? void 0 : _b.id;
                // Go through each field and set column value
                Object.entries((_d = (_c = record.record) === null || _c === void 0 ? void 0 : _c.fields) !== null && _d !== void 0 ? _d : {}).forEach(([field, value]) => {
                    var _a, _b;
                    // geoPoint2dFieldName will return a JSON object - spilt lat/lon columns
                    if (field === this.geoPoint2dFieldName && isJsonObject(value)) {
                        cols.lat[index] = (_a = `${value.lat}`) !== null && _a !== void 0 ? _a : "";
                        cols.lon[index] = (_b = `${value.lon}`) !== null && _b !== void 0 ? _b : "";
                    }
                    else {
                        // Copy current field into columns object
                        if (!Array.isArray(cols[field])) {
                            cols[field] = new Array(records.length).fill("");
                        }
                        cols[field][index] = `${value}`;
                    }
                });
            });
            // Munge into dataColumnMajor format
            data = Object.entries(cols).map(([field, values]) => [field, ...values]);
        }
        return data;
    }
    // Convert availableFields DimensionTraits to SelectableDimension
    get availableFieldsDimension() {
        var _a, _b, _c;
        if ((_c = (_b = (_a = this.availableFields) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0 > 0) {
            return {
                id: this.availableFields.id,
                name: this.availableFields.name,
                selectedId: this.availableFields.selectedId,
                options: this.availableFields.options,
                setDimensionValue: async (strataId, selectedId) => {
                    this.setTrait(strataId, "colorFieldName", selectedId);
                    (await this.loadMapItems()).throwIfError();
                }
            };
        }
    }
    get selectableDimensions() {
        return filterOutUndefined([
            this.availableFieldsDimension,
            ...super.selectableDimensions.filter(s => !this.availableFieldsDimension || s.id !== "activeStyle")
        ]);
    }
}
OpenDataSoftCatalogItem.type = "opendatasoft-item";
__decorate([
    computed
], OpenDataSoftCatalogItem.prototype, "apiClient", null);
__decorate([
    computed
], OpenDataSoftCatalogItem.prototype, "availableFieldsDimension", null);
__decorate([
    computed
], OpenDataSoftCatalogItem.prototype, "selectableDimensions", null);
StratumOrder.addLoadStratum(TableAutomaticStylesStratum.stratumName);
//# sourceMappingURL=OpenDataSoftCatalogItem.js.map
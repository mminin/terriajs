var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import groupBy from "lodash-es/groupBy";
import { computed } from "mobx";
import binarySearch from "terriajs-cesium/Source/Core/binarySearch";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import TimeInterval from "terriajs-cesium/Source/Core/TimeInterval";
import filterOutUndefined from "../Core/filterOutUndefined";
import isDefined from "../Core/isDefined";
import ConstantColorMap from "../Map/ConstantColorMap";
import ConstantPointSizeMap from "../Map/ConstantPointSizeMap";
import DiscreteColorMap from "../Map/DiscreteColorMap";
import EnumColorMap from "../Map/EnumColorMap";
import ScalePointSizeMap from "../Map/ScalePointSizeMap";
import createCombinedModel from "../Models/Definition/createCombinedModel";
import TableColorMap from "./TableColorMap";
import TableColumnType from "./TableColumnType";
const DEFAULT_FINAL_DURATION_SECONDS = 3600 * 24 - 1; // one day less a second, if there is only one date.
/**
 * A style controlling how tabular data is displayed.
 */
export default class TableStyle {
    /**
     *
     * @param tableModel TableMixin catalog memeber
     * @param styleNumber Index of column in tablemodel (if undefined, then default style will be used)
     */
    constructor(tableModel, styleNumber) {
        this.tableModel = tableModel;
        this.styleNumber = styleNumber;
    }
    /** Is style ready to be used.
     * This will be false if any of dependent columns are not ready
     */
    get ready() {
        var _a;
        return filterOutUndefined([
            this.longitudeColumn,
            this.latitudeColumn,
            this.regionColumn,
            this.timeColumn,
            this.endTimeColumn,
            this.xAxisColumn,
            this.colorColumn,
            this.pointSizeColumn,
            ...((_a = this.idColumns) !== null && _a !== void 0 ? _a : [])
        ]).every(col => col.ready);
    }
    /**
     * Gets the ID of the style.
     */
    get id() {
        return this.styleTraits.id || "Style" + this.styleNumber;
    }
    get title() {
        var _a, _b, _c;
        return ((_c = (_a = this.styleTraits.title) !== null && _a !== void 0 ? _a : (_b = this.tableModel.tableColumns.find(col => col.name === this.id)) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : this.id);
    }
    /** Hide style from "Display Variable" selector if number of colors (EnumColorMap or DiscreteColorMap) is less than 2. As a ColorMap with a single color isn't super useful. */
    get hidden() {
        if (isDefined(this.styleTraits.hidden))
            return this.styleTraits.hidden;
        if (this.colorMap instanceof ConstantColorMap)
            return true;
        if ((this.colorMap instanceof EnumColorMap ||
            this.colorMap instanceof DiscreteColorMap) &&
            this.colorMap.colors.length < 2)
            return true;
    }
    /**
     * Gets the {@link TableStyleTraits} for this style. The traits are derived
     * from the default styles plus this style layered on top of the default.
     */
    get styleTraits() {
        if (isDefined(this.styleNumber) &&
            this.styleNumber < this.tableModel.styles.length) {
            const result = createCombinedModel(this.tableModel.styles[this.styleNumber], this.tableModel.defaultStyle);
            return result;
        }
        else {
            return this.tableModel.defaultStyle;
        }
    }
    /**
     * Gets the {@link TableColorStyleTraits} from the {@link #styleTraits}.
     * Returns a default instance of no color traits are specified explicitly.
     */
    get colorTraits() {
        return this.styleTraits.color;
    }
    /**
     * Gets the {@link TableScaleStyleTraits} from the {@link #styleTraits}.
     * Returns a default instance of no scale traits are specified explicitly.
     */
    get pointSizeTraits() {
        return this.styleTraits.pointSize;
    }
    /**
     * Gets the {@link TableChartStyleTraits} from the {@link #styleTraits}.
     * Returns a default instance of no chart traits are specified explicitly.
     */
    get chartTraits() {
        return this.styleTraits.chart;
    }
    /**
     * Gets the {@link TableTimeStyleTraits} from the {@link #styleTraits}.
     * Returns a default instance if no time traits are specified explicitly.
     */
    get timeTraits() {
        return this.styleTraits.time;
    }
    /**
     * Gets the longitude column for this style, if any.
     */
    get longitudeColumn() {
        return this.resolveColumn(this.styleTraits.longitudeColumn);
    }
    /**
     * Gets the latitude column for this style, if any.
     */
    get latitudeColumn() {
        return this.resolveColumn(this.styleTraits.latitudeColumn);
    }
    /**
     * Gets the region column for this style, if any.
     */
    get regionColumn() {
        if (this.styleTraits.regionColumn === null)
            return;
        return this.resolveColumn(this.styleTraits.regionColumn);
    }
    /**
     * Gets the columns that together constitute the id, eg: ["lat", "lon"] for
     * fixed features or ["id"].
     */
    get idColumns() {
        const idColumns = filterOutUndefined(this.timeTraits.idColumns
            ? this.timeTraits.idColumns.map(name => this.resolveColumn(name))
            : []);
        return idColumns.length > 0 ? idColumns : undefined;
    }
    /**
     * Gets the time column for this style, if any.
     */
    get timeColumn() {
        return this.timeTraits.timeColumn === null
            ? undefined
            : this.resolveColumn(this.timeTraits.timeColumn);
    }
    /**
     * Gets the end time column for this style, if any.
     */
    get endTimeColumn() {
        return this.resolveColumn(this.timeTraits.endTimeColumn);
    }
    /**
     * Gets the chart X-axis column for this style, if any.
     */
    get xAxisColumn() {
        return this.resolveColumn(this.chartTraits.xAxisColumn);
    }
    /**
     * Gets the color column for this style, if any.
     */
    get colorColumn() {
        return this.resolveColumn(this.colorTraits.colorColumn);
    }
    /**
     * Gets the scale column for this style, if any.
     */
    get pointSizeColumn() {
        return this.resolveColumn(this.pointSizeTraits.pointSizeColumn);
    }
    /**
     * Determines if this style is visualized as points on a map.
     */
    isPoints() {
        return (this.longitudeColumn !== undefined && this.latitudeColumn !== undefined);
    }
    /**
     * Determines if this style is visualized as time varying points tracked by id
     */
    isTimeVaryingPointsWithId() {
        return (this.longitudeColumn !== undefined &&
            this.latitudeColumn !== undefined &&
            this.idColumns !== undefined &&
            this.timeColumn !== undefined &&
            this.timeIntervals !== undefined &&
            this.moreThanOneTimeInterval);
    }
    /**
     * Determines if this style is visualized as regions on a map.
     */
    isRegions() {
        return this.regionColumn !== undefined;
    }
    /**
     * Determines if this style is visualized on a chart.
     */
    isChart() {
        return this.xAxisColumn !== undefined && this.chartTraits.lines.length > 0;
    }
    /** Style isSampled by default. TimeTraits.isSampled will be used if defined. If not, and color column is binary - isSampled will be false. */
    get isSampled() {
        if (isDefined(this.timeTraits.isSampled))
            return this.timeTraits.isSampled;
        if (isDefined(this.colorColumn) && this.colorColumn.isScalarBinary)
            return false;
        return true;
    }
    get tableColorMap() {
        var _a;
        return new TableColorMap((_a = this.tableModel.name) !== null && _a !== void 0 ? _a : this.tableModel.uniqueId, this.colorColumn, this.colorTraits);
    }
    get colorMap() {
        return this.tableColorMap.colorMap;
    }
    get pointSizeMap() {
        const pointSizeColumn = this.pointSizeColumn;
        const pointSizeTraits = this.pointSizeTraits;
        if (pointSizeColumn && pointSizeColumn.type === TableColumnType.scalar) {
            const maximum = pointSizeColumn.valuesAsNumbers.maximum;
            const minimum = pointSizeColumn.valuesAsNumbers.minimum;
            if (isDefined(maximum) && isDefined(minimum) && maximum !== minimum) {
                return new ScalePointSizeMap(minimum, maximum, pointSizeTraits.nullSize, pointSizeTraits.sizeFactor, pointSizeTraits.sizeOffset);
            }
        }
        // can't scale point size by values in this column, so use same point size for every value
        return new ConstantPointSizeMap(pointSizeTraits.sizeOffset);
    }
    /**
     * Returns a `TimeInterval` for each row in the table.
     */
    get timeIntervals() {
        var _a, _b;
        const timeColumn = this.timeColumn;
        if (timeColumn === undefined) {
            return;
        }
        const lastDate = timeColumn.valuesAsJulianDates.maximum;
        const intervals = new Array(timeColumn.valuesAsJulianDates.values.length).fill(null);
        for (let i = 0; i < timeColumn.valuesAsJulianDates.values.length; i++) {
            const date = timeColumn.valuesAsJulianDates.values[i];
            const startDate = (_a = this.startJulianDates) === null || _a === void 0 ? void 0 : _a[i];
            const finishDate = (_b = this.finishJulianDates) === null || _b === void 0 ? void 0 : _b[i];
            if (!date || !startDate || !finishDate)
                continue;
            intervals[i] = new TimeInterval({
                start: startDate,
                stop: finishDate,
                isStopIncluded: JulianDate.equals(finishDate, lastDate),
                data: date
            });
        }
        return intervals;
    }
    /** Is there more than one unique time interval */
    get moreThanOneTimeInterval() {
        var _a, _b;
        if (this.timeIntervals) {
            // Find first non-null time interval
            const firstInterval = (_a = this.timeIntervals) === null || _a === void 0 ? void 0 : _a.find(t => t);
            if (firstInterval) {
                // Does there exist an interval which is different from firstInterval (that is to say, does there exist at least two unique intervals)
                return !!((_b = this.timeIntervals) === null || _b === void 0 ? void 0 : _b.find(t => t &&
                    (!firstInterval.start.equals(t.start) ||
                        !firstInterval.stop.equals(t.stop))));
            }
        }
        return false;
    }
    /**
     * Returns a start date for each row in the table.
     * If `timeTraits.spreadStartTime` is true - the start dates will be the earliest value for all features (eg sensor IDs) - even if the time value is **after** the earliest time step. This means that at time step 0, all features will be displayed.
     */
    get startJulianDates() {
        const timeColumn = this.timeColumn;
        if (timeColumn === undefined) {
            return;
        }
        const firstDate = timeColumn.valuesAsJulianDates.minimum;
        if (!firstDate)
            return [];
        // Create a new array which will be filled by rowGroups (this will exclude dates which don't have rowGroup (eg invalid regions))
        const filteredStartDates = new Array(timeColumn.valuesAsJulianDates.values.length).fill(null);
        for (let i = 0; i < this.rowGroups.length; i++) {
            const rowIds = this.rowGroups[i][1];
            // Copy over valid rows
            for (let j = 0; j < rowIds.length; j++) {
                filteredStartDates[rowIds[j]] =
                    timeColumn.valuesAsJulianDates.values[rowIds[j]];
            }
            if (this.timeTraits.spreadStartTime) {
                // Find row ID with earliest date in this rowGroup
                const firstRowId = rowIds
                    .filter(id => filteredStartDates[id])
                    .sort((idA, idB) => JulianDate.compare(filteredStartDates[idA], filteredStartDates[idB]))[0];
                // Set it to earliest date in the entire column
                if (isDefined(firstRowId))
                    filteredStartDates[firstRowId] = firstDate;
            }
        }
        return filteredStartDates;
    }
    /**
     * Returns a finish date for each row in the table.
     */
    get finishJulianDates() {
        var _a;
        if (this.endTimeColumn) {
            return this.endTimeColumn.valuesAsJulianDates.values;
        }
        const timeColumn = this.timeColumn;
        if (timeColumn === undefined) {
            return;
        }
        const startDates = timeColumn.valuesAsJulianDates.values;
        const finishDates = new Array(startDates.length).fill(null);
        // If displayDuration trait is set, use that to set finish date
        if (this.timeTraits.displayDuration !== undefined) {
            for (let i = 0; i < startDates.length; i++) {
                const date = startDates[i];
                if (date) {
                    finishDates[i] = JulianDate.addMinutes(date, this.timeTraits.displayDuration, new JulianDate());
                }
            }
            return finishDates;
        }
        // Otherwise estimate a final duration value to calculate the end date for groups
        // that have only one row. Fallback to a global default if an estimate
        // cannot be found.
        for (let i = 0; i < this.rowGroups.length; i++) {
            const rowIds = this.rowGroups[i][1];
            const sortedStartDates = sortedUniqueDates(rowIds.map(id => timeColumn.valuesAsJulianDates.values[id]));
            const finalDuration = (_a = estimateFinalDurationSeconds(sortedStartDates)) !== null && _a !== void 0 ? _a : DEFAULT_FINAL_DURATION_SECONDS;
            const startDatesForGroup = rowIds.map(id => startDates[id]);
            const finishDatesForGroup = this.calculateFinishDatesFromStartDates(startDatesForGroup, finalDuration);
            for (let j = 0; j < finishDatesForGroup.length; j++) {
                finishDates[rowIds[j]] = finishDatesForGroup[j];
            }
        }
        return finishDates;
    }
    /** Get rows grouped by id. Id will be calculated using idColumns, latitude/longitude columns or region column
     */
    get rowGroups() {
        let groupByCols = this.idColumns;
        if (!groupByCols) {
            // If points use lat long
            if (this.latitudeColumn && this.longitudeColumn) {
                groupByCols = [this.latitudeColumn, this.longitudeColumn];
                // If region - use region col
            }
            else if (this.regionColumn)
                groupByCols = [this.regionColumn];
        }
        if (!groupByCols)
            groupByCols = [];
        const tableRowIds = this.tableModel.rowIds;
        return (Object.entries(groupBy(tableRowIds, rowId => groupByCols
            .map(col => {
            // If using region column as ID - only use valid regions
            if (col.type === TableColumnType.region) {
                return col.valuesAsRegions.regionIds[rowId];
            }
            return col.values[rowId];
        })
            .join("-")))
            // Filter out bad IDs
            .filter(value => value[0] !== ""));
    }
    /**
     * Computes an and end date for each given start date. The end date for a
     * given start date is the next higher date in the input. To compute the end
     * date for the last date in the input, we estimate a duration based on the
     * average interval between dates in the input. If the input has only one
     * date, then an estimate cannot be made, in that case we use the
     * `defaultFinalDurationSeconds` to compute the end date.
     */
    calculateFinishDatesFromStartDates(startDates, defaultFinalDurationSeconds) {
        var _a;
        const sortedStartDates = sortedUniqueDates(startDates);
        // Calculate last date based on if spreadFinishTime is true:
        // - If true, use the maximum date in the entire timeColumn
        // - If false, use the last date in startDates - which is the last date in the current row group
        const lastDate = this.timeTraits.spreadFinishTime && ((_a = this.timeColumn) === null || _a === void 0 ? void 0 : _a.valuesAsJulianDates.maximum)
            ? this.timeColumn.valuesAsJulianDates.maximum
            : sortedStartDates[sortedStartDates.length - 1];
        const finishDates = new Array(startDates.length).fill(null);
        for (let i = 0; i < startDates.length; i++) {
            const date = startDates[i];
            if (!date) {
                continue;
            }
            const nextDateIndex = binarySearch(sortedStartDates, date, (d1, d2) => JulianDate.compare(d1, d2));
            const nextDate = sortedStartDates[nextDateIndex + 1];
            if (nextDate) {
                finishDates[i] = nextDate;
            }
            else {
                // This is the last date in the row, so calculate a final date
                const finalDurationSeconds = estimateFinalDurationSeconds(sortedStartDates) ||
                    defaultFinalDurationSeconds;
                finishDates[i] = addSecondsToDate(lastDate, finalDurationSeconds);
            }
        }
        return finishDates;
    }
    resolveColumn(name) {
        if (name === undefined) {
            return undefined;
        }
        return this.tableModel.tableColumns.find(column => column.name === name);
    }
}
__decorate([
    computed
], TableStyle.prototype, "ready", null);
__decorate([
    computed
], TableStyle.prototype, "id", null);
__decorate([
    computed
], TableStyle.prototype, "title", null);
__decorate([
    computed
], TableStyle.prototype, "hidden", null);
__decorate([
    computed
], TableStyle.prototype, "styleTraits", null);
__decorate([
    computed
], TableStyle.prototype, "colorTraits", null);
__decorate([
    computed
], TableStyle.prototype, "pointSizeTraits", null);
__decorate([
    computed
], TableStyle.prototype, "chartTraits", null);
__decorate([
    computed
], TableStyle.prototype, "timeTraits", null);
__decorate([
    computed
], TableStyle.prototype, "longitudeColumn", null);
__decorate([
    computed
], TableStyle.prototype, "latitudeColumn", null);
__decorate([
    computed
], TableStyle.prototype, "regionColumn", null);
__decorate([
    computed
], TableStyle.prototype, "idColumns", null);
__decorate([
    computed
], TableStyle.prototype, "timeColumn", null);
__decorate([
    computed
], TableStyle.prototype, "endTimeColumn", null);
__decorate([
    computed
], TableStyle.prototype, "xAxisColumn", null);
__decorate([
    computed
], TableStyle.prototype, "colorColumn", null);
__decorate([
    computed
], TableStyle.prototype, "pointSizeColumn", null);
__decorate([
    computed
], TableStyle.prototype, "isSampled", null);
__decorate([
    computed
], TableStyle.prototype, "tableColorMap", null);
__decorate([
    computed
], TableStyle.prototype, "colorMap", null);
__decorate([
    computed
], TableStyle.prototype, "pointSizeMap", null);
__decorate([
    computed
], TableStyle.prototype, "timeIntervals", null);
__decorate([
    computed
], TableStyle.prototype, "moreThanOneTimeInterval", null);
__decorate([
    computed
], TableStyle.prototype, "startJulianDates", null);
__decorate([
    computed
], TableStyle.prototype, "finishJulianDates", null);
__decorate([
    computed
], TableStyle.prototype, "rowGroups", null);
/**
 * Returns an array of sorted unique dates
 */
function sortedUniqueDates(dates) {
    const nonNullDates = dates.filter((d) => !!d);
    return nonNullDates
        .sort((a, b) => JulianDate.compare(a, b))
        .filter((d, i, ds) => i === 0 || !JulianDate.equals(d, ds[i - 1]));
}
function addSecondsToDate(date, seconds) {
    return JulianDate.addSeconds(date, seconds, new JulianDate());
}
function estimateFinalDurationSeconds(sortedDates) {
    const n = sortedDates.length;
    if (n > 1) {
        const finalDurationSeconds = JulianDate.secondsDifference(sortedDates[n - 1], sortedDates[0]) /
            (n - 1);
        return finalDurationSeconds;
    }
}
//# sourceMappingURL=TableStyle.js.map
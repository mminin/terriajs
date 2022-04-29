var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { uniq } from "lodash-es";
import { computed } from "mobx";
import { createTransformer } from "mobx-utils";
import isDefined from "../Core/isDefined";
import ConstantColorMap from "../Map/ConstantColorMap";
import ContinuousColorMap from "../Map/ContinuousColorMap";
import DiscreteColorMap from "../Map/DiscreteColorMap";
import EnumColorMap from "../Map/EnumColorMap";
import createStratumInstance from "../Models/Definition/createStratumInstance";
import LoadableStratum from "../Models/Definition/LoadableStratum";
import LegendTraits, { LegendItemTraits } from "../Traits/TraitsClasses/LegendTraits";
import TableChartStyleTraits, { TableChartLineStyleTraits } from "../Traits/TraitsClasses/TableChartStyleTraits";
import TableColorStyleTraits from "../Traits/TraitsClasses/TableColorStyleTraits";
import TablePointSizeStyleTraits from "../Traits/TraitsClasses/TablePointSizeStyleTraits";
import TableStyleTraits from "../Traits/TraitsClasses/TableStyleTraits";
import TableTimeStyleTraits from "../Traits/TraitsClasses/TableTimeStyleTraits";
import TableTraits from "../Traits/TraitsClasses/TableTraits";
import TableColumnType from "./TableColumnType";
const DEFAULT_ID_COLUMN = "id";
export default class TableAutomaticStylesStratum extends LoadableStratum(TableTraits) {
    constructor(catalogItem) {
        super();
        this.catalogItem = catalogItem;
        this._createLegendForColorStyle = createTransformer((i) => {
            return new ColorStyleLegend(this.catalogItem, i);
        });
    }
    duplicateLoadableStratum(newModel) {
        return new TableAutomaticStylesStratum(newModel);
    }
    get disableOpacityControl() {
        // disable opacity control for point tables - or if no mapItems
        return (this.catalogItem.activeTableStyle.isPoints() ||
            this.catalogItem.mapItems.length === 0);
    }
    get defaultStyle() {
        // Use the default style to select the spatial key (lon/lat, region, none i.e. chart)
        // for all styles.
        const longitudeColumn = this.catalogItem.findFirstColumnByType(TableColumnType.longitude);
        const latitudeColumn = this.catalogItem.findFirstColumnByType(TableColumnType.latitude);
        const regionColumn = this.catalogItem.findFirstColumnByType(TableColumnType.region);
        const timeColumn = this.catalogItem.findFirstColumnByType(TableColumnType.time);
        // Set a default id column only when we also have a time column
        const idColumn = timeColumn && this.catalogItem.findColumnByName(DEFAULT_ID_COLUMN);
        if (regionColumn !== undefined ||
            (longitudeColumn !== undefined && latitudeColumn !== undefined)) {
            return createStratumInstance(TableStyleTraits, {
                longitudeColumn: longitudeColumn && latitudeColumn ? longitudeColumn.name : undefined,
                latitudeColumn: longitudeColumn && latitudeColumn ? latitudeColumn.name : undefined,
                regionColumn: regionColumn ? regionColumn.name : undefined,
                time: createStratumInstance(TableTimeStyleTraits, {
                    timeColumn: timeColumn === null || timeColumn === void 0 ? void 0 : timeColumn.name,
                    idColumns: idColumn && [idColumn.name]
                }),
                color: createStratumInstance(TableColorStyleTraits, {
                    legend: this._createLegendForColorStyle(-1)
                })
            });
        }
        // This dataset isn't spatial, so see if we have a valid chart style
        if (this.defaultChartStyle) {
            return this.defaultChartStyle;
        }
        // Can't do much with this dataset.
        // Just add default legend
        return createStratumInstance(TableStyleTraits, {
            color: createStratumInstance(TableColorStyleTraits, {
                legend: this._createLegendForColorStyle(-1)
            })
        });
    }
    get defaultChartStyle() {
        const timeColumns = this.catalogItem.tableColumns.filter(column => column.type === TableColumnType.time);
        const scalarColumns = this.catalogItem.tableColumns.filter(column => column.type === TableColumnType.scalar);
        const hasTime = timeColumns.length > 0;
        if (scalarColumns.length >= (hasTime ? 1 : 2)) {
            return createStratumInstance(TableStyleTraits, {
                color: createStratumInstance(TableColorStyleTraits, {
                    legend: this._createLegendForColorStyle(-1)
                }),
                chart: createStratumInstance(TableChartStyleTraits, {
                    xAxisColumn: hasTime ? timeColumns[0].name : scalarColumns[0].name,
                    lines: scalarColumns.slice(hasTime ? 0 : 1).map((column, i) => createStratumInstance(TableChartLineStyleTraits, {
                        yAxisColumn: column.name,
                        isSelectedInWorkbench: i === 0 // activate only the first chart line by default
                    }))
                })
            });
        }
    }
    get styles() {
        // Create a style to color by every scalar and enum.
        let columns = this.catalogItem.tableColumns.filter(column => column.type === TableColumnType.scalar ||
            column.type === TableColumnType.enum);
        // If no styles for scalar, enum - try to create a style using region columns
        if (columns.length === 0) {
            columns = this.catalogItem.tableColumns.filter(column => column.type === TableColumnType.region);
        }
        return columns.map((column, i) => createStratumInstance(TableStyleTraits, {
            id: column.name,
            color: createStratumInstance(TableColorStyleTraits, {
                colorColumn: column.name,
                legend: this._createLegendForColorStyle(i)
            }),
            pointSize: createStratumInstance(TablePointSizeStyleTraits, {
                pointSizeColumn: column.name
            })
        }));
    }
    get disableDateTimeSelector() {
        if (this.catalogItem.mapItems.length === 0 ||
            !this.catalogItem.activeTableStyle.moreThanOneTimeInterval)
            return true;
    }
    get showDisableTimeOption() {
        // Return nothing if no row groups or if time column doesn't have at least one interval
        if (this.catalogItem.activeTableStyle.rowGroups.length === 0 ||
            !this.catalogItem.activeTableStyle.moreThanOneTimeInterval)
            return undefined;
        // Return true if at least 50% of rowGroups only have one unique time interval (i.e. they don't change over time)
        let flat = 0;
        for (let i = 0; i < this.catalogItem.activeTableStyle.rowGroups.length; i++) {
            const [rowGroupId, rowIds] = this.catalogItem.activeTableStyle.rowGroups[i];
            // Check if there is only 1 unique date in this rowGroup
            const dates = rowIds
                .map(rowId => { var _a, _b; return (_b = (_a = this.catalogItem.activeTableStyle.timeColumn) === null || _a === void 0 ? void 0 : _a.valuesAsDates.values[rowId]) === null || _b === void 0 ? void 0 : _b.getTime(); })
                .filter(isDefined);
            if (uniq(dates).length <= 1)
                flat++;
        }
        if (flat / this.catalogItem.activeTableStyle.rowGroups.length >= 0.5)
            return true;
        return undefined;
    }
    get initialTimeSource() {
        return "start";
    }
    /** Return title of timeColumn if defined
     * This will be displayed on DateTimeSelectorSection in the workbench
     */
    get timeLabel() {
        if (this.catalogItem.activeTableStyle.timeColumn) {
            return `${this.catalogItem.activeTableStyle.timeColumn.title}: `;
        }
    }
}
TableAutomaticStylesStratum.stratumName = "automaticTableStyles";
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "disableOpacityControl", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "defaultStyle", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "defaultChartStyle", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "styles", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "disableDateTimeSelector", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "showDisableTimeOption", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "initialTimeSource", null);
__decorate([
    computed
], TableAutomaticStylesStratum.prototype, "timeLabel", null);
export class ColorStyleLegend extends LoadableStratum(LegendTraits) {
    /**
     *
     * @param catalogItem
     * @param index index of column in catalogItem (if -1 or undefined, then default style will be used)
     */
    constructor(catalogItem, index) {
        super();
        this.catalogItem = catalogItem;
        this.index = index;
    }
    duplicateLoadableStratum(newModel) {
        return new ColorStyleLegend(newModel, this.index);
    }
    get tableStyle() {
        if (isDefined(this.index) &&
            this.index !== -1 &&
            this.index < this.catalogItem.tableStyles.length)
            return this.catalogItem.tableStyles[this.index];
        return this.catalogItem.defaultTableStyle;
    }
    /** Add column title as legend title if showing a Discrete or Enum ColorMap */
    get title() {
        if (this.tableStyle.colorMap instanceof DiscreteColorMap ||
            this.tableStyle.colorMap instanceof EnumColorMap)
            return this.tableStyle.title;
    }
    get items() {
        let items = [];
        const colorMap = this.tableStyle.colorMap;
        if (colorMap instanceof DiscreteColorMap) {
            items = this._createLegendItemsFromDiscreteColorMap(this.tableStyle, colorMap);
        }
        else if (colorMap instanceof ContinuousColorMap) {
            items = this._createLegendItemsFromContinuousColorMap(this.tableStyle, colorMap);
        }
        else if (colorMap instanceof EnumColorMap) {
            items = this._createLegendItemsFromEnumColorMap(this.tableStyle, colorMap);
        }
        else if (colorMap instanceof ConstantColorMap) {
            items = this._createLegendItemsFromConstantColorMap(this.tableStyle, colorMap);
        }
        return items;
    }
    get numberFormatOptions() {
        var _a, _b;
        const colorColumn = this.tableStyle.colorColumn;
        if ((_a = colorColumn === null || colorColumn === void 0 ? void 0 : colorColumn.traits) === null || _a === void 0 ? void 0 : _a.format)
            return (_b = colorColumn === null || colorColumn === void 0 ? void 0 : colorColumn.traits) === null || _b === void 0 ? void 0 : _b.format;
        if (colorColumn &&
            colorColumn.type === TableColumnType.scalar &&
            isDefined(colorColumn.valuesAsNumbers.maximum) &&
            isDefined(colorColumn.valuesAsNumbers.minimum)) {
            if (colorColumn.valuesAsNumbers.maximum -
                colorColumn.valuesAsNumbers.minimum ===
                0)
                return;
            // We want to show fraction digits depending on how small difference is between min and max.
            // This also takes into consideration the defualt number of legend items - 7
            // So we add an extra digit
            // For example:
            // - if difference is 10 - we wnat to show one fraction digit
            // - if difference is 1 - we want to show two fraction digits
            // - if difference is 0.1 - we want to show three fraction digits
            // log_10(20/x) achieves this (where x is difference between min and max)
            // https://www.wolframalpha.com/input/?i=log_10%2820%2Fx%29
            // We use 20 here instead of 10 to give us a more convervative value (that is, we may show an extra fraction digit even if it is not needed)
            // So when x >= 20 - we will not show any fraction digits
            // Clamp values between 0 and 5
            let fractionDigits = Math.max(0, Math.min(5, Math.ceil(Math.log10(20 /
                Math.abs(colorColumn.valuesAsNumbers.maximum -
                    colorColumn.valuesAsNumbers.minimum)))));
            return {
                maximumFractionDigits: fractionDigits,
                minimumFractionDigits: fractionDigits
            };
        }
    }
    _createLegendItemsFromContinuousColorMap(style, colorMap) {
        const colorColumn = style.colorColumn;
        const nullBin = colorColumn &&
            colorColumn.valuesAsNumbers.numberOfValidNumbers <
                colorColumn.valuesAsNumbers.values.length
            ? [
                createStratumInstance(LegendItemTraits, {
                    color: style.colorTraits.nullColor || "rgba(0, 0, 0, 0)",
                    addSpacingAbove: true,
                    title: style.colorTraits.nullLabel ||
                        i18next.t("models.tableData.legendNullLabel")
                })
            ]
            : [];
        const outlierBin = style.tableColorMap.outlierColor
            ? [
                createStratumInstance(LegendItemTraits, {
                    color: style.tableColorMap.outlierColor.toCssColorString(),
                    addSpacingAbove: true,
                    title: style.colorTraits.outlierLabel ||
                        i18next.t("models.tableData.legendZFilterLabel")
                })
            ]
            : [];
        return new Array(7)
            .fill(0)
            .map((_, i) => {
            // Use maxValue if i === 6 so we don't get funky JS precision
            const value = i === 6
                ? colorMap.maxValue
                : colorMap.minValue +
                    (colorMap.maxValue - colorMap.minValue) * (i / 6);
            return createStratumInstance(LegendItemTraits, {
                color: colorMap.mapValueToColor(value).toCssColorString(),
                title: this._formatValue(value, this.numberFormatOptions)
            });
        })
            .reverse()
            .concat(nullBin, outlierBin);
    }
    _createLegendItemsFromDiscreteColorMap(style, colorMap) {
        const colorColumn = style.colorColumn;
        const minimum = colorColumn && colorColumn.valuesAsNumbers.minimum !== undefined
            ? colorColumn.valuesAsNumbers.minimum
            : 0.0;
        const nullBin = colorColumn &&
            colorColumn.valuesAsNumbers.numberOfValidNumbers <
                colorColumn.valuesAsNumbers.values.length
            ? [
                createStratumInstance(LegendItemTraits, {
                    color: style.colorTraits.nullColor || "rgba(0, 0, 0, 0)",
                    addSpacingAbove: true,
                    title: style.colorTraits.nullLabel || "(No value)"
                })
            ]
            : [];
        return colorMap.maximums
            .map((maximum, i) => {
            const isBottom = i === 0;
            const formattedMin = isBottom
                ? this._formatValue(minimum, this.numberFormatOptions)
                : this._formatValue(colorMap.maximums[i - 1], this.numberFormatOptions);
            const formattedMax = this._formatValue(maximum, this.numberFormatOptions);
            return createStratumInstance(LegendItemTraits, {
                color: colorMap.colors[i].toCssColorString(),
                title: `${formattedMin} to ${formattedMax}`
                // titleBelow: isBottom ? minimum.toString() : undefined, // TODO: format value
                // titleAbove: maximum.toString() // TODO: format value
            });
        })
            .reverse()
            .concat(nullBin);
    }
    _createLegendItemsFromEnumColorMap(style, colorMap) {
        const colorColumn = style.colorColumn;
        const nullBin = colorColumn && colorColumn.uniqueValues.numberOfNulls > 0
            ? [
                createStratumInstance(LegendItemTraits, {
                    color: style.colorTraits.nullColor || "rgba(0, 0, 0, 0)",
                    addSpacingAbove: true,
                    title: style.colorTraits.nullLabel || "(No value)"
                })
            ]
            : [];
        // Aggregate colours (don't show multiple legend items for the same colour)
        const colorMapValues = colorMap.values.reduce((prev, current, i) => {
            const cssCol = colorMap.colors[i].toCssColorString();
            if (isDefined(prev[cssCol])) {
                prev[cssCol].push(current);
            }
            else {
                prev[cssCol] = [current];
            }
            return prev;
        }, {});
        return Object.entries(colorMapValues)
            .map(([color, multipleTitles]) => createStratumInstance(LegendItemTraits, {
            multipleTitles,
            color
        }))
            .concat(nullBin);
    }
    _createLegendItemsFromConstantColorMap(style, colorMap) {
        return [
            createStratumInstance(LegendItemTraits, {
                color: colorMap.color.toCssColorString(),
                title: colorMap.title
            })
        ];
    }
    _formatValue(value, format) {
        return ((format === null || format === void 0 ? void 0 : format.maximumFractionDigits) ? value
            : Math.round(value)).toLocaleString(undefined, format);
    }
}
__decorate([
    computed
], ColorStyleLegend.prototype, "tableStyle", null);
__decorate([
    computed
], ColorStyleLegend.prototype, "title", null);
__decorate([
    computed
], ColorStyleLegend.prototype, "items", null);
__decorate([
    computed
], ColorStyleLegend.prototype, "numberFormatOptions", null);
//# sourceMappingURL=TableAutomaticStylesStratum.js.map
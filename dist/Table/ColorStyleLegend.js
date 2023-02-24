var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed } from "mobx";
import isDefined from "../Core/isDefined";
import ConstantColorMap from "../Map/ColorMap/ConstantColorMap";
import ContinuousColorMap from "../Map/ColorMap/ContinuousColorMap";
import DiscreteColorMap from "../Map/ColorMap/DiscreteColorMap";
import EnumColorMap from "../Map/ColorMap/EnumColorMap";
import createStratumInstance from "../Models/Definition/createStratumInstance";
import LoadableStratum from "../Models/Definition/LoadableStratum";
import LegendTraits, { LegendItemTraits } from "../Traits/TraitsClasses/LegendTraits";
export class ColorStyleLegend extends LoadableStratum(LegendTraits) {
    /**
     *
     * @param catalogItem
     * @param index index of column in catalogItem (if -1 or undefined, then default style will be used)
     */
    constructor(catalogItem, legendItemOverrides = {}) {
        super();
        this.catalogItem = catalogItem;
        this.legendItemOverrides = legendItemOverrides;
    }
    duplicateLoadableStratum(newModel) {
        return new ColorStyleLegend(newModel);
    }
    get tableStyle() {
        return this.catalogItem.activeTableStyle;
    }
    // Keep these here until we deprecate LegendTraits in TableColorStyleTraits
    // See https://github.com/TerriaJS/terriajs/issues/6356
    get oldLegendTraits() {
        return this.tableStyle.colorTraits.legend;
    }
    get url() {
        return this.oldLegendTraits.url;
    }
    get imageScaling() {
        return this.oldLegendTraits.imageScaling;
    }
    get urlMimeType() {
        return this.oldLegendTraits.urlMimeType;
    }
    get backgroundColor() {
        return this.oldLegendTraits.backgroundColor;
    }
    /** Add column title as legend title if showing a Discrete or Enum ColorMap */
    get title() {
        var _a, _b;
        if (this.oldLegendTraits.title)
            return this.oldLegendTraits.title;
        if (this.tableStyle.colorMap instanceof ContinuousColorMap ||
            this.tableStyle.colorMap instanceof DiscreteColorMap ||
            this.tableStyle.colorMap instanceof EnumColorMap)
            return (_b = (_a = this.tableStyle.colorColumn) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : this.tableStyle.title;
    }
    get items() {
        // This is a bit dodgy - but should be fine until we deprecate LegendTraits in TableColorStyleTraits
        if (this.oldLegendTraits.items && this.oldLegendTraits.items.length > 0)
            return this.oldLegendTraits.traits.items.toJson(this.oldLegendTraits.items);
        let items = [];
        const colorMap = this.tableStyle.colorMap;
        if (colorMap instanceof DiscreteColorMap) {
            items = this._createLegendItemsFromDiscreteColorMap(this.tableStyle, colorMap, this.legendItemOverrides);
        }
        else if (colorMap instanceof ContinuousColorMap) {
            items = this._createLegendItemsFromContinuousColorMap(this.tableStyle, colorMap, this.legendItemOverrides);
        }
        else if (colorMap instanceof EnumColorMap) {
            items = this._createLegendItemsFromEnumColorMap(this.tableStyle, colorMap, this.legendItemOverrides);
        }
        else if (colorMap instanceof ConstantColorMap) {
            items = this._createLegendItemsFromConstantColorMap(this.tableStyle, colorMap, this.legendItemOverrides);
        }
        return items;
    }
    _createLegendItemsFromContinuousColorMap(style, colorMap, legendItemOverrides) {
        const colorColumn = style.colorColumn;
        const nullBin = colorColumn &&
            colorColumn.valuesAsNumbers.numberOfValidNumbers <
                colorColumn.valuesAsNumbers.values.length
            ? [
                createStratumInstance(LegendItemTraits, {
                    ...legendItemOverrides,
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
                    ...legendItemOverrides,
                    color: style.tableColorMap.outlierColor.toCssColorString(),
                    addSpacingAbove: true,
                    title: style.colorTraits.outlierLabel ||
                        i18next.t("models.tableData.legendZFilterLabel")
                })
            ]
            : [];
        return new Array(this.tableStyle.colorTraits.legendTicks)
            .fill(0)
            .map((_, i) => {
            // Use maxValue for last value so we don't get funky JS precision
            const value = i === this.tableStyle.colorTraits.legendTicks - 1
                ? colorMap.maxValue
                : colorMap.minValue +
                    (colorMap.maxValue - colorMap.minValue) *
                        (i / (this.tableStyle.colorTraits.legendTicks - 1));
            return createStratumInstance(LegendItemTraits, {
                ...legendItemOverrides,
                color: colorMap.mapValueToColor(value).toCssColorString(),
                title: this._formatValue(value, this.tableStyle.numberFormatOptions)
            });
        })
            .reverse()
            .concat(nullBin, outlierBin);
    }
    _createLegendItemsFromDiscreteColorMap(style, colorMap, legendItemOverrides) {
        const colorColumn = style.colorColumn;
        const minimum = colorColumn && colorColumn.valuesAsNumbers.minimum !== undefined
            ? colorColumn.valuesAsNumbers.minimum
            : 0.0;
        const nullBin = colorColumn &&
            colorColumn.valuesAsNumbers.numberOfValidNumbers <
                colorColumn.valuesAsNumbers.values.length
            ? [
                createStratumInstance(LegendItemTraits, {
                    ...legendItemOverrides,
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
                ? this._formatValue(minimum, this.tableStyle.numberFormatOptions)
                : this._formatValue(colorMap.maximums[i - 1], this.tableStyle.numberFormatOptions);
            const formattedMax = this._formatValue(maximum, this.tableStyle.numberFormatOptions);
            return createStratumInstance(LegendItemTraits, {
                ...legendItemOverrides,
                color: colorMap.colors[i].toCssColorString(),
                title: `${formattedMin} to ${formattedMax}`
                // titleBelow: isBottom ? minimum.toString() : undefined, // TODO: format value
                // titleAbove: maximum.toString() // TODO: format value
            });
        })
            .reverse()
            .concat(nullBin);
    }
    _createLegendItemsFromEnumColorMap(style, colorMap, legendItemOverrides) {
        const colorColumn = style.colorColumn;
        // Show null bin if data has null values - or if EnumColorMap doesn't have enough colors to show all values
        const nullBin = colorColumn &&
            (colorColumn.uniqueValues.numberOfNulls > 0 ||
                colorColumn.uniqueValues.values.length > colorMap.values.length)
            ? [
                createStratumInstance(LegendItemTraits, {
                    ...legendItemOverrides,
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
            .map(([color, multipleTitles]) => multipleTitles.length > 1
            ? createStratumInstance(LegendItemTraits, {
                ...legendItemOverrides,
                multipleTitles,
                color
            })
            : createStratumInstance(LegendItemTraits, {
                ...legendItemOverrides,
                title: multipleTitles[0],
                color
            }))
            .concat(nullBin);
    }
    _createLegendItemsFromConstantColorMap(style, colorMap, legendItemOverrides) {
        return [
            createStratumInstance(LegendItemTraits, {
                ...legendItemOverrides,
                color: colorMap.color.toCssColorString(),
                title: colorMap.title
            })
        ];
    }
    _formatValue(value, format) {
        return ((format === null || format === void 0 ? void 0 : format.maximumFractionDigits) ? value : Math.round(value)).toLocaleString(undefined, format);
    }
}
__decorate([
    computed
], ColorStyleLegend.prototype, "tableStyle", null);
__decorate([
    computed
], ColorStyleLegend.prototype, "oldLegendTraits", null);
__decorate([
    computed
], ColorStyleLegend.prototype, "url", null);
__decorate([
    computed
], ColorStyleLegend.prototype, "imageScaling", null);
__decorate([
    computed
], ColorStyleLegend.prototype, "urlMimeType", null);
__decorate([
    computed
], ColorStyleLegend.prototype, "backgroundColor", null);
__decorate([
    computed
], ColorStyleLegend.prototype, "title", null);
__decorate([
    computed
], ColorStyleLegend.prototype, "items", null);
//# sourceMappingURL=ColorStyleLegend.js.map
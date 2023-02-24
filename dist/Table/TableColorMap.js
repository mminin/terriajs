var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as d3Scale from "d3-scale-chromatic";
import { computed } from "mobx";
import Color from "terriajs-cesium/Source/Core/Color";
import createColorForIdTransformer from "../Core/createColorForIdTransformer";
import filterOutUndefined from "../Core/filterOutUndefined";
import isDefined from "../Core/isDefined";
import runLater from "../Core/runLater";
import StandardCssColors from "../Core/StandardCssColors";
import TerriaError from "../Core/TerriaError";
import ConstantColorMap from "../Map/ColorMap/ConstantColorMap";
import ContinuousColorMap from "../Map/ColorMap/ContinuousColorMap";
import DiscreteColorMap from "../Map/ColorMap/DiscreteColorMap";
import EnumColorMap from "../Map/ColorMap/EnumColorMap";
import TableColumnType from "./TableColumnType";
const getColorForId = createColorForIdTransformer();
const DEFAULT_COLOR = "yellow";
/** Diverging scales (can be used for continuous and discrete).
 * Discrete scales support a size n ranging from 3 to 11
 */
export const DIVERGING_SCALES = [
    "BrBG",
    "PRGn",
    "PiYG",
    "PuOr",
    "RdBu",
    "RdGy",
    "RdYlBu",
    "RdYlGn",
    "Spectral"
];
export const DEFAULT_DIVERGING = "PuOr";
/** Sequential scales D3 color scales (can be used for continuous and discrete).
 * Discrete scales support a size n ranging from 3 to 9
 */
export const SEQUENTIAL_SCALES = [
    "Blues",
    "Greens",
    "Greys",
    "Oranges",
    "Purples",
    "Reds",
    "BuGn",
    "BuPu",
    "GnBu",
    "OrRd",
    "PuBuGn",
    "PuBu",
    "PuRd",
    "RdPu",
    "YlGnBu",
    "YlGn",
    "YlOrBr",
    "YlOrRd"
];
export const DEFAULT_SEQUENTIAL = "Reds";
/** Sequential continuous D3 color scales (continuous only - not discrete) */
export const SEQUENTIAL_CONTINUOUS_SCALES = [
    "Turbo",
    "Viridis",
    "Inferno",
    "Magma",
    "Plasma",
    "Cividis",
    "Warm",
    "Cool",
    "CubehelixDefault"
];
export const QUALITATIVE_SCALES = [
    // Note HighContrast is custom - see StandardCssColors.highContrast
    "HighContrast",
    "Category10",
    "Accent",
    "Dark2",
    "Paired",
    "Pastel1",
    "Pastel2",
    "Set1",
    "Set2",
    "Set3",
    "Tableau10"
];
export const DEFAULT_QUALITATIVE = "HighContrast";
export default class TableColorMap {
    constructor(
    /** Title used for ConstantColorMaps - and to create a unique color for a particular Table-based CatalogItem */
    title, colorColumn, colorTraits) {
        this.title = title;
        this.colorColumn = colorColumn;
        this.colorTraits = colorTraits;
    }
    get type() {
        return this.colorMap instanceof DiscreteColorMap
            ? "bin"
            : this.colorMap instanceof ContinuousColorMap
                ? "continuous"
                : this.colorMap instanceof EnumColorMap
                    ? "enum"
                    : "constant";
    }
    /**
     * Gets an object used to map values in {@link #colorColumn} to colors
     * for this style.
     * Will try to create most appropriate colorMap given colorColumn:
     *
     * - If column type is `scalar`
     *   - and we have binMaximums - use DiscreteColorMap
     *   - and we have a valid minValue and maxValue - use ContinuousColorMap
     *   - and only a single value - use EnumColorMap
     *
     * - If column type is `enum` or `region`
     *   - and we have enough binColors to represent uniqueValues - use EnumColorMap
     *
     * - If none of the above conditions are met - use ConstantColorMap
     */
    get colorMap() {
        var _a;
        const colorColumn = this.colorColumn;
        const colorTraits = this.colorTraits;
        // If column type is `scalar` - use DiscreteColorMap or ContinuousColorMap
        if ((!colorTraits.mapType ||
            colorTraits.mapType === "continuous" ||
            colorTraits.mapType === "bin") &&
            colorColumn &&
            colorColumn.type === TableColumnType.scalar) {
            // If column type is `scalar` and we have binMaximums - use DiscreteColorMap
            if (colorTraits.mapType !== "continuous" && this.binMaximums.length > 0) {
                return new DiscreteColorMap({
                    bins: this.binColors.map((color, i) => {
                        return {
                            color: Color.fromCssColorString(color),
                            maximum: this.binMaximums[i],
                            includeMinimumInThisBin: false
                        };
                    }),
                    nullColor: this.nullColor
                });
            }
            // If column type is `scalar` and we have a valid minValue and maxValue - use ContinuousColorMap
            if (colorTraits.mapType !== "bin" &&
                isDefined(this.minimumValue) &&
                isDefined(this.maximumValue) &&
                this.minimumValue < this.maximumValue) {
                // Get colorScale from `d3-scale-chromatic` library - all continuous color schemes start with "interpolate"
                // See https://github.com/d3/d3-scale-chromatic#diverging
                // d3 continuous color schemes are represented as a function which map a value [0,1] to a color]
                let colorScale = this.colorScaleContinuous();
                return new ContinuousColorMap({
                    colorScale,
                    minValue: this.minimumValue,
                    maxValue: this.maximumValue,
                    nullColor: this.nullColor,
                    outlierColor: this.outlierColor,
                    isDiverging: this.isDiverging
                });
                // Edge case: if we only have one value, create color map with single value
                // This is because ContinuousColorMap can't handle minimumValue === maximumValue
            }
            else if (((_a = this.colorColumn) === null || _a === void 0 ? void 0 : _a.uniqueValues.values.length) === 1) {
                return new EnumColorMap({
                    enumColors: [
                        {
                            color: Color.fromCssColorString(this.colorScaleContinuous()(1)),
                            value: this.colorColumn.uniqueValues.values[0]
                        }
                    ],
                    nullColor: this.nullColor
                });
            }
            // If no useful ColorMap could be found for the scalar column - we will create a ConstantColorMap at the end of the function
        }
        // If column type is `enum` or `region` - use EnumColorMap
        else if (colorColumn &&
            ((!colorTraits.mapType &&
                (colorColumn.type === TableColumnType.enum ||
                    colorColumn.type === TableColumnType.region) &&
                this.enumColors.length > 0) ||
                colorTraits.mapType === "enum")) {
            return new EnumColorMap({
                enumColors: filterOutUndefined(this.enumColors.map((e) => {
                    var _a;
                    if (e.value === undefined || e.color === undefined) {
                        return undefined;
                    }
                    return {
                        value: e.value,
                        color: colorColumn.type !== TableColumnType.region
                            ? (_a = Color.fromCssColorString(e.color)) !== null && _a !== void 0 ? _a : Color.TRANSPARENT : this.regionColor
                    };
                })),
                nullColor: this.nullColor
            });
        }
        // No useful colorMap can be generated - so create a ConstantColorMap (the same color for everything.
        // Try to find a useful color to use in this order
        // - If colorColumn is of type region - use regionColor
        // - If binColors trait it set - use it
        // - If we have a title, use it to generate a unique color for this style
        // - Or use DEFAULT_COLOR
        let color;
        if ((colorColumn === null || colorColumn === void 0 ? void 0 : colorColumn.type) === TableColumnType.region && this.regionColor) {
            color = this.regionColor;
        }
        else if (colorTraits.nullColor) {
            color = Color.fromCssColorString(colorTraits.nullColor);
        }
        else if (colorTraits.binColors && colorTraits.binColors.length > 0) {
            color = Color.fromCssColorString(colorTraits.binColors[0]);
        }
        else if (this.title) {
            color = Color.fromCssColorString(getColorForId(this.title));
        }
        if (!color) {
            color = Color.fromCssColorString(DEFAULT_COLOR);
        }
        return new ConstantColorMap({
            color,
            title: this.title,
            // Use nullColor if colorColumn is of type `region`
            // This is so we only see regions which rows exist for (everything else will use nullColor)
            nullColor: (colorColumn === null || colorColumn === void 0 ? void 0 : colorColumn.type) === TableColumnType.region
                ? this.nullColor
                : undefined
        });
    }
    /**
     * Bin colors used to represent `scalar` TableColumns in a DiscreteColorMap
     */
    get binColors() {
        var _a;
        const numberOfBins = this.binMaximums.length;
        // Pick a color for every bin.
        const binColors = this.colorTraits.binColors || [];
        let colorScale = this.colorScaleCategorical(this.binMaximums.length);
        const result = [];
        for (let i = 0; i < numberOfBins; ++i) {
            if (i < binColors.length) {
                result.push((_a = binColors[i]) !== null && _a !== void 0 ? _a : Color.TRANSPARENT.toCssHexString());
            }
            else {
                result.push(colorScale[i % colorScale.length]);
            }
        }
        return result;
    }
    /**
     * Bin maximums used to represent `scalar` TableColumns in a DiscreteColorMap
     * These map directly to `this.binColors`
     */
    get binMaximums() {
        const colorColumn = this.colorColumn;
        if (colorColumn === undefined) {
            return this.colorTraits.binMaximums || [];
        }
        const binMaximums = this.colorTraits.binMaximums;
        if (binMaximums !== undefined) {
            if (colorColumn.type === TableColumnType.scalar &&
                this.maximumValue !== undefined &&
                (binMaximums.length === 0 ||
                    this.maximumValue > binMaximums[binMaximums.length - 1])) {
                // Add an extra bin to accommodate the maximum value of the dataset.
                return binMaximums.concat([this.maximumValue]);
            }
            return binMaximums;
        }
        else if (this.colorTraits.numberOfBins === 0) {
            return [];
        }
        else {
            // TODO: compute maximums according to ckmeans, quantile, etc.
            if (this.minimumValue === undefined || this.maximumValue === undefined) {
                return [];
            }
            const numberOfBins = colorColumn.uniqueValues.values.length < this.colorTraits.numberOfBins
                ? colorColumn.uniqueValues.values.length
                : this.colorTraits.numberOfBins;
            let next = this.minimumValue;
            const step = (this.maximumValue - this.minimumValue) / numberOfBins;
            const result = [];
            for (let i = 0; i < numberOfBins - 1; ++i) {
                next += step;
                result.push(next);
            }
            result.push(this.maximumValue);
            return result;
        }
    }
    /**
     * Enum bin colors used to represent `enum` or `region` TableColumns in a EnumColorMap
     * If no enumColor traits are provided, then try to create colors from uniqueValues
     */
    get enumColors() {
        var _a, _b;
        if ((_b = (_a = this.colorTraits.enumColors) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0 > 0) {
            return this.colorTraits.enumColors;
        }
        const colorColumn = this.colorColumn;
        if (colorColumn === undefined) {
            return [];
        }
        // No enumColors traits provided - so create a color for each unique value
        const uniqueValues = colorColumn.uniqueValues.values;
        let colorScale = this.colorScaleCategorical(uniqueValues.length);
        return colorScale
            .map((color, i) => {
            return {
                value: uniqueValues[i],
                color
            };
        })
            .filter((color) => isDefined(color.value));
    }
    /** This color is used to color values outside minimumValue and maximumValue - it is only used for ContinuousColorMaps
     * If undefined, values outside min/max values will be clamped
     * If zScoreFilter is enabled, this will return a default color (AQUAMARINE)
     **/
    get outlierColor() {
        // Only return outlier if there are actually values outside min/max
        if (!isDefined(this.minimumValue) ||
            !isDefined(this.validValuesMin) ||
            !isDefined(this.maximumValue) ||
            !isDefined(this.validValuesMax) ||
            (this.minimumValue <= this.validValuesMin &&
                this.maximumValue >= this.validValuesMax))
            return;
        if (isDefined(this.colorTraits.outlierColor))
            return Color.fromCssColorString(this.colorTraits.outlierColor);
        if (!this.zScoreFilterValues || !this.colorTraits.zScoreFilterEnabled)
            return;
        return Color.AQUAMARINE;
    }
    get nullColor() {
        var _a;
        return this.colorTraits.nullColor
            ? (_a = Color.fromCssColorString(this.colorTraits.nullColor)) !== null && _a !== void 0 ? _a : Color.TRANSPARENT : Color.TRANSPARENT;
    }
    get regionColor() {
        return Color.fromCssColorString(this.colorTraits.regionColor);
    }
    /** We treat color map as "diverging" if the range cross 0 - (the color scale has positive and negative values)
     * We also check to make sure colorPalette ColorTrait is set to a diverging color palette (see https://github.com/d3/d3-scale-chromatic#diverging)
     */
    get isDiverging() {
        return ((this.minimumValue || 0.0) < 0.0 &&
            (this.maximumValue || 0.0) > 0.0 &&
            [
                // If colorPalette is undefined, defaultColorPaletteName will return a diverging color scale
                undefined,
                ...DIVERGING_SCALES
            ].includes(this.colorTraits.colorPalette));
    }
    /** Get default colorPalette name.
     * Follows https://github.com/d3/d3-scale-chromatic#api-reference
     * If Enum or Region - use custom HighContrast (See StandardCssColors.highContrast)
     * If scalar and not diverging - use Reds palette
     * If scalar and diverging - use Purple to Orange palette
     *
     * NOTE: it is **very** important that these values are valid color palettes.
     * If they are not, Terria will crash
     */
    get defaultColorPaletteName() {
        const colorColumn = this.colorColumn;
        if (colorColumn === undefined) {
            // This shouldn't get used - as if there is no colorColumn - there is nothing to visualize!
            return DEFAULT_SEQUENTIAL;
        }
        if (colorColumn.type === TableColumnType.enum ||
            colorColumn.type === TableColumnType.region) {
            // Enumerated values, so use a large, high contrast palette.
            return DEFAULT_QUALITATIVE;
        }
        else if (colorColumn.type === TableColumnType.scalar) {
            const valuesAsNumbers = colorColumn.valuesAsNumbers;
            if (valuesAsNumbers !== undefined && this.isDiverging) {
                // Values cross zero, so use a diverging palette
                return DEFAULT_DIVERGING;
            }
            else {
                // Values do not cross zero so use a sequential palette.
                return DEFAULT_SEQUENTIAL;
            }
        }
        return DEFAULT_SEQUENTIAL;
    }
    /** Minimum value - with filters if applicable
     * This will apply to ContinuousColorMaps and DiscreteColorMaps
     */
    get minimumValue() {
        if (isDefined(this.colorTraits.minimumValue))
            return this.colorTraits.minimumValue;
        if (this.zScoreFilterValues && this.colorTraits.zScoreFilterEnabled)
            return this.zScoreFilterValues.min;
        if (isDefined(this.validValuesMin))
            return this.validValuesMin;
    }
    /** Maximum value - with filters if applicable
     * This will apply to ContinuousColorMaps and DiscreteColorMaps
     */
    get maximumValue() {
        if (isDefined(this.colorTraits.maximumValue))
            return this.colorTraits.maximumValue;
        if (this.zScoreFilterValues && this.colorTraits.zScoreFilterEnabled)
            return this.zScoreFilterValues.max;
        if (isDefined(this.validValuesMax))
            return this.validValuesMax;
    }
    /** Get values of colorColumn with valid regions if:
     * - colorColumn is scalar and the activeStyle has a regionColumn
     */
    get regionValues() {
        var _a, _b;
        const regionColumn = (_a = this.colorColumn) === null || _a === void 0 ? void 0 : _a.tableModel.activeTableStyle.regionColumn;
        if (((_b = this.colorColumn) === null || _b === void 0 ? void 0 : _b.type) !== TableColumnType.scalar || !regionColumn)
            return;
        return regionColumn.valuesAsRegions.regionIds.map((region, rowIndex) => {
            var _a, _b;
            // Only return values which have a valid region in the same row
            if (region !== null) {
                return (_b = (_a = this.colorColumn) === null || _a === void 0 ? void 0 : _a.valuesAsNumbers.values[rowIndex]) !== null && _b !== void 0 ? _b : null;
            }
            return null;
        });
    }
    /** Filter out null values from color column */
    get validValues() {
        var _a, _b;
        const values = (_a = this.regionValues) !== null && _a !== void 0 ? _a : (_b = this.colorColumn) === null || _b === void 0 ? void 0 : _b.valuesAsNumbers.values;
        if (values) {
            return values.filter((val) => val !== null);
        }
    }
    get validValuesMax() {
        return this.validValues ? getMax(this.validValues) : undefined;
    }
    get validValuesMin() {
        return this.validValues ? getMin(this.validValues) : undefined;
    }
    /** Filter by z-score if applicable
     * It requires:
     * - `colorTraits.zScoreFilter` to be defined,
     * - colorTraits.minimumValue and colorTraits.maximumValue to be UNDEFINED
     *
     * This will treat values outside of specified z-score as outliers, and therefore will not include in color scale. This value is magnitude of z-score - it will apply to positive and negative z-scores. For example a value of `2` will treat all values that are 2 or more standard deviations from the mean as outliers.
     * This will only apply to ContinuousColorMaps
     * */
    get zScoreFilterValues() {
        var _a, _b;
        if (!isDefined(this.colorTraits.zScoreFilter) ||
            isDefined(this.colorTraits.minimumValue) ||
            isDefined(this.colorTraits.maximumValue) ||
            !this.colorColumn ||
            !this.validValues ||
            !isDefined(this.validValuesMax) ||
            !isDefined(this.validValuesMin) ||
            this.validValues.length === 0)
            return;
        const values = (_a = this.regionValues) !== null && _a !== void 0 ? _a : (_b = this.colorColumn) === null || _b === void 0 ? void 0 : _b.valuesAsNumbers.values;
        const rowGroups = this.colorColumn.tableModel.activeTableStyle.rowGroups;
        // Array of row group values
        const rowGroupValues = rowGroups.map((group) => group[1]
            .map((row) => values[row])
            .filter((val) => val !== null));
        // Get average value for each row group
        const rowGroupAverages = rowGroupValues.map((val) => getMean(val));
        const definedRowGroupAverages = filterOutUndefined(rowGroupAverages);
        const std = getStandardDeviation(definedRowGroupAverages);
        const mean = getMean(definedRowGroupAverages);
        // No std or mean - so return unfiltered values
        if (!isDefined(std) && !isDefined(mean))
            return;
        let filteredMax = -Infinity;
        let filteredMin = Infinity;
        rowGroupAverages.forEach((rowGroupMean, idx) => {
            if (isDefined(rowGroupMean) &&
                Math.abs((rowGroupMean - mean) / std) <=
                    this.colorTraits.zScoreFilter) {
                // If mean is within zscore filter, update min/max
                const rowGroupMin = getMin(rowGroupValues[idx]);
                filteredMin = filteredMin > rowGroupMin ? rowGroupMin : filteredMin;
                const rowGroupMax = getMax(rowGroupValues[idx]);
                filteredMax = filteredMax < rowGroupMax ? rowGroupMax : filteredMax;
            }
        });
        const actualRange = this.validValuesMax - this.validValuesMin;
        // Only apply filtered min/max if it reduces range by factor of `rangeFilter` (eg if `rangeFilter = 0.1`, then the filter must reduce the range by at least 10% to be applied)
        // This applies to min and max independently
        if (filteredMin <
            this.validValuesMin + actualRange * this.colorTraits.rangeFilter) {
            filteredMin = this.validValuesMin;
        }
        if (filteredMax >
            this.validValuesMax - actualRange * this.colorTraits.rangeFilter) {
            filteredMax = this.validValuesMax;
        }
        if (filteredMin < filteredMax &&
            (filteredMin !== this.validValuesMin ||
                filteredMax !== this.validValuesMax))
            return { max: filteredMax, min: filteredMin };
    }
    /**
     * Get colorScale from `d3-scale-chromatic` library - all continuous color schemes start with "interpolate"
     * See https://github.com/d3/d3-scale-chromatic#diverging
     */
    colorScaleContinuous() {
        // d3 continuous color schemes are represented as a function which map a value [0,1] to a color]
        let colorScale;
        // If colorPalette trait is defined - try to resolve it
        if (isDefined(this.colorTraits.colorPalette)) {
            colorScale = d3Scale[`interpolate${this.colorTraits.colorPalette}`];
        }
        // If no colorScaleScheme found - use `defaultColorPaletteName` to find one
        if (!isDefined(colorScale)) {
            if (isDefined(this.colorTraits.colorPalette)) {
                this.invalidColorPaletteWarning();
            }
            colorScale = d3Scale[`interpolate${this.defaultColorPaletteName}`];
        }
        return colorScale;
    }
    /**
     * Get categorical colorScale from `d3-scale-chromatic` library - all categorical color schemes start with "scheme"
     * See https://github.com/d3/d3-scale-chromatic#categorical
     * @param numberOfBins
     */
    colorScaleCategorical(numberOfBins) {
        // d3 categorical color schemes are represented as either:
        // Two dimensional arrays
        //   - First array represents number of bins in the given color scale (eg 3 = [#ff0000, #ffaa00, #ffff00])
        //   - Second array contains color values
        // One dimensional array
        //   - Just an array of color values
        //   - For example schemeCategory10 (https://github.com/d3/d3-scale-chromatic#schemeCategory10) is a fixed color scheme with 10 values
        let colorScaleScheme;
        // If colorPalette trait is defined - try to resolve it
        if (isDefined(this.colorTraits.colorPalette)) {
            // "HighContrast" is a custom additional palette
            if (this.colorTraits.colorPalette === "HighContrast") {
                colorScaleScheme = StandardCssColors.highContrast;
            }
            else {
                colorScaleScheme = d3Scale[`scheme${this.colorTraits.colorPalette}`];
            }
        }
        // If no colorScaleScheme found - use `defaultColorPaletteName` to find one
        if (!colorScaleScheme) {
            if (isDefined(this.colorTraits.colorPalette)) {
                this.invalidColorPaletteWarning();
            }
            if (this.defaultColorPaletteName === "HighContrast") {
                colorScaleScheme = StandardCssColors.highContrast;
            }
            else {
                colorScaleScheme = d3Scale[`scheme${this.defaultColorPaletteName}`];
            }
        }
        let colorScale;
        // If color scheme is one dimensional array (eg schemeCategory10 or HighContrast)
        if (typeof colorScaleScheme[0] === "string") {
            colorScale = colorScaleScheme;
            // Color scheme is two dimensional - so find appropriate set
        }
        else {
            colorScale = colorScaleScheme[numberOfBins];
            // If invalid numberOfBins - use largest set provided by d3
            if (!Array.isArray(colorScale)) {
                colorScale = colorScaleScheme[colorScaleScheme.length - 1];
            }
        }
        return colorScale;
    }
    // TODO: Make TableColorMap use Result to pass warnings up model layer
    invalidColorPaletteWarning() {
        var _a, _b, _c;
        if (((_a = this.colorColumn) === null || _a === void 0 ? void 0 : _a.name) &&
            ((_b = this.colorColumn) === null || _b === void 0 ? void 0 : _b.tableModel.activeStyle) === ((_c = this.colorColumn) === null || _c === void 0 ? void 0 : _c.name)) {
            runLater(() => { var _a, _b; return (_a = this.colorColumn) === null || _a === void 0 ? void 0 : _a.tableModel.terria.raiseErrorToUser(new TerriaError({
                title: "Invalid colorPalette",
                message: `Column ${(_b = this.colorColumn) === null || _b === void 0 ? void 0 : _b.name} has an invalid color palette - \`"${this.colorTraits.colorPalette}"\`.
            Will use default color palette \`"${this.defaultColorPaletteName}"\` instead`
            })); });
        }
    }
}
__decorate([
    computed
], TableColorMap.prototype, "type", null);
__decorate([
    computed
], TableColorMap.prototype, "colorMap", null);
__decorate([
    computed
], TableColorMap.prototype, "binColors", null);
__decorate([
    computed
], TableColorMap.prototype, "binMaximums", null);
__decorate([
    computed
], TableColorMap.prototype, "enumColors", null);
__decorate([
    computed
], TableColorMap.prototype, "outlierColor", null);
__decorate([
    computed
], TableColorMap.prototype, "nullColor", null);
__decorate([
    computed
], TableColorMap.prototype, "regionColor", null);
__decorate([
    computed
], TableColorMap.prototype, "isDiverging", null);
__decorate([
    computed
], TableColorMap.prototype, "defaultColorPaletteName", null);
__decorate([
    computed
], TableColorMap.prototype, "minimumValue", null);
__decorate([
    computed
], TableColorMap.prototype, "maximumValue", null);
__decorate([
    computed
], TableColorMap.prototype, "regionValues", null);
__decorate([
    computed
], TableColorMap.prototype, "validValues", null);
__decorate([
    computed
], TableColorMap.prototype, "validValuesMax", null);
__decorate([
    computed
], TableColorMap.prototype, "validValuesMin", null);
__decorate([
    computed
], TableColorMap.prototype, "zScoreFilterValues", null);
function getMin(array) {
    return array.reduce((a, b) => (b < a ? b : a), Infinity);
}
function getMax(array) {
    return array.reduce((a, b) => (a < b ? b : a), -Infinity);
}
function getMean(array) {
    return array.length === 0
        ? undefined
        : array.reduce((a, b) => a + b) / array.length;
}
// https://stackoverflow.com/a/53577159
function getStandardDeviation(array) {
    const n = array.length;
    const mean = getMean(array);
    return isDefined(mean)
        ? Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
        : undefined;
}
//# sourceMappingURL=TableColorMap.js.map
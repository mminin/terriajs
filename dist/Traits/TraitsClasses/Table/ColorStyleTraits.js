var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../../Decorators/objectArrayTrait";
import objectTrait from "../../Decorators/objectTrait";
import primitiveArrayTrait from "../../Decorators/primitiveArrayTrait";
import primitiveTrait from "../../Decorators/primitiveTrait";
import ModelTraits from "../../ModelTraits";
import LegendTraits from "../LegendTraits";
export class EnumColorTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Value",
        description: "The enumerated value to map to a color.",
        type: "string"
    })
], EnumColorTraits.prototype, "value", void 0);
__decorate([
    primitiveTrait({
        name: "Color",
        description: "The CSS color to use for the enumerated value.",
        type: "string"
    })
], EnumColorTraits.prototype, "color", void 0);
export default class TableColorStyleTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.mapType = undefined;
        this.regionColor = "#02528d";
        this.numberOfBins = 0;
        this.legendTicks = 7;
        this.zScoreFilterEnabled = false;
        this.rangeFilter = 0.3;
    }
}
__decorate([
    primitiveTrait({
        name: "Style map type",
        description: 'The type of style map. Valid values are "continuous", "enum", "bin", "constant"',
        type: "string"
    })
], TableColorStyleTraits.prototype, "mapType", void 0);
__decorate([
    primitiveTrait({
        name: "Color Column",
        description: "The column to use to color points or regions.",
        type: "string"
    })
], TableColorStyleTraits.prototype, "colorColumn", void 0);
__decorate([
    primitiveTrait({
        name: "Null Color",
        description: "The color to use when the value is null, specified as a CSS color string.",
        type: "string"
    })
], TableColorStyleTraits.prototype, "nullColor", void 0);
__decorate([
    primitiveTrait({
        name: "Outlier Color",
        description: "The color to use when the value is lies outside minimumValue and maximumValue (and therefore not shown on color scale), specified as a CSS color string. This only applies to ContinuousColorMap",
        type: "string"
    })
], TableColorStyleTraits.prototype, "outlierColor", void 0);
__decorate([
    primitiveTrait({
        name: "Region Color",
        description: "The color to use when the styling the region, specified as a CSS color string.",
        type: "string"
    })
], TableColorStyleTraits.prototype, "regionColor", void 0);
__decorate([
    primitiveTrait({
        name: "Null Label",
        description: "The label to use in the legend for null values.",
        type: "string"
    })
], TableColorStyleTraits.prototype, "nullLabel", void 0);
__decorate([
    primitiveTrait({
        name: "Outlier Label",
        description: "The label to use in the legend for outlier values.",
        type: "string"
    })
], TableColorStyleTraits.prototype, "outlierLabel", void 0);
__decorate([
    primitiveTrait({
        name: "Minimum value",
        description: "The minimum value to use when creating ColorMaps. This is only applied for `scalar` columns.",
        type: "number"
    })
], TableColorStyleTraits.prototype, "minimumValue", void 0);
__decorate([
    primitiveTrait({
        name: "Maximum value",
        description: "The maximum value to use when creating ColorMaps. This is only applied for `scalar` columns.",
        type: "number"
    })
], TableColorStyleTraits.prototype, "maximumValue", void 0);
__decorate([
    primitiveTrait({
        name: "Number of Bins",
        description: "The number of different colors to bin the data into. This property " +
            "is ignored if `Bin Maximums` is specified for a `scalar` column or " +
            "`Enum Colors` is specified for an `enum` column.",
        type: "number"
    })
], TableColorStyleTraits.prototype, "numberOfBins", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Bin Maximums",
        description: "The maximum values of the bins to bin the data into, specified as an " +
            "array of numbers. The first bin extends from the dataset's minimum " +
            "value to the first value in this array. The second bin extends " +
            "from the first value in this array to the second value in this " +
            "array. And so on. If the maximum value of the dataset is greater " +
            "than the last value in this array, an additional bin is added " +
            "automatically. This property is ignored if the `Color Column` " +
            "is not a scalar.",
        type: "number"
    })
], TableColorStyleTraits.prototype, "binMaximums", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Bin Colors",
        description: "The colors to use for the bins, each specified as a CSS color " +
            "string. If there are more colors than bins, the extra colors are " +
            "ignored. If there are more bins than colors, the colors are repeated " +
            "as necessary.",
        type: "string"
    })
], TableColorStyleTraits.prototype, "binColors", void 0);
__decorate([
    objectArrayTrait({
        name: "Enum Colors",
        description: "The colors to use for enumerated values. This property is ignored " +
            "if the `Color Column` type is not `enum`.",
        type: EnumColorTraits,
        idProperty: "value"
    })
], TableColorStyleTraits.prototype, "enumColors", void 0);
__decorate([
    primitiveTrait({
        name: "Color Palette",
        description: `The name of a [ColorBrewer](http://colorbrewer2.org/) palette to use when mapping values to colors. This property is ignored if \`Bin Colors\` is defined and has enough colors for all bins, or if \`Enum Colors\` is defined. The default value depends on the type of the \`Color Column\` and on the data. Scalar columns that cross zero will use the diverging purple-to-orange palette \`PuOr\`. Scala columns that do not cross zero will use the sequential Red palette \`Reds\`. All other scenarios will use the 21 color \`HighContrast\` palette.
      D3 color schemes are also supported (https://github.com/d3/d3-scale-chromatic) - but without \`scheme\` or \`interpolate\` string (for example - to use \`interpolateViridis\` - set \`colorPalette = Viridis\`).
      This is case sensitive.
      `,
        type: "string"
    })
], TableColorStyleTraits.prototype, "colorPalette", void 0);
__decorate([
    primitiveTrait({
        name: "Legend Ticks",
        description: "The number of tick marks (in addition to the top and bottom) to show on the legend for Continuous color scales",
        type: "number"
    })
], TableColorStyleTraits.prototype, "legendTicks", void 0);
__decorate([
    objectTrait({
        name: "Legend",
        description: "The legend to show with this style. If not specified, a suitable " +
            "is created automatically from the other parameters.",
        type: LegendTraits
    })
], TableColorStyleTraits.prototype, "legend", void 0);
__decorate([
    primitiveTrait({
        name: "Z-score filter",
        description: "Treat values outside of specified z-score as outliers, and therefore do not include in color scale. This value is magnitude of z-score - it will apply to positive and negative z-scores. For example a value of `2` will treat all values that are 2 or more standard deviations from the mean as outliers. This must be defined for it to be enabled. This will be ignored if `minimumValue` or `maximumValue` have been set",
        type: "number"
    })
], TableColorStyleTraits.prototype, "zScoreFilter", void 0);
__decorate([
    primitiveTrait({
        name: "Z-score filter enabled",
        description: "True, if z-score filter is enabled.",
        type: "boolean"
    })
], TableColorStyleTraits.prototype, "zScoreFilterEnabled", void 0);
__decorate([
    primitiveTrait({
        name: "Range filter",
        description: "This is applied after the `zScoreFilter`. It is used to effectively 'disable' the zScoreFilter if it doesn't cut at least the specified percentage of the range of values (for both minimum and maximum value). For example if `rangeFilter = 0.2`, then the zScoreFilter will only be effective if it cuts at least 20% of the range of values from the minimum and maximum value",
        type: "number"
    })
], TableColorStyleTraits.prototype, "rangeFilter", void 0);
//# sourceMappingURL=ColorStyleTraits.js.map
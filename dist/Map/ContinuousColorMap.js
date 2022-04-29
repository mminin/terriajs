import Color from "terriajs-cesium/Source/Core/Color";
import ColorMap from "./ColorMap";
export default class ContinuousColorMap extends ColorMap {
    constructor(options) {
        super();
        if (options.minValue === options.maxValue) {
            throw `Minimum and maximum values must be different.`;
        }
        if (options.minValue > options.maxValue) {
            throw `Minimum value must be less than the maximum value.`;
        }
        this.colorScale = options.colorScale;
        this.nullColor = options.nullColor;
        this.outlierColor = options.outlierColor;
        this.minValue = options.minValue;
        this.maxValue = options.maxValue;
        this.isDivering = options.isDiverging;
        // If color scale is divering
        // We want Math.abs(minValue) === Math.abs(maxValue)
        // This is so the neutral color in the middle of the color map (usually white) is at 0
        if (this.isDivering) {
            this.colorMapMinValue = this.minValue;
            this.colorMapMaxValue = this.maxValue;
            if (-this.colorMapMinValue > this.colorMapMaxValue) {
                this.colorMapMaxValue = -this.colorMapMinValue;
            }
            else {
                this.colorMapMinValue = -this.colorMapMaxValue;
            }
        }
        else {
            this.colorMapMinValue = this.minValue;
            this.colorMapMaxValue = this.maxValue;
        }
    }
    mapValueToColor(value) {
        var _a, _b;
        if (typeof value !== "number") {
            return this.nullColor;
        }
        // Handle value larger than maxValue
        if (value > this.maxValue)
            return (_a = this.outlierColor) !== null && _a !== void 0 ? _a : Color.fromCssColorString(this.colorScale(1));
        // Handle value smaller than minValue
        if (value < this.minValue)
            return (_b = this.outlierColor) !== null && _b !== void 0 ? _b : Color.fromCssColorString(this.colorScale(0));
        return Color.fromCssColorString(this.colorScale((value - this.colorMapMinValue) /
            (this.colorMapMaxValue - this.colorMapMinValue)));
    }
}
//# sourceMappingURL=ContinuousColorMap.js.map
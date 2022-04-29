import Color from "terriajs-cesium/Source/Core/Color";
import ColorMap from "./ColorMap";
export default class DiscreteColorMap extends ColorMap {
    constructor(options) {
        super();
        const includeMinimumInThisBin = [];
        const maximums = [];
        const colors = [];
        options.bins.forEach(bin => {
            maximums.push(bin.maximum);
            includeMinimumInThisBin.push(bin.includeMinimumInThisBin);
            colors.push(Color.clone(bin.color));
        });
        this.includeMinimumInThisBin = [];
        this.maximums = maximums;
        this.colors = colors;
        this.nullColor = Color.clone(options.nullColor);
    }
    mapValueToColor(value) {
        if (typeof value !== "number") {
            return this.nullColor;
        }
        const maximums = this.maximums;
        let i, len;
        for (i = 0, len = maximums.length - 1; i < len && value > maximums[i]; ++i) { }
        // Value may equal maximum, in which case we look at
        // `includeMinimumInThisBin` for the _next_ bin.
        if (value === maximums[i] &&
            i < this.includeMinimumInThisBin.length - 1 &&
            this.includeMinimumInThisBin[i + 1]) {
            ++i;
        }
        return this.colors[i];
    }
}
//# sourceMappingURL=DiscreteColorMap.js.map
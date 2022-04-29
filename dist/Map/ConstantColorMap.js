import ColorMap from "./ColorMap";
import isDefined from "../Core/isDefined";
export default class ConstantColorMap extends ColorMap {
    constructor(options) {
        super();
        this.color = options.color;
        this.title = options.title;
        this.nullColor = options.nullColor;
    }
    mapValueToColor(value) {
        if (this.nullColor && (value === null || !isDefined(value)))
            return this.nullColor;
        return this.color;
    }
}
//# sourceMappingURL=ConstantColorMap.js.map
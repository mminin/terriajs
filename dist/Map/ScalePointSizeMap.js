import PointSizeMap from "./PointSizeMap";
export default class ScalePointSizeMap extends PointSizeMap {
    constructor(minimum, maximum, nullSize, sizeFactor, sizeOffset) {
        super();
        this.minimum = minimum;
        this.maximum = maximum;
        this.nullSize = nullSize;
        this.sizeFactor = sizeFactor;
        this.sizeOffset = sizeOffset;
    }
    mapValueToPointSize(value) {
        if (value === undefined || value === null) {
            return this.nullSize;
        }
        else if (this.maximum === this.minimum) {
            return this.sizeOffset;
        }
        else {
            const normalizedValue = (value - this.minimum) / (this.maximum - this.minimum);
            return normalizedValue * this.sizeFactor + this.sizeOffset;
        }
    }
}
//# sourceMappingURL=ScalePointSizeMap.js.map
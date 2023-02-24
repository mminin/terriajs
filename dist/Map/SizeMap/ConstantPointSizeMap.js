import PointSizeMap from "./PointSizeMap";
export default class ConstantPointSizeMap extends PointSizeMap {
    constructor(pointSize) {
        super();
        this.pointSize = pointSize;
    }
    mapValueToPointSize(value) {
        return this.pointSize;
    }
}
//# sourceMappingURL=ConstantPointSizeMap.js.map
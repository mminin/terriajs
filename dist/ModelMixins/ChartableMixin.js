import { maxBy, minBy } from "lodash-es";
import MappableMixin from "./MappableMixin";
export function calculateDomain(points) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const asNum = (x) => (x instanceof Date ? x.getTime() : x);
    return {
        x: [minBy(xs, asNum) || 0, maxBy(xs, asNum) || 0],
        y: [Math.min(...ys), Math.max(...ys)]
    };
}
export function axesMatch(a1, a2) {
    // ignore unit label if both scales are time
    if (a1.scale === "time" && a2.scale === "time")
        return true;
    else
        return a1.scale === a2.scale && a1.units === a2.units;
}
function ChartableMixin(Base) {
    class ChartableMixin extends MappableMixin(Base) {
        get isChartable() {
            return true;
        }
    }
    return ChartableMixin;
}
(function (ChartableMixin) {
    function isMixedInto(model) {
        return model && model.isChartable;
    }
    ChartableMixin.isMixedInto = isMixedInto;
})(ChartableMixin || (ChartableMixin = {}));
export default ChartableMixin;
//# sourceMappingURL=ChartableMixin.js.map
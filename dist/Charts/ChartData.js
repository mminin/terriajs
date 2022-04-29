import { min as d3ArrayMin, max as d3ArrayMax } from "d3-array";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
/**
 * A container to pass data to a d3 chart: a single series of data points.
 * For documentation on the custom <chart> tag, see lib/Models/registerCustomComponentTypes.js.
 *
 * @param {ChartDataOptions} [options] Further parameters.
 */
export default class ChartData {
    constructor(options) {
        this.points = options.points;
        this.point = undefined;
        this.id = options.id;
        this.categoryName = options.categoryName;
        this.name = options.name;
        this.units = options.units;
        this.getColor = options.getColor;
        this.yAxisMin = options.yAxisMin;
        this.yAxisMax = options.yAxisMax;
        this.type = options.type;
        this.onClick = options.onClick;
        this.showAll = defaultValue(options.showAll, true);
        this.yAxisWidth = 40;
    }
    /**
     * Calculates the min and max x and y of the points.
     * If there are no points, returns undefined.
     * @return {Object} An object {x: [xmin, xmax], y: [ymin, ymax]}.
     */
    getDomain() {
        const points = this.points;
        if (points.length === 0) {
            return undefined;
        }
        return {
            x: [
                d3ArrayMin(points, point => point.x),
                d3ArrayMax(points, point => point.x)
            ],
            y: [
                d3ArrayMin(points, point => point.y),
                d3ArrayMax(points, point => point.y)
            ]
        };
    }
}
//# sourceMappingURL=ChartData.js.map
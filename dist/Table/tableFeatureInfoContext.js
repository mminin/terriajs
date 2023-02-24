import { isTerriaFeatureData } from "../Models/Feature/FeatureData";
/** Adds timeseries chart to feature info context (on terria.timeSeries property).
 * This enables timeseries chart to be used in featureInfoTemplate like so:
 * - default chart = `{{terria.timeSeries.chart}}`
 * - customised chart:
 * ```
 *   <h4>{{terria.timeSeries.title}}</h4>
 *   <chart x-column="{{terria.timeSeries.xName}}"
 *       y-column="{{terria.timeSeries.yName}}"
 *       id="{{terria.timeSeries.id}}"
 *       column-units="{{terria.timeSeries.units}}">
 *           {{terria.timeSeries.data}}
 *   </chart>
 * ```
 */
export const tableFeatureInfoContext = (catalogItem) => (feature) => {
    var _a, _b, _c, _d, _e;
    if (!catalogItem.isSampled)
        return {};
    const style = catalogItem.activeTableStyle;
    // Corresponding row IDs for the selected feature are stored in TerriaFeatureData
    // See createLongitudeLatitudeFeaturePerId, createLongitudeLatitudeFeaturePerRow and createRegionMappedImageryProvider
    const rowIds = isTerriaFeatureData(feature.data)
        ? (_a = feature.data.rowIds) !== null && _a !== void 0 ? _a : [] : [];
    if (!style.timeColumn || !style.colorColumn || rowIds.length < 2)
        return {};
    const chartColumns = [style.timeColumn, style.colorColumn];
    const csvData = [
        chartColumns.map((col) => col.title).join(","),
        ...rowIds.map((i) => chartColumns.map((col) => col.valueFunctionForType(i)).join(","))
    ]
        .join("\n")
        .replace(/\\n/g, "\\n");
    const title = (_b = style.colorColumn) === null || _b === void 0 ? void 0 : _b.title;
    const featureId = feature.id.replace(/\"/g, "");
    const result = {
        terria: {
            timeSeries: {
                title: (_c = style.colorColumn) === null || _c === void 0 ? void 0 : _c.title,
                xName: (_d = style.timeColumn) === null || _d === void 0 ? void 0 : _d.title,
                yName: (_e = style.colorColumn) === null || _e === void 0 ? void 0 : _e.title,
                units: chartColumns.map((column) => column.units || ""),
                id: featureId,
                data: csvData,
                chart: `<chart ${'identifier="' + featureId + '" '} ${title ? `title="${title}"` : ""}>${csvData}</chart>`
            }
        }
    };
    return result;
};
//# sourceMappingURL=tableFeatureInfoContext.js.map
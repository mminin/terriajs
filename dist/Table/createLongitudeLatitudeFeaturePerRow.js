import Cartesian3 from "terriajs-cesium/Source/Core/Cartesian3";
import TimeIntervalCollection from "terriajs-cesium/Source/Core/TimeIntervalCollection";
import BillboardGraphics from "terriajs-cesium/Source/DataSources/BillboardGraphics";
import ConstantPositionProperty from "terriajs-cesium/Source/DataSources/ConstantPositionProperty";
import LabelGraphics from "terriajs-cesium/Source/DataSources/LabelGraphics";
import PointGraphics from "terriajs-cesium/Source/DataSources/PointGraphics";
import PropertyBag from "terriajs-cesium/Source/DataSources/PropertyBag";
import HeightReference from "terriajs-cesium/Source/Scene/HeightReference";
import TerriaFeature from "../Models/Feature/Feature";
import { getFeatureStyle } from "./getFeatureStyle";
export default function createLongitudeLatitudeFeaturePerRow(style, longitudes, latitudes) {
    var _a, _b, _c;
    if (longitudes === void 0) { longitudes = (_a = style.longitudeColumn) === null || _a === void 0 ? void 0 : _a.valuesAsNumbers.values; }
    if (latitudes === void 0) { latitudes = (_b = style.latitudeColumn) === null || _b === void 0 ? void 0 : _b.valuesAsNumbers.values; }
    if (!longitudes || !latitudes)
        return [];
    const tableColumns = style.tableModel.tableColumns;
    const intervals = style.moreThanOneTimeInterval
        ? (_c = style.timeIntervals) !== null && _c !== void 0 ? _c : [] : [];
    const rowIds = style.tableModel.rowIds;
    const features = [];
    for (let i = 0; i < rowIds.length; i++) {
        const rowId = rowIds[i];
        const longitude = longitudes[rowId];
        const latitude = latitudes[rowId];
        if (longitude === null || latitude === null) {
            continue;
        }
        const { pointGraphicsOptions, billboardGraphicsOptions, labelGraphicsOptions, usePointGraphics } = getFeatureStyle(style, rowId);
        const feature = new TerriaFeature({
            position: new ConstantPositionProperty(Cartesian3.fromDegrees(longitude, latitude, 0.0)),
            point: pointGraphicsOptions && usePointGraphics
                ? new PointGraphics({
                    ...pointGraphicsOptions,
                    heightReference: HeightReference.CLAMP_TO_GROUND
                })
                : undefined,
            billboard: billboardGraphicsOptions && !usePointGraphics
                ? new BillboardGraphics({
                    ...billboardGraphicsOptions,
                    heightReference: HeightReference.CLAMP_TO_GROUND
                })
                : undefined,
            label: labelGraphicsOptions
                ? new LabelGraphics({
                    ...labelGraphicsOptions,
                    heightReference: HeightReference.CLAMP_TO_GROUND
                })
                : undefined
            // Note: we don't add path/PathGraphicsOptions here as it is only relevant to time-series (see `createLongitudeLatitudeFeaturePerId.ts`)
        });
        const timeInterval = intervals[rowId];
        if (timeInterval)
            feature.availability = new TimeIntervalCollection([timeInterval]);
        feature.properties = new PropertyBag(getRowValues(rowId, tableColumns));
        feature.data = { rowIds: [rowId], type: "terriaFeatureData" };
        features.push(feature);
    }
    return features;
}
export function getRowValues(index, tableColumns) {
    const result = {};
    tableColumns.forEach((column) => {
        result[column.name] = column.valueFunctionForType(index);
    });
    return result;
}
//# sourceMappingURL=createLongitudeLatitudeFeaturePerRow.js.map
import { action, runInAction } from "mobx";
import Color from "terriajs-cesium/Source/Core/Color";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import TimeInterval from "terriajs-cesium/Source/Core/TimeInterval";
import ImageryLayerFeatureInfo from "terriajs-cesium/Source/Scene/ImageryLayerFeatureInfo";
import isDefined from "../Core/isDefined";
import { isJsonNumber } from "../Core/Json";
import MapboxVectorTileImageryProvider from "../Map/ImageryProvider/MapboxVectorTileImageryProvider";
import { isConstantStyleMap } from "./TableStyleMap";
export default function createRegionMappedImageryProvider(style, currentTime) {
    if (!style.isRegions()) {
        return undefined;
    }
    const regionColumn = style.regionColumn;
    const regionType = regionColumn.regionType;
    if (regionType === undefined) {
        return undefined;
    }
    const colorColumn = style.colorColumn;
    const valueFunction = colorColumn !== undefined ? colorColumn.valueFunctionForType : () => null;
    const colorMap = style.colorMap;
    const valuesAsRegions = regionColumn.valuesAsRegions;
    const outlineStyleMap = style.outlineStyleMap.styleMap;
    let currentTimeRows;
    // If time varying, get row indices which match
    if (currentTime && style.timeIntervals && style.moreThanOneTimeInterval) {
        currentTimeRows = style.timeIntervals.reduce((rows, timeInterval, index) => {
            if (timeInterval && TimeInterval.contains(timeInterval, currentTime)) {
                rows.push(index);
            }
            return rows;
        }, []);
    }
    return new MapboxVectorTileImageryProvider({
        url: regionType.server,
        layerName: regionType.layerName,
        styleFunc: function (feature) {
            var _a, _b;
            const regionId = feature.properties[regionType.uniqueIdProp];
            let rowNumber = getImageryLayerFilteredRow(style, currentTimeRows, valuesAsRegions.regionIdToRowNumbersMap.get(regionId));
            let value = isDefined(rowNumber)
                ? valueFunction(rowNumber)
                : null;
            const color = colorMap.mapValueToColor(value);
            if (color === undefined) {
                return undefined;
            }
            const outlineStyle = isConstantStyleMap(outlineStyleMap)
                ? outlineStyleMap.style
                : outlineStyleMap.mapValueToStyle(rowNumber !== null && rowNumber !== void 0 ? rowNumber : -1);
            const outlineColorValue = Color.fromCssColorString((_a = outlineStyle.color) !== null && _a !== void 0 ? _a : runInAction(() => style.tableModel.terria.baseMapContrastColor));
            return {
                fillStyle: color.toCssColorString(),
                strokeStyle: value !== null ? outlineColorValue.toCssColorString() : "transparent",
                lineWidth: (_b = outlineStyle.width) !== null && _b !== void 0 ? _b : 1,
                lineJoin: "miter"
            };
        },
        subdomains: regionType.serverSubdomains,
        rectangle: Array.isArray(regionType.bbox) && regionType.bbox.length >= 4
            ? Rectangle.fromDegrees(regionType.bbox[0], regionType.bbox[1], regionType.bbox[2], regionType.bbox[3])
            : undefined,
        minimumZoom: regionType.serverMinZoom,
        maximumNativeZoom: regionType.serverMaxNativeZoom,
        maximumZoom: regionType.serverMaxZoom,
        uniqueIdProp: regionType.uniqueIdProp,
        featureInfoFunc: (feature) => getImageryLayerFeatureInfo(style, feature, currentTimeRows)
    });
}
/**
 * Filters row numbers by time (if applicable) - for a given region mapped ImageryLayer
 */
const getImageryLayerFilteredRow = action((style, currentTimeRows, rowNumbers) => {
    if (!isDefined(rowNumbers))
        return;
    if (!isDefined(currentTimeRows)) {
        return Array.isArray(rowNumbers) ? rowNumbers[0] : rowNumbers;
    }
    if (typeof rowNumbers === "number" &&
        currentTimeRows.includes(rowNumbers)) {
        return rowNumbers;
    }
    else if (Array.isArray(rowNumbers)) {
        const matchingTimeRows = rowNumbers.filter((row) => currentTimeRows.includes(row));
        if (matchingTimeRows.length <= 1) {
            return matchingTimeRows[0];
        }
        // In a time-varying dataset, intervals may
        // overlap at their endpoints (i.e. the end of one interval is the start of the next).
        // In that case, we want the later interval to apply.
        return matchingTimeRows.reduce((latestRow, currentRow) => {
            var _a, _b, _c, _d;
            const currentInterval = (_b = (_a = style.timeIntervals) === null || _a === void 0 ? void 0 : _a[currentRow]) === null || _b === void 0 ? void 0 : _b.stop;
            const latestInterval = (_d = (_c = style.timeIntervals) === null || _c === void 0 ? void 0 : _c[latestRow]) === null || _d === void 0 ? void 0 : _d.stop;
            if (currentInterval &&
                latestInterval &&
                JulianDate.lessThan(latestInterval, currentInterval)) {
                return currentRow;
            }
            return latestRow;
        }, matchingTimeRows[0]);
    }
});
/**
 * Get ImageryLayerFeatureInfo for a given ImageryLayer input and feature.
 */
const getImageryLayerFeatureInfo = action((style, feature, currentTimeRows) => {
    var _a, _b, _c;
    if (isDefined((_b = (_a = style.regionColumn) === null || _a === void 0 ? void 0 : _a.regionType) === null || _b === void 0 ? void 0 : _b.uniqueIdProp)) {
        const regionType = style.regionColumn.regionType;
        const regionRows = (_c = style.regionColumn.valuesAsRegions.regionIdToRowNumbersMap.get(feature.properties[regionType.uniqueIdProp])) !== null && _c !== void 0 ? _c : [];
        const rowId = getImageryLayerFilteredRow(style, currentTimeRows, regionRows);
        if (!isDefined(rowId))
            return;
        style.tableModel.tableColumns;
        const rowObject = style.tableModel.tableColumns.reduce((obj, column) => {
            obj[column.name] = column.valueFunctionForType(rowId);
            return obj;
        }, {});
        // Preserve values from d and insert feature properties after entries from d
        const featureData = Object.assign({}, rowObject, feature.properties, rowObject);
        const featureInfo = new ImageryLayerFeatureInfo();
        if (isDefined(regionType.nameProp)) {
            featureInfo.name = featureData[regionType.nameProp];
        }
        featureData.id = feature.properties[regionType.uniqueIdProp];
        featureInfo.properties = featureData;
        const terriaFeatureData = {
            rowIds: isJsonNumber(regionRows) ? [regionRows] : [...regionRows],
            type: "terriaFeatureData"
        };
        featureInfo.data = terriaFeatureData;
        featureInfo.configureDescriptionFromProperties(featureData);
        featureInfo.configureNameFromProperties(featureData);
        return featureInfo;
    }
    return undefined;
});
//# sourceMappingURL=createRegionMappedImageryProvider.js.map
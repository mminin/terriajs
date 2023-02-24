import Cartesian2 from "terriajs-cesium/Source/Core/Cartesian2";
import Color from "terriajs-cesium/Source/Core/Color";
import CesiumMath from "terriajs-cesium/Source/Core/Math";
import HorizontalOrigin from "terriajs-cesium/Source/Scene/HorizontalOrigin";
import LabelStyle from "terriajs-cesium/Source/Scene/LabelStyle";
import VerticalOrigin from "terriajs-cesium/Source/Scene/VerticalOrigin";
import { getMakiIcon, isMakiIcon } from "../Map/Icons/Maki/MakiIcons";
import { isConstantStyleMap } from "./TableStyleMap";
/** For given TableStyle and rowId, return feature styling in a "cesium-friendly" format.
 * It returns style options for the following
 * - PointGraphics (for point marker)
 * - BillboardGraphics (for custom marker)
 * - PathGraphics (referred to as "trail" in Traits system)
 * - LabelGraphics
 * - `usePointGraphics` flag - whether to use PointGraphics or BillboardGraphics for marker symbology
 */
export function getFeatureStyle(style, rowId) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    // Convert TablePointStyleTraits, TableColorStyleTraits, TableOutlineStyleTraits and TablePointSizeStyleTraits into
    // - PointGraphics options
    // - BillboardGraphics options
    // - makiIcon SVG string (used in BillboardGraphics options)
    const color = (_b = style.colorMap.mapValueToColor((_a = style.colorColumn) === null || _a === void 0 ? void 0 : _a.valuesForType[rowId])) !== null && _b !== void 0 ? _b : null;
    const pointSize = style.pointSizeColumn !== undefined
        ? style.pointSizeMap.mapValueToPointSize(style.pointSizeColumn.valueFunctionForType(rowId))
        : undefined;
    const pointStyle = style.pointStyleMap.traits.enabled
        ? isConstantStyleMap(style.pointStyleMap.styleMap)
            ? style.pointStyleMap.styleMap.style
            : style.pointStyleMap.styleMap.mapValueToStyle(rowId)
        : undefined;
    const outlineStyle = style.outlineStyleMap.traits.enabled
        ? isConstantStyleMap(style.outlineStyleMap.styleMap)
            ? style.outlineStyleMap.styleMap.style
            : style.outlineStyleMap.styleMap.mapValueToStyle(rowId)
        : undefined;
    // If no outline color is defined in traits, use current basemap contrast color
    const outlineColor = outlineStyle
        ? Color.fromCssColorString((_c = outlineStyle.color) !== null && _c !== void 0 ? _c : style.tableModel.terria.baseMapContrastColor)
        : undefined;
    const pointGraphicsOptions = pointStyle
        ? {
            color: color,
            pixelSize: (_d = pointSize !== null && pointSize !== void 0 ? pointSize : pointStyle === null || pointStyle === void 0 ? void 0 : pointStyle.height) !== null && _d !== void 0 ? _d : pointStyle === null || pointStyle === void 0 ? void 0 : pointStyle.width
        }
        : undefined;
    if (pointGraphicsOptions && outlineStyle && outlineColor) {
        pointGraphicsOptions.outlineWidth = outlineStyle.width;
        pointGraphicsOptions.outlineColor = outlineColor;
    }
    // This returns SVG string
    const makiIcon = pointStyle
        ? getMakiIcon((_e = pointStyle.marker) !== null && _e !== void 0 ? _e : "circle", color.toCssColorString(), outlineStyle === null || outlineStyle === void 0 ? void 0 : outlineStyle.width, outlineColor === null || outlineColor === void 0 ? void 0 : outlineColor.toCssColorString(), (_f = pointSize !== null && pointSize !== void 0 ? pointSize : pointStyle.height) !== null && _f !== void 0 ? _f : 24, (_g = pointSize !== null && pointSize !== void 0 ? pointSize : pointStyle.width) !== null && _g !== void 0 ? _g : 24)
        : undefined;
    const billboardGraphicsOptions = pointStyle
        ? {
            image: makiIcon !== null && makiIcon !== void 0 ? makiIcon : pointStyle.marker,
            // Only add color property for non maki icons - as we color maki icons directly (see `makiIcon = getMakiIcon(...)`)
            color: !makiIcon ? color : Color.WHITE,
            width: pointSize !== null && pointSize !== void 0 ? pointSize : pointStyle.width,
            height: pointSize !== null && pointSize !== void 0 ? pointSize : pointStyle.height,
            // Convert clockwise degrees to counter-clockwise radians
            rotation: CesiumMath.toRadians(360 - ((_h = pointStyle.rotation) !== null && _h !== void 0 ? _h : 0)),
            pixelOffset: new Cartesian2((_j = pointStyle.pixelOffset) === null || _j === void 0 ? void 0 : _j[0], (_k = pointStyle.pixelOffset) === null || _k === void 0 ? void 0 : _k[1])
        }
        : undefined;
    // Convert TableTrailStyleTraits into PathGraphics options
    // We also have two supported materials
    // - PolylineGlowMaterialTraits -> PolylineGlowMaterial options
    // - SolidColorMaterialTraits -> ColorMaterialProperty options
    const trailStyle = style.trailStyleMap.traits.enabled
        ? isConstantStyleMap(style.trailStyleMap.styleMap)
            ? style.trailStyleMap.styleMap.style
            : style.trailStyleMap.styleMap.mapValueToStyle(rowId)
        : undefined;
    const pathGraphicsOptions = trailStyle;
    const pathGraphicsSolidColorOptions = (trailStyle === null || trailStyle === void 0 ? void 0 : trailStyle.solidColor) ? {
        color: Color.fromCssColorString(trailStyle.solidColor.color)
    }
        : undefined;
    const pathGraphicsPolylineGlowOptions = (trailStyle === null || trailStyle === void 0 ? void 0 : trailStyle.polylineGlow) ? {
        ...trailStyle.polylineGlow,
        color: Color.fromCssColorString(trailStyle.polylineGlow.color)
    }
        : undefined;
    // Convert TableLabelStyleTraits to LabelGraphics options
    const labelStyle = style.labelStyleMap.traits.enabled
        ? isConstantStyleMap(style.labelStyleMap.styleMap)
            ? style.labelStyleMap.styleMap.style
            : style.labelStyleMap.styleMap.mapValueToStyle(rowId)
        : undefined;
    const labelGraphicsOptions = labelStyle
        ? {
            ...labelStyle,
            text: (_l = style.tableModel.tableColumns.find((col) => col.name === labelStyle.labelColumn)) === null || _l === void 0 ? void 0 : _l.values[rowId],
            style: labelStyle.style === "OUTLINE"
                ? LabelStyle.OUTLINE
                : labelStyle.style === "FILL_AND_OUTLINE"
                    ? LabelStyle.FILL_AND_OUTLINE
                    : LabelStyle.FILL,
            fillColor: Color.fromCssColorString(labelStyle.fillColor),
            outlineColor: Color.fromCssColorString(labelStyle.outlineColor),
            pixelOffset: new Cartesian2(labelStyle.pixelOffset[0], labelStyle.pixelOffset[1]),
            verticalOrigin: labelStyle.verticalOrigin === "TOP"
                ? VerticalOrigin.TOP
                : labelStyle.verticalOrigin === "BOTTOM"
                    ? VerticalOrigin.BOTTOM
                    : labelStyle.verticalOrigin === "BASELINE"
                        ? VerticalOrigin.BASELINE
                        : VerticalOrigin.CENTER,
            horizontalOrigin: labelStyle.horizontalOrigin === "CENTER"
                ? HorizontalOrigin.CENTER
                : labelStyle.horizontalOrigin === "RIGHT"
                    ? HorizontalOrigin.RIGHT
                    : HorizontalOrigin.LEFT
        }
        : undefined;
    return {
        labelGraphicsOptions,
        pointGraphicsOptions,
        pathGraphicsOptions,
        pathGraphicsSolidColorOptions,
        pathGraphicsPolylineGlowOptions,
        billboardGraphicsOptions,
        /** Use PointGraphics instead of BillboardGraphics, if not using maki icon AND not using image marker. */
        usePointGraphics: !isMakiIcon(pointStyle === null || pointStyle === void 0 ? void 0 : pointStyle.marker) &&
            !((_m = pointStyle === null || pointStyle === void 0 ? void 0 : pointStyle.marker) === null || _m === void 0 ? void 0 : _m.startsWith("data:image"))
    };
}
//# sourceMappingURL=getFeatureStyle.js.map
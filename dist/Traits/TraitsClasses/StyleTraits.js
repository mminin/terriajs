var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class StyleTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "marker-size",
        description: "Marker size. Valid values are `small`, `medium`, or `large`. If the " +
            "value is a number, it is the size in pixels."
    })
], StyleTraits.prototype, "marker-size", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "marker-color",
        description: "Marker color"
    })
], StyleTraits.prototype, "marker-color", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "marker-symbol",
        description: "Marker symbol."
    })
], StyleTraits.prototype, "marker-symbol", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "marker-opacity",
        description: "Marker opacity."
    })
], StyleTraits.prototype, "marker-opacity", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "marker-url",
        description: "Marker URL."
    })
], StyleTraits.prototype, "marker-url", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "stroke",
        description: "Stroke color."
    })
], StyleTraits.prototype, "stroke", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "stroke-opacity",
        description: "Stroke opacity."
    })
], StyleTraits.prototype, "stroke-opacity", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "stroke-width",
        description: "Stroke width."
    })
], StyleTraits.prototype, "stroke-width", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "marker-stroke-width",
        description: "Marker stroke width. (This is will override stroke-width for Point geojson-vt features) - not apart of simplestyle-spec and will not apply to cesium primitives"
    })
], StyleTraits.prototype, "marker-stroke-width", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "polyline-stroke-width",
        description: "Polyline stroke width. (This is will override stroke-width for Polyline geojson-vt features) - not apart of simplestyle-spec and will not apply to cesium primitives"
    })
], StyleTraits.prototype, "polyline-stroke-width", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "polygon-stroke-width",
        description: "Polygon stroke width. (This is will override stroke-width for Polygon geojson-vt features) - not apart of simplestyle-spec and will not apply to cesium primitives"
    })
], StyleTraits.prototype, "polygon-stroke-width", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "fill",
        description: "Fill color."
    })
], StyleTraits.prototype, "fill", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "fill-opacity",
        description: "Fill opacity."
    })
], StyleTraits.prototype, "fill-opacity", void 0);
//# sourceMappingURL=StyleTraits.js.map
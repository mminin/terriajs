var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import ClippingPlanesTraits from "./ClippingPlanesTraits";
import HighlightColorTraits from "./HighlightColorTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import OpacityTraits from "./OpacityTraits";
import PlaceEditorTraits from "./PlaceEditorTraits";
import ShadowTraits from "./ShadowTraits";
import SplitterTraits from "./SplitterTraits";
import TransformationTraits from "./TransformationTraits";
import UrlTraits from "./UrlTraits";
import FeaturePickingTraits from "./FeaturePickingTraits";
export class FilterTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Name",
        description: "A name for the filter"
    })
], FilterTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "property",
        description: "The name of the feature property to filter"
    })
], FilterTraits.prototype, "property", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "minimumValue",
        description: "Minimum value of the property"
    })
], FilterTraits.prototype, "minimumValue", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "minimumValue",
        description: "Minimum value of the property"
    })
], FilterTraits.prototype, "maximumValue", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "minimumShown",
        description: "The lowest value the property can have if it is to be shown"
    })
], FilterTraits.prototype, "minimumShown", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "minimumValue",
        description: "The largest value the property can have if it is to be shown"
    })
], FilterTraits.prototype, "maximumShown", void 0);
export class PointCloudShadingTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Attenuation",
        description: "Perform point attenuation based on geometric error."
    })
], PointCloudShadingTraits.prototype, "attenuation", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "geometricErrorScale",
        description: "Scale to be applied to each tile's geometric error."
    })
], PointCloudShadingTraits.prototype, "geometricErrorScale", void 0);
export class OptionsTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum screen space error",
        description: "The maximum screen space error used to drive level of detail refinement."
    })
], OptionsTraits.prototype, "maximumScreenSpaceError", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum number of loaded tiles",
        description: ""
    })
], OptionsTraits.prototype, "maximumNumberOfLoadedTiles", void 0);
__decorate([
    objectTrait({
        type: PointCloudShadingTraits,
        name: "Point cloud shading",
        description: "Point cloud shading parameters"
    })
], OptionsTraits.prototype, "pointCloudShading", void 0);
export default class Cesium3DTilesTraits extends mixTraits(HighlightColorTraits, PlaceEditorTraits, TransformationTraits, FeaturePickingTraits, MappableTraits, UrlTraits, CatalogMemberTraits, ShadowTraits, OpacityTraits, LegendOwnerTraits, ShadowTraits, ClippingPlanesTraits, SplitterTraits) {
    constructor() {
        super(...arguments);
        this.colorBlendMode = "MIX";
        this.colorBlendAmount = 0.5;
    }
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Ion asset ID",
        description: "The Cesium Ion asset id."
    })
], Cesium3DTilesTraits.prototype, "ionAssetId", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Ion access token",
        description: "Cesium Ion access token id."
    })
], Cesium3DTilesTraits.prototype, "ionAccessToken", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Ion server",
        description: "URL of the Cesium Ion API server."
    })
], Cesium3DTilesTraits.prototype, "ionServer", void 0);
__decorate([
    objectTrait({
        type: OptionsTraits,
        name: "options",
        description: "Additional options to pass to Cesium's Cesium3DTileset constructor."
    })
], Cesium3DTilesTraits.prototype, "options", void 0);
__decorate([
    anyTrait({
        name: "style",
        description: "The style to use, specified according to the [Cesium 3D Tiles Styling Language](https://github.com/AnalyticalGraphicsInc/3d-tiles/tree/master/specification/Styling)."
    })
], Cesium3DTilesTraits.prototype, "style", void 0);
__decorate([
    objectArrayTrait({
        type: FilterTraits,
        idProperty: "name",
        name: "filters",
        description: "The filters to apply to this catalog item."
    })
], Cesium3DTilesTraits.prototype, "filters", void 0);
__decorate([
    primitiveTrait({
        name: "Color blend mode",
        type: "string",
        description: "The color blend mode decides how per-feature color is blended with color defined in the tileset. Acceptable values are HIGHLIGHT, MIX & REPLACE as defined in the cesium documentation - https://cesium.com/docs/cesiumjs-ref-doc/Cesium3DTileColorBlendMode.html"
    })
], Cesium3DTilesTraits.prototype, "colorBlendMode", void 0);
__decorate([
    primitiveTrait({
        name: "Color blend amount",
        type: "number",
        description: "When the colorBlendMode is MIX this value is used to interpolate between source color and feature color. A value of 0.0 results in the source color while a value of 1.0 results in the feature color, with any value in-between resulting in a mix of the source color and feature color."
    })
], Cesium3DTilesTraits.prototype, "colorBlendAmount", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Feature ID properties",
        type: "string",
        description: "One or many properties of a feature that together identify it uniquely. This is useful for setting properties for individual features. eg: ['lat', 'lon'], ['buildingId'] etc."
    })
], Cesium3DTilesTraits.prototype, "featureIdProperties", void 0);
//# sourceMappingURL=Cesium3dTilesTraits.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import LatLonHeightTraits from "./LatLonHeightTraits";
import BoxDrawingTraits from "../BoxDrawingTraits";
import mixTraits from "../mixTraits";
export class ClippingPlaneDefinitionTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.distance = 0;
        this.normal = [];
    }
}
__decorate([
    primitiveTrait({
        name: "Distance",
        type: "number",
        description: " The shortest distance from the origin to the plane. The sign of distance determines which side of the plane the origin is on. If distance is positive, the origin is in the half-space in the direction of the normal; if negative, the origin is in the half-space opposite to the normal; if zero, the plane passes through the origin."
    })
], ClippingPlaneDefinitionTraits.prototype, "distance", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Normal Cartesian3",
        type: "number",
        description: "The plane's normal (normalized)."
    })
], ClippingPlaneDefinitionTraits.prototype, "normal", void 0);
export class ClippingPlaneCollectionTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.enabled = true;
        this.unionClippingRegions = false;
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Enabled Clipping Plane",
        description: "Determines whether the clipping planes are active."
    })
], ClippingPlaneCollectionTraits.prototype, "enabled", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "UnionClippingRegions",
        description: "If true, a region will be clipped if it is on the outside of any plane in the collection. Otherwise, a region will only be clipped if it is on the outside of every plane."
    })
], ClippingPlaneCollectionTraits.prototype, "unionClippingRegions", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Edge Width",
        description: "The width, in pixels, of the highlight applied to the edge along which an object is clipped."
    })
], ClippingPlaneCollectionTraits.prototype, "edgeWidth", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Edge Color",
        description: "The color applied to highlight the edge along which an object is clipped."
    })
], ClippingPlaneCollectionTraits.prototype, "edgeColor", void 0);
__decorate([
    objectArrayTrait({
        type: ClippingPlaneDefinitionTraits,
        name: "Clipping Plane Array",
        description: "An array of ClippingPlane objects used to selectively disable rendering on the outside of each plane.",
        idProperty: "index"
    })
], ClippingPlaneCollectionTraits.prototype, "planes", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Model Matrix",
        type: "number",
        description: "The 4x4 transformation matrix specifying an additional transform relative to the clipping planes original coordinate system."
    })
], ClippingPlaneCollectionTraits.prototype, "modelMatrix", void 0);
export class ClippingBoxDimensionTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Length",
        description: "Length of the clipping box (along the x-axis)."
    })
], ClippingBoxDimensionTraits.prototype, "length", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Length",
        description: "Width of the clipping box (along the y-axis)."
    })
], ClippingBoxDimensionTraits.prototype, "width", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Length",
        description: "Height of the clipping box."
    })
], ClippingBoxDimensionTraits.prototype, "height", void 0);
export class ClippingBoxTraits extends mixTraits(BoxDrawingTraits) {
    constructor() {
        super(...arguments);
        this.enableFeature = true;
        this.clipModel = false;
        this.showClippingBox = true;
        this.keepBoxAboveGround = true;
        this.clipDirection = "inside";
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Enable clipping box features",
        description: "Set false to completely disable clipping box feature for the item."
    })
], ClippingBoxTraits.prototype, "enableFeature", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Toggle model clipping.",
        description: "Applies clipping when true."
    })
], ClippingBoxTraits.prototype, "clipModel", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Show clipping box",
        description: "Shows a 3D box and associated UI for editing the clip volume."
    })
], ClippingBoxTraits.prototype, "showClippingBox", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Keep clipping box above ground",
        description: "When true, prevents the box from going underground."
    })
], ClippingBoxTraits.prototype, "keepBoxAboveGround", void 0);
__decorate([
    objectTrait({
        type: LatLonHeightTraits,
        name: "position",
        description: "Latitude, longitude and height of the clipping box. When not set, the box is positioned at the center of the screen."
    })
], ClippingBoxTraits.prototype, "position", void 0);
__decorate([
    objectTrait({
        type: ClippingBoxDimensionTraits,
        name: "Dimensions",
        description: "The length, width and height of the clipping box. When not set, the box will be 1/3rd the screen size."
    })
], ClippingBoxTraits.prototype, "dimensions", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Clip direction",
        description: `Whether to clip the model outside of the box or inside. When this value is "outside", everything outside the box is clipped and when the value is "inside", everything inside the box is clipped. Default value is "inside"`
    })
], ClippingBoxTraits.prototype, "clipDirection", void 0);
export default class ClippingPlanesTraits extends ModelTraits {
}
__decorate([
    objectTrait({
        type: ClippingPlaneCollectionTraits,
        name: "ClippingPlanes",
        description: "The ClippingPlaneCollection used to selectively disable rendering the tileset."
    })
], ClippingPlanesTraits.prototype, "clippingPlanes", void 0);
__decorate([
    objectTrait({
        type: ClippingBoxTraits,
        name: "Clipping box",
        description: "Defines a user controllable clipping box used to hide or show sections of a model."
    })
], ClippingPlanesTraits.prototype, "clippingBox", void 0);
//# sourceMappingURL=ClippingPlanesTraits.js.map
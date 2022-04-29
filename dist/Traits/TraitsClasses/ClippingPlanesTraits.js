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
export default class ClippingPlanesTraits extends ModelTraits {
}
__decorate([
    objectTrait({
        type: ClippingPlaneCollectionTraits,
        name: "ClippingPlanes",
        description: "The ClippingPlaneCollection used to selectively disable rendering the tileset."
    })
], ClippingPlanesTraits.prototype, "clippingPlanes", void 0);
//# sourceMappingURL=ClippingPlanesTraits.js.map
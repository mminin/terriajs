var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../../Decorators/objectArrayTrait";
import objectTrait from "../../Decorators/objectTrait";
import primitiveTrait from "../../Decorators/primitiveTrait";
import mixTraits from "../../mixTraits";
import ModelTraits from "../../ModelTraits";
import { BinStyleTraits, EnumStyleTraits, TableStyleMapSymbolTraits, TableStyleMapTraits } from "./StyleMapTraits";
/** Supports CZML SolidColorMaterial https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/SolidColorMaterial */
export class SolidColorMaterialTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.color = "#ffffff";
    }
}
__decorate([
    primitiveTrait({
        name: "Color",
        description: "The color.",
        type: "string"
    })
], SolidColorMaterialTraits.prototype, "color", void 0);
/** Supports CZML PolylineGlowMaterial https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/PolylineGlowMaterial */
export class PolylineGlowMaterialTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.color = "#ffffff";
        this.glowPower = 0.25;
        this.taperPower = 1;
    }
}
__decorate([
    primitiveTrait({
        name: "Color",
        description: "The color.",
        type: "string"
    })
], PolylineGlowMaterialTraits.prototype, "color", void 0);
__decorate([
    primitiveTrait({
        name: "Glow power",
        description: "The strength of the glow, as a percentage of the total line width.",
        type: "number"
    })
], PolylineGlowMaterialTraits.prototype, "glowPower", void 0);
__decorate([
    primitiveTrait({
        name: "Glow taper power",
        description: "The strength of the glow tapering effect, as a percentage of the total line length. If 1.0 or higher, no taper effect is used.",
        type: "number"
    })
], PolylineGlowMaterialTraits.prototype, "taperPower", void 0);
/** Supports subset of CZML PolylineMaterial https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/PolylineMaterial
 *
 * Unimplemented materials
 * - polylineOutline
 * - polylineArrow
 * - polylineDash
 * - image
 * - grid
 * - stripe
 * - checkerboard
 */
export class PolylineMaterialTraits extends ModelTraits {
}
__decorate([
    objectTrait({
        type: PolylineGlowMaterialTraits,
        name: "Polyline glow material",
        description: 'Polyline glow material. Must also set `materialType = "polylineGlow"`'
    })
], PolylineMaterialTraits.prototype, "polylineGlow", void 0);
__decorate([
    objectTrait({
        type: SolidColorMaterialTraits,
        name: "Solid color material",
        description: "Solid color material."
    })
], PolylineMaterialTraits.prototype, "solidColor", void 0);
/** Supports subset of CZML Path https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/Path
 *
 * Unimplemented properties
 * - show
 * - distanceDisplayCondition
 *
 * Note: materials is handled slightly differently
 */
export class TrailSymbolTraits extends mixTraits(PolylineMaterialTraits, TableStyleMapSymbolTraits) {
    constructor() {
        super(...arguments);
        this.leadTime = 0;
        this.trailTime = 10;
        this.width = 1;
        this.resolution = 60;
    }
}
__decorate([
    primitiveTrait({
        name: "Lead time",
        description: "The number of seconds in front of the object to show.",
        type: "number"
    })
], TrailSymbolTraits.prototype, "leadTime", void 0);
__decorate([
    primitiveTrait({
        name: "Trail time",
        description: "The number of seconds behind the object to show.",
        type: "number"
    })
], TrailSymbolTraits.prototype, "trailTime", void 0);
__decorate([
    primitiveTrait({
        name: "Width",
        description: "The width in pixels.",
        type: "number"
    })
], TrailSymbolTraits.prototype, "width", void 0);
__decorate([
    primitiveTrait({
        name: "Resolution",
        description: "The maximum number of seconds to step when sampling the position.",
        type: "number"
    })
], TrailSymbolTraits.prototype, "resolution", void 0);
export class EnumTrailSymbolTraits extends mixTraits(TrailSymbolTraits, EnumStyleTraits) {
}
EnumTrailSymbolTraits.isRemoval = EnumStyleTraits.isRemoval;
export class BinTrailSymbolTraits extends mixTraits(TrailSymbolTraits, BinStyleTraits) {
}
BinTrailSymbolTraits.isRemoval = BinStyleTraits.isRemoval;
export default class TableTrailStyleTraits extends mixTraits(TableStyleMapTraits) {
    constructor() {
        super(...arguments);
        // Override TableStyleMapTraits.enabled default
        this.enabled = false;
        this.materialType = "solidColor";
        this.enum = [];
        this.bin = [];
        this.null = new TrailSymbolTraits();
    }
}
__decorate([
    primitiveTrait({
        name: "Enabled",
        description: "True to enable. False by default",
        type: "boolean"
    })
], TableTrailStyleTraits.prototype, "enabled", void 0);
__decorate([
    primitiveTrait({
        name: "Material type",
        description: "The type of material to use. Possible values: `solidColor` and `polylineGlow`. Default is `solidColor`",
        type: "string"
    })
], TableTrailStyleTraits.prototype, "materialType", void 0);
__decorate([
    objectArrayTrait({
        name: "Enum Colors",
        description: "The colors to use for enumerated values. This property is ignored " +
            "if the `Color Column` type is not `enum`.",
        type: EnumTrailSymbolTraits,
        idProperty: "value"
    })
], TableTrailStyleTraits.prototype, "enum", void 0);
__decorate([
    objectArrayTrait({
        name: "Enum Colors",
        description: "The colors to use for enumerated values. This property is ignored " +
            "if the `Color Column` type is not `enum`.",
        type: BinTrailSymbolTraits,
        idProperty: "index"
    })
], TableTrailStyleTraits.prototype, "bin", void 0);
__decorate([
    objectTrait({
        name: "Enum Colors",
        description: "The colors to use for enumerated values. This property is ignored " +
            "if the `Color Column` type is not `enum`.",
        type: TrailSymbolTraits
    })
], TableTrailStyleTraits.prototype, "null", void 0);
//# sourceMappingURL=TrailStyleTraits.js.map
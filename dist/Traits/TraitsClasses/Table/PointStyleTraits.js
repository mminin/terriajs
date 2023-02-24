var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../../Decorators/objectArrayTrait";
import objectTrait from "../../Decorators/objectTrait";
import primitiveArrayTrait from "../../Decorators/primitiveArrayTrait";
import primitiveTrait from "../../Decorators/primitiveTrait";
import mixTraits from "../../mixTraits";
import { BinStyleTraits, EnumStyleTraits, TableStyleMapSymbolTraits, TableStyleMapTraits } from "./StyleMapTraits";
export class PointSymbolTraits extends mixTraits(TableStyleMapSymbolTraits) {
    constructor() {
        super(...arguments);
        this.marker = "point";
        this.rotation = 0;
        this.height = 16;
        this.width = 16;
    }
}
__decorate([
    primitiveTrait({
        name: "Marker (icon)",
        description: 'Marker used to symbolize points. Default is "point"/"circle". This can be data URI or one of the supported [Maki icons](https://labs.mapbox.com/maki-icons/) (eg "hospital")',
        type: "string"
    })
], PointSymbolTraits.prototype, "marker", void 0);
__decorate([
    primitiveTrait({
        name: "Rotation",
        description: "Rotation of marker in degrees (clockwise).",
        type: "number"
    })
], PointSymbolTraits.prototype, "rotation", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Pixel offset",
        description: "Pixel offset in screen space from the origin. [x, y] format",
        type: "number"
    })
], PointSymbolTraits.prototype, "pixelOffset", void 0);
__decorate([
    primitiveTrait({
        name: "Height",
        description: "Height of the marker (in pixels).",
        type: "number"
    })
], PointSymbolTraits.prototype, "height", void 0);
__decorate([
    primitiveTrait({
        name: "Width",
        description: "Width of the marker (in pixels).",
        type: "number"
    })
], PointSymbolTraits.prototype, "width", void 0);
export class EnumPointSymbolTraits extends mixTraits(PointSymbolTraits, EnumStyleTraits) {
}
EnumPointSymbolTraits.isRemoval = EnumStyleTraits.isRemoval;
export class BinPointSymbolTraits extends mixTraits(PointSymbolTraits, BinStyleTraits) {
}
BinPointSymbolTraits.isRemoval = BinStyleTraits.isRemoval;
export default class TablePointStyleTraits extends mixTraits(TableStyleMapTraits) {
    constructor() {
        super(...arguments);
        this.enum = [];
        this.bin = [];
        this.null = new PointSymbolTraits();
    }
}
__decorate([
    objectArrayTrait({
        name: "Enum point styles",
        description: "The point style to use for enumerated values.",
        type: EnumPointSymbolTraits,
        idProperty: "index"
    })
], TablePointStyleTraits.prototype, "enum", void 0);
__decorate([
    objectArrayTrait({
        name: "Bin point styles",
        description: "The point style to use for bin values.",
        type: BinPointSymbolTraits,
        idProperty: "index"
    })
], TablePointStyleTraits.prototype, "bin", void 0);
__decorate([
    objectTrait({
        name: "Enum Colors",
        description: "The default point style.",
        type: PointSymbolTraits
    })
], TablePointStyleTraits.prototype, "null", void 0);
//# sourceMappingURL=PointStyleTraits.js.map
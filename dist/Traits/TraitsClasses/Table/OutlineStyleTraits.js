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
import { BinStyleTraits, EnumStyleTraits, TableStyleMapSymbolTraits, TableStyleMapTraits } from "./StyleMapTraits";
export class OutlineSymbolTraits extends mixTraits(TableStyleMapSymbolTraits) {
    constructor() {
        super(...arguments);
        this.width = 1;
    }
}
__decorate([
    primitiveTrait({
        name: "Color",
        description: "Outline color.",
        type: "string"
    })
], OutlineSymbolTraits.prototype, "color", void 0);
__decorate([
    primitiveTrait({
        name: "Width",
        description: "Outline width (in pixels).",
        type: "number"
    })
], OutlineSymbolTraits.prototype, "width", void 0);
export class EnumOutlineSymbolTraits extends mixTraits(OutlineSymbolTraits, EnumStyleTraits) {
}
EnumOutlineSymbolTraits.isRemoval = EnumStyleTraits.isRemoval;
export class BinOutlineSymbolTraits extends mixTraits(OutlineSymbolTraits, BinStyleTraits) {
}
BinOutlineSymbolTraits.isRemoval = BinStyleTraits.isRemoval;
export default class TableOutlineStyleTraits extends mixTraits(TableStyleMapTraits) {
    constructor() {
        super(...arguments);
        this.enum = [];
        this.bin = [];
        this.null = new OutlineSymbolTraits();
    }
}
__decorate([
    objectArrayTrait({
        name: "Enum Colors",
        description: "The outline style to use for enumerated values.",
        type: EnumOutlineSymbolTraits,
        idProperty: "value"
    })
], TableOutlineStyleTraits.prototype, "enum", void 0);
__decorate([
    objectArrayTrait({
        name: "Enum Colors",
        description: "The outline style to use for bin values.",
        type: BinOutlineSymbolTraits,
        idProperty: "index"
    })
], TableOutlineStyleTraits.prototype, "bin", void 0);
__decorate([
    objectTrait({
        name: "Enum Colors",
        description: "The default outline style.",
        type: OutlineSymbolTraits
    })
], TableOutlineStyleTraits.prototype, "null", void 0);
//# sourceMappingURL=OutlineStyleTraits.js.map
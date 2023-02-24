var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
export class DimensionOptionTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "ID",
        description: "Option ID"
    })
], DimensionOptionTraits.prototype, "id", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Name",
        description: "Option name (human-readable)"
    })
], DimensionOptionTraits.prototype, "name", void 0);
__decorate([
    anyTrait({
        name: "Value",
        description: "Value (if this is undefined, `id` will be used)"
    })
], DimensionOptionTraits.prototype, "value", void 0);
export default class EnumDimensionTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "ID",
        description: "Dimension ID"
    })
], EnumDimensionTraits.prototype, "id", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Name",
        description: "Dimension name (human-readable)"
    })
], EnumDimensionTraits.prototype, "name", void 0);
__decorate([
    objectArrayTrait({
        type: DimensionOptionTraits,
        idProperty: "id",
        name: "Options",
        description: "Dimension options"
    })
], EnumDimensionTraits.prototype, "options", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Selected ID",
        description: "Selected Option's ID"
    })
], EnumDimensionTraits.prototype, "selectedId", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Allow undefined",
        description: "Allow dimension to be undefined"
    })
], EnumDimensionTraits.prototype, "allowUndefined", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Disable dimension",
        description: "Hides dimension"
    })
], EnumDimensionTraits.prototype, "disable", void 0);
//# sourceMappingURL=DimensionTraits.js.map
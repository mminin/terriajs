var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../../Decorators/primitiveTrait";
import ModelTraits from "../../ModelTraits";
export class BinStyleTraits extends ModelTraits {
    static isRemoval(style) {
        return style.maxValue === null;
    }
}
__decorate([
    primitiveTrait({
        name: "Value",
        description: "The maximum value of the bin for a given style.",
        type: "number",
        isNullable: true
    })
], BinStyleTraits.prototype, "maxValue", void 0);
export class EnumStyleTraits extends ModelTraits {
    static isRemoval(style) {
        return style.value === null;
    }
}
__decorate([
    primitiveTrait({
        name: "Value",
        description: "The enumerated value to map to a style.",
        type: "string",
        isNullable: true
    })
], EnumStyleTraits.prototype, "value", void 0);
export class TableStyleMapTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.enabled = true;
        this.mapType = undefined;
        this.column = undefined;
    }
}
__decorate([
    primitiveTrait({
        name: "Enabled",
        description: "True to enable.",
        type: "boolean"
    })
], TableStyleMapTraits.prototype, "enabled", void 0);
__decorate([
    primitiveTrait({
        name: "Style map type",
        description: 'The type of style map. Valid values are "continuous", "enum", "bin", "constant"',
        type: "string"
    })
], TableStyleMapTraits.prototype, "mapType", void 0);
__decorate([
    primitiveTrait({
        name: "Column",
        description: "The column to use for styling.",
        type: "string"
    })
], TableStyleMapTraits.prototype, "column", void 0);
export class TableStyleMapSymbolTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Value",
        description: "The enumerated value to map to a color.",
        type: "string"
    })
], TableStyleMapSymbolTraits.prototype, "legendTitle", void 0);
//# sourceMappingURL=StyleMapTraits.js.map
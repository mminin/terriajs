var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import TableColumnType from "./TableColumnType";
export default class TableStyleMap {
    constructor(tableModel, styleTraits, key) {
        this.tableModel = tableModel;
        this.styleTraits = styleTraits;
        this.key = key;
    }
    /** Get traits for TableStyleMapSymbolTraits */
    get commonTraits() {
        return this.styleTraits[this.key];
    }
    /** Get all traits (this includes TableStyleMapTraits and specific SymbolTraits) */
    get traits() {
        return this.styleTraits[this.key];
    }
    /** Get all trait values for this TableStyleMapModel.
     * This is a JSON object
     */
    get traitValues() {
        return this.styleTraits.traits[this.key].toJson(this.traits);
    }
    get column() {
        return this.traitValues.column
            ? this.tableModel.tableColumns.find((column) => column.name === this.traitValues.column)
            : undefined;
    }
    /**
     *
     */
    get styleMap() {
        var _a;
        // If column type is `scalar` and binStyles
        if ((this.traitValues.mapType === "bin" || !this.traitValues.mapType) &&
            ((_a = this.column) === null || _a === void 0 ? void 0 : _a.type) === TableColumnType.scalar &&
            this.traitValues.bin &&
            this.traitValues.bin.length > 0) {
            return {
                type: "bin",
                mapValueToStyle: (rowId) => {
                    var _a, _b, _c, _d, _e;
                    const value = (_a = this.column) === null || _a === void 0 ? void 0 : _a.valuesForType[rowId];
                    if (typeof value !== "number") {
                        return this.traitValues.null;
                    }
                    const binStyles = (_b = this.traitValues.bin) !== null && _b !== void 0 ? _b : [];
                    let i;
                    for (i = 0; i < binStyles.length - 1 &&
                        value > ((_c = binStyles[i].maxValue) !== null && _c !== void 0 ? _c : Infinity); ++i) { }
                    return {
                        ...this.traitValues.null,
                        ...((_e = (_d = this.traitValues.bin) === null || _d === void 0 ? void 0 : _d[i]) !== null && _e !== void 0 ? _e : {})
                    };
                }
            };
        }
        else if ((this.traitValues.mapType === "enum" || !this.traitValues.mapType) &&
            this.column &&
            this.traitValues.enum &&
            this.traitValues.enum.length > 0) {
            return {
                type: "enum",
                mapValueToStyle: (rowId) => {
                    const style = this.traitValues.enum.find((enumStyle) => {
                        var _a;
                        return enumStyle.value !== null &&
                            enumStyle.value === ((_a = this.column) === null || _a === void 0 ? void 0 : _a.values[rowId]);
                    });
                    return { ...this.traitValues.null, ...(style !== null && style !== void 0 ? style : {}) };
                }
            };
        }
        // Return default settings
        return {
            type: "constant",
            style: this.traitValues.null
        };
    }
}
__decorate([
    computed
], TableStyleMap.prototype, "commonTraits", null);
__decorate([
    computed
], TableStyleMap.prototype, "traits", null);
__decorate([
    computed
], TableStyleMap.prototype, "traitValues", null);
__decorate([
    computed
], TableStyleMap.prototype, "column", null);
__decorate([
    computed
], TableStyleMap.prototype, "styleMap", null);
export function isConstantStyleMap(map) {
    return map.type === "constant";
}
//# sourceMappingURL=TableStyleMap.js.map
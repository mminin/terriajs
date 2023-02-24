var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import isDefined from "../Core/isDefined";
import createStratumInstance from "../Models/Definition/createStratumInstance";
import LoadableStratum from "../Models/Definition/LoadableStratum";
import LegendTraits, { LegendItemTraits } from "../Traits/TraitsClasses/LegendTraits";
export class StyleMapLegend extends LoadableStratum(LegendTraits) {
    constructor(catalogItem, styleMap, getPreview, legendItemOverrides = {}) {
        super();
        this.catalogItem = catalogItem;
        this.styleMap = styleMap;
        this.getPreview = getPreview;
        this.legendItemOverrides = legendItemOverrides;
    }
    duplicateLoadableStratum(newModel) {
        return new StyleMapLegend(newModel, this.styleMap, this.getPreview, this.legendItemOverrides);
    }
    get tableStyle() {
        return this.catalogItem.activeTableStyle;
    }
    get title() {
        var _a, _b, _c;
        if (this.styleMap.styleMap.type !== "constant" &&
            this.styleMap.column &&
            ((_a = this.tableStyle.colorColumn) === null || _a === void 0 ? void 0 : _a.name) !== ((_b = this.styleMap.column) === null || _b === void 0 ? void 0 : _b.name)) {
            return (_c = this.styleMap.column) === null || _c === void 0 ? void 0 : _c.title;
        }
    }
    get items() {
        let items = [];
        if (this.styleMap.styleMap.type === "bin") {
            items = this._createLegendItemsFromBinStyleMap();
        }
        else if (this.styleMap.styleMap.type === "enum") {
            items = this._createLegendItemsFromEnumStyleMap();
        }
        else {
            items = this._createLegendItemsFromConstantColorMap();
        }
        return items;
    }
    _createLegendItemsFromBinStyleMap() {
        const column = this.styleMap.column;
        const minimum = column && column.valuesAsNumbers.minimum !== undefined
            ? column.valuesAsNumbers.minimum
            : 0.0;
        const nullBin = column &&
            column.valuesAsNumbers.numberOfValidNumbers <
                column.valuesAsNumbers.values.length
            ? [
                createStratumInstance(LegendItemTraits, {
                    ...this.legendItemOverrides,
                    ...this.getPreview(this.styleMap.traitValues.null, "(No value)"),
                    addSpacingAbove: true
                })
            ]
            : [];
        return this.styleMap.traitValues.bin
            .map((bin, i) => {
            const isBottom = i === 0;
            const formattedMin = isBottom
                ? this._formatValue(minimum, this.tableStyle.numberFormatOptions)
                : this._formatValue(this.styleMap.traitValues.bin[i - 1].maxValue, this.tableStyle.numberFormatOptions);
            const formattedMax = this._formatValue(bin.maxValue, this.tableStyle.numberFormatOptions);
            return createStratumInstance(LegendItemTraits, {
                ...this.legendItemOverrides,
                ...this.getPreview({ ...this.styleMap.traitValues.null, ...bin }, `${formattedMin} to ${formattedMax}`)
            });
        })
            .reverse()
            .concat(nullBin);
    }
    _createLegendItemsFromEnumStyleMap() {
        const column = this.styleMap.column;
        // Show null bin if data has null values - or if EnumColorMap doesn't have enough colors to show all values
        const nullBin = column &&
            (column.uniqueValues.numberOfNulls > 0 ||
                column.uniqueValues.values.find((value) => !this.styleMap.commonTraits.enum.find((enumStyle) => enumStyle.value === value)))
            ? [
                createStratumInstance(LegendItemTraits, {
                    ...this.legendItemOverrides,
                    ...this.getPreview(this.styleMap.traitValues.null, "(No value)")
                })
            ]
            : [];
        return this.styleMap.traitValues.enum
            .map((enumPoint) => {
            var _a, _b;
            return createStratumInstance(LegendItemTraits, this.getPreview({
                ...this.legendItemOverrides,
                ...this.styleMap.traitValues.null,
                ...enumPoint
            }, (_b = (_a = enumPoint.legendTitle) !== null && _a !== void 0 ? _a : enumPoint.value) !== null && _b !== void 0 ? _b : "No value"));
        })
            .concat(nullBin);
    }
    _createLegendItemsFromConstantColorMap() {
        var _a, _b;
        return [
            createStratumInstance(LegendItemTraits, {
                ...this.legendItemOverrides,
                ...this.getPreview(this.styleMap.traitValues.null, (_b = (_a = this.catalogItem.name) !== null && _a !== void 0 ? _a : this.catalogItem.uniqueId) !== null && _b !== void 0 ? _b : "(No value)")
            })
        ];
    }
    _formatValue(value, format) {
        if (!isDefined(value) || value === null)
            return "No value";
        return ((format === null || format === void 0 ? void 0 : format.maximumFractionDigits) ? value : Math.round(value)).toLocaleString(undefined, format);
    }
}
__decorate([
    computed
], StyleMapLegend.prototype, "tableStyle", null);
__decorate([
    computed
], StyleMapLegend.prototype, "title", null);
__decorate([
    computed
], StyleMapLegend.prototype, "items", null);
//# sourceMappingURL=StyleMapLegend.js.map
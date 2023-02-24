var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { uniq } from "lodash-es";
import { computed } from "mobx";
import filterOutUndefined from "../Core/filterOutUndefined";
import { isMakiIcon } from "../Map/Icons/Maki/MakiIcons";
import { isDataSource } from "../ModelMixins/MappableMixin";
import createStratumInstance from "../Models/Definition/createStratumInstance";
import LoadableStratum from "../Models/Definition/LoadableStratum";
import StratumOrder from "../Models/Definition/StratumOrder";
import LegendOwnerTraits from "../Traits/TraitsClasses/LegendOwnerTraits";
import LegendTraits, { LegendItemTraits } from "../Traits/TraitsClasses/LegendTraits";
import { ColorStyleLegend } from "./ColorStyleLegend";
import { MergedStyleMapLegend } from "./MergedStyleMapLegend";
import { StyleMapLegend } from "./StyleMapLegend";
export class TableAutomaticLegendStratum extends LoadableStratum(LegendOwnerTraits) {
    constructor(_item) {
        super();
        this._item = _item;
    }
    duplicateLoadableStratum(newModel) {
        return new TableAutomaticLegendStratum(newModel);
    }
    static load(item) {
        return new TableAutomaticLegendStratum(item);
    }
    get legendItemOverrides() {
        const override = {
            ...(this._item.activeTableStyle.tableColorMap.type === "constant"
                ? {
                    color: this._item.activeTableStyle.tableColorMap
                        .colorMap.color.toCssColorString(),
                    title: this._item.activeTableStyle.tableColorMap
                        .colorMap.title
                }
                : {}),
            ...(this.showPointLegend &&
                this._item.activeTableStyle.pointStyleMap.styleMap.type === "constant"
                ? getPointLegend(this._item.activeTableStyle.pointStyleMap.styleMap.style)
                : {}),
            ...(this._item.activeTableStyle.outlineStyleMap.styleMap.type ===
                "constant"
                ? getOutlineLegend(this._item.activeTableStyle.outlineStyleMap.styleMap.style)
                : {})
        };
        delete override.addSpacingAbove;
        return override;
    }
    get colorStyleLegend() {
        if (this._item.activeTableStyle.tableColorMap.type !== "constant")
            return new ColorStyleLegend(this._item, this.legendItemOverrides);
    }
    get pointStyleMapLegend() {
        if (this._item.activeTableStyle.pointStyleMap.styleMap.type !== "constant")
            return new StyleMapLegend(this._item, this._item.activeTableStyle.pointStyleMap, getPointLegend, this.legendItemOverrides);
    }
    get outlineStyleMapLegend() {
        if (this._item.activeTableStyle.outlineStyleMap.styleMap.type !== "constant")
            return new StyleMapLegend(this._item, this._item.activeTableStyle.outlineStyleMap, getOutlineLegend, this.legendItemOverrides);
    }
    get showPointLegend() {
        return !!this._item.mapItems.find((d) => isDataSource(d) && d.entities.values.length > 0);
    }
    get mergedLegend() {
        var _a, _b, _c;
        if (this.styleLegends.length === 0)
            return;
        const mergableStyleTypes = [
            this._item.activeTableStyle.tableColorMap.type,
            this._item.activeTableStyle.pointStyleMap.styleMap.type,
            this._item.activeTableStyle.outlineStyleMap.styleMap.type
        ].filter((type) => type !== "constant");
        const canMergeStyleTypes = mergableStyleTypes.every((type) => type === "enum") ||
            mergableStyleTypes.every((type) => type === "bin");
        const canMergeColumns = uniq(filterOutUndefined([
            (_a = this._item.activeTableStyle.colorColumn) === null || _a === void 0 ? void 0 : _a.name,
            (_b = this._item.activeTableStyle.outlineStyleMap.column) === null || _b === void 0 ? void 0 : _b.name,
            (_c = this._item.activeTableStyle.pointStyleMap.column) === null || _c === void 0 ? void 0 : _c.name
        ])).length <= 1;
        if (canMergeColumns && canMergeStyleTypes) {
            return new MergedStyleMapLegend(this.styleLegends, this.legendItemOverrides);
        }
    }
    get styleLegends() {
        return filterOutUndefined([
            this.colorStyleLegend,
            this.showPointLegend ? this.pointStyleMapLegend : undefined,
            this.outlineStyleMapLegend
        ]);
    }
    get legends() {
        var _a;
        if (this._item.mapItems.length === 0 ||
            ((_a = this._item.dataColumnMajor) !== null && _a !== void 0 ? _a : []).length === 0)
            return [];
        if (this.mergedLegend)
            return [this.mergedLegend];
        if (this.styleLegends.length > 0) {
            return this.styleLegends;
        }
        return [
            createStratumInstance(LegendTraits, {
                items: [
                    createStratumInstance(LegendItemTraits, this.legendItemOverrides)
                ]
            })
        ];
    }
}
TableAutomaticLegendStratum.stratumName = "table-legend";
__decorate([
    computed
], TableAutomaticLegendStratum.prototype, "legendItemOverrides", null);
__decorate([
    computed
], TableAutomaticLegendStratum.prototype, "colorStyleLegend", null);
__decorate([
    computed
], TableAutomaticLegendStratum.prototype, "pointStyleMapLegend", null);
__decorate([
    computed
], TableAutomaticLegendStratum.prototype, "outlineStyleMapLegend", null);
__decorate([
    computed
], TableAutomaticLegendStratum.prototype, "showPointLegend", null);
__decorate([
    computed
], TableAutomaticLegendStratum.prototype, "mergedLegend", null);
__decorate([
    computed
], TableAutomaticLegendStratum.prototype, "styleLegends", null);
__decorate([
    computed
], TableAutomaticLegendStratum.prototype, "legends", null);
StratumOrder.addLoadStratum(TableAutomaticLegendStratum.stratumName);
const getPointLegend = (point, defaultLabel) => {
    var _a;
    const useMakiIcon = isMakiIcon(point.marker);
    return {
        rotation: point.rotation,
        marker: useMakiIcon ? point.marker : undefined,
        imageUrl: !useMakiIcon && point.marker !== "point" ? point.marker : undefined,
        imageHeight: 24,
        imageWidth: 24,
        title: (_a = point.legendTitle) !== null && _a !== void 0 ? _a : defaultLabel
    };
};
const getOutlineLegend = (outline, defaultLabel) => {
    var _a;
    return {
        outlineWidth: outline.width,
        outlineColor: outline.color,
        title: (_a = outline.legendTitle) !== null && _a !== void 0 ? _a : defaultLabel
    };
};
//# sourceMappingURL=TableLegendStratum.js.map
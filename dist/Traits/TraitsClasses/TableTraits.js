var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ChartPointOnMapTraits from "./ChartPointOnMapTraits";
import DiscretelyTimeVaryingTraits from "./DiscretelyTimeVaryingTraits";
import ExportableTraits from "./ExportableTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import RasterLayerTraits from "./RasterLayerTraits";
import TableColumnTraits from "./TableColumnTraits";
import TableStyleTraits from "./TableStyleTraits";
export default class TableTraits extends mixTraits(DiscretelyTimeVaryingTraits, ExportableTraits, LayerOrderingTraits, RasterLayerTraits, ChartPointOnMapTraits) {
    constructor() {
        super(...arguments);
        // Not implemented in v8
        this.showUnmatchedRegionsWarning = true;
        this.columnTitles = [];
        this.columnUnits = [];
        this.removeDuplicateRows = false;
    }
}
__decorate([
    primitiveTrait({
        name: "Show Warning for Unmatched Regions",
        description: "True to show a warning when some of the region IDs in the CSV file could not be matched to a region. False to silently ignore unmatched regions.",
        type: "boolean"
    })
], TableTraits.prototype, "showUnmatchedRegionsWarning", void 0);
__decorate([
    objectArrayTrait({
        name: "Columns",
        description: "Options for individual columns/variables.",
        type: TableColumnTraits,
        idProperty: "name"
    })
], TableTraits.prototype, "columns", void 0);
__decorate([
    objectTrait({
        name: "Default Column",
        description: "The default settings to use for all columns/variables",
        type: TableColumnTraits
    })
], TableTraits.prototype, "defaultColumn", void 0);
__decorate([
    objectArrayTrait({
        name: "Styles",
        description: "The set of styles that can be used to visualize this dataset.",
        type: TableStyleTraits,
        idProperty: "id"
    })
], TableTraits.prototype, "styles", void 0);
__decorate([
    objectTrait({
        name: "Default Style",
        description: "The default style to apply when visualizing any column/variable.",
        type: TableStyleTraits
    })
], TableTraits.prototype, "defaultStyle", void 0);
__decorate([
    primitiveTrait({
        name: "Selected Style",
        description: "The ID of the currently-selected style.",
        type: "string"
    })
], TableTraits.prototype, "activeStyle", void 0);
__decorate([
    primitiveTrait({
        name: "Enable manual region mapping",
        description: "If enabled, there will be controls to set region column/variable and region type.",
        type: "boolean"
    })
], TableTraits.prototype, "enableManualRegionMapping", void 0);
__decorate([
    primitiveTrait({
        name: "Show disable styling option",
        description: "If enabled, there will be an option in styleDimension to disable styling.",
        type: "boolean"
    })
], TableTraits.prototype, "showDisableStyleOption", void 0);
__decorate([
    primitiveTrait({
        name: "Show disable time",
        description: "If enabled, there will be an checkbox to disable time.",
        type: "boolean"
    })
], TableTraits.prototype, "showDisableTimeOption", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Column titles",
        description: "An optional array of column/variable titles that override the individual `TableColumnTraits.title` setting.",
        type: "string"
    })
], TableTraits.prototype, "columnTitles", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Column units",
        description: "An optional array of column/variable units that override the individual `TableColumnTraits.unit` setting.",
        type: "string"
    })
], TableTraits.prototype, "columnUnits", void 0);
__decorate([
    primitiveTrait({
        name: "Remove duplicate rows",
        type: "boolean",
        description: "If two rows in the table are identical, only retain one copy. This could cause performance issues, and so should be used only when absolutely necessary."
    })
], TableTraits.prototype, "removeDuplicateRows", void 0);
//# sourceMappingURL=TableTraits.js.map
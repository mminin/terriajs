var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../../ModelTraits";
import primitiveTrait from "../../Decorators/primitiveTrait";
import objectArrayTrait from "../../Decorators/objectArrayTrait";
export class TableChartLineStyleTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.isSelectedInWorkbench = true;
    }
}
__decorate([
    primitiveTrait({
        name: "Name",
        description: "Chart line name (will replace y-column name).",
        type: "string"
    })
], TableChartLineStyleTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        name: "Y Axis Column",
        description: "The column to use as the Y-axis.",
        type: "string"
    })
], TableChartLineStyleTraits.prototype, "yAxisColumn", void 0);
__decorate([
    primitiveTrait({
        name: "Y Axis Minimum",
        description: "The minimum value to show on the Y axis of the chart.",
        type: "number"
    })
], TableChartLineStyleTraits.prototype, "yAxisMinimum", void 0);
__decorate([
    primitiveTrait({
        name: "Y Axis Maximum",
        description: "The maximum value to show on the Y axis of the chart.",
        type: "number"
    })
], TableChartLineStyleTraits.prototype, "yAxisMaximum", void 0);
__decorate([
    primitiveTrait({
        name: "Color",
        description: "The color of the line. If not specified, a unique color will be assigned automatically.",
        type: "string"
    })
], TableChartLineStyleTraits.prototype, "color", void 0);
__decorate([
    primitiveTrait({
        name: "Is selected in workbench?",
        description: "The selection state of the line in the workbench.",
        type: "boolean"
    })
], TableChartLineStyleTraits.prototype, "isSelectedInWorkbench", void 0);
export default class TableChartStyleTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "X Axis Column",
        description: "The column to use as the X-axis.",
        type: "string"
    })
], TableChartStyleTraits.prototype, "xAxisColumn", void 0);
__decorate([
    objectArrayTrait({
        name: "Lines",
        description: "Lines on the chart, each of which is formed by plotting a column as the Y-axis.",
        type: TableChartLineStyleTraits,
        idProperty: "yAxisColumn"
    })
], TableChartStyleTraits.prototype, "lines", void 0);
//# sourceMappingURL=ChartStyleTraits.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import TableChartStyleTraits from "./TableChartStyleTraits";
import TableColorStyleTraits from "./TableColorStyleTraits";
import TablePointSizeStyleTraits from "./TablePointSizeStyleTraits";
import TableTimeStyleTraits from "./TableTimeStyleTraits";
import ModelTraits from "../ModelTraits";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class TableStyleTraits extends ModelTraits {
    static isRemoval(style) {
        return style.title === null;
    }
}
__decorate([
    primitiveTrait({
        name: "ID",
        description: "The ID of the style.",
        type: "string"
    })
], TableStyleTraits.prototype, "id", void 0);
__decorate([
    primitiveTrait({
        name: "Title",
        description: "The human-readable title of the style. Set this to null to remove the style entirely.",
        type: "string",
        isNullable: true
    })
], TableStyleTraits.prototype, "title", void 0);
__decorate([
    primitiveTrait({
        name: "Legend Title",
        description: "The title to show on the legend. If not specified, `Title` is used.",
        type: "string"
    })
], TableStyleTraits.prototype, "legendTitle", void 0);
__decorate([
    primitiveTrait({
        name: "Region Column",
        description: "The column to use for region mapping.",
        type: "string",
        isNullable: true
    })
], TableStyleTraits.prototype, "regionColumn", void 0);
__decorate([
    primitiveTrait({
        name: "Latitude Column",
        description: "The column to use for the latitude of points. If `Region Column` is specified, this property is ignored.",
        type: "string"
    })
], TableStyleTraits.prototype, "latitudeColumn", void 0);
__decorate([
    primitiveTrait({
        name: "Longitude Column",
        description: "The column to use for the longitude of points. If `Region Column` is specified, this property is ignored.",
        type: "string"
    })
], TableStyleTraits.prototype, "longitudeColumn", void 0);
__decorate([
    objectTrait({
        name: "Color",
        description: "Options for controlling the color of points or regions.",
        type: TableColorStyleTraits
    })
], TableStyleTraits.prototype, "color", void 0);
__decorate([
    objectTrait({
        name: "Point Size",
        description: "Options for controlling the size of points. This property is ignored for regions.",
        type: TablePointSizeStyleTraits
    })
], TableStyleTraits.prototype, "pointSize", void 0);
__decorate([
    objectTrait({
        name: "Chart",
        description: "Options for controlling the chart created from this CSV.",
        type: TableChartStyleTraits
    })
], TableStyleTraits.prototype, "chart", void 0);
__decorate([
    objectTrait({
        name: "Time",
        description: "Options for controlling how the visualization changes with time.",
        type: TableTimeStyleTraits
    })
], TableStyleTraits.prototype, "time", void 0);
__decorate([
    primitiveTrait({
        name: "Hide style",
        description: `Hide style from "Display Variable" drop-down in workbench. It is hidden by default if number of colors (enumColors or numberOfBins) is less than 2 - as a ColorMap with a single color isn't super useful`,
        type: "boolean"
    })
], TableStyleTraits.prototype, "hidden", void 0);
//# sourceMappingURL=TableStyleTraits.js.map
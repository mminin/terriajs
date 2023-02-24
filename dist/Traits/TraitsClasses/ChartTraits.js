var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Glyphs from "../../ReactViews/Custom/Chart/Glyphs";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import MappableTraits from "./MappableTraits";
const availableChartGlyphStyles = Object.keys(Glyphs).join(", ");
export default class ChartTraits extends mixTraits(MappableTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Chart type",
        description: "Type determines how the data availibility will be plotted on chart. eg: momentLines, momentPoints"
    })
], ChartTraits.prototype, "chartType", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Chart Disclaimer",
        description: "A HTML string to show above the chart as a disclaimer"
    })
], ChartTraits.prototype, "chartDisclaimer", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Chart color",
        description: "The color to use when the data set is displayed on the chart. The value can be any html color string, eg: 'cyan' or '#00ffff' or 'rgba(0, 255, 255, 1)' for the color cyan."
    })
], ChartTraits.prototype, "chartColor", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Chart glyph style",
        description: `The glyph style to use for points plotted on the chart. Allowed values include ${availableChartGlyphStyles}. Default is "circle".`
    })
], ChartTraits.prototype, "chartGlyphStyle", void 0);
//# sourceMappingURL=ChartTraits.js.map
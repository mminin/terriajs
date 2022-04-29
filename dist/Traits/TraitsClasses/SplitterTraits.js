var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ImagerySplitDirection from "terriajs-cesium/Source/Scene/ImagerySplitDirection";
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class SplitterTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.splitDirection = ImagerySplitDirection.NONE;
        this.disableSplitter = false;
    }
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Split direction",
        description: "The side of the splitter to display this imagery layer on. Defaults to both sides."
    })
], SplitterTraits.prototype, "splitDirection", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Disable splitter",
        description: "If true, splitter funcitonality will be hidden for this model."
    })
], SplitterTraits.prototype, "disableSplitter", void 0);
//# sourceMappingURL=SplitterTraits.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import ModelTraits from "../ModelTraits";
import LegendTraits from "./LegendTraits";
export default class LegendOwnerTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.hideLegendInWorkbench = false;
    }
}
__decorate([
    objectArrayTrait({
        name: "Legend URLs",
        description: "The legends to display on the workbench.",
        type: LegendTraits,
        idProperty: "index",
        merge: false
    })
], LegendOwnerTraits.prototype, "legends", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Hide legend in workbench",
        description: "Whether the legend is hidden in the workbench for this catalog member."
    })
], LegendOwnerTraits.prototype, "hideLegendInWorkbench", void 0);
//# sourceMappingURL=LegendOwnerTraits.js.map
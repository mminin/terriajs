var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ReferenceTraits from "./ReferenceTraits";
export default class SplitItemReferenceTraits extends mixTraits(ReferenceTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Split source item id",
        description: "The ID of the original item from which the split was created."
    })
], SplitItemReferenceTraits.prototype, "splitSourceItemId", void 0);
//# sourceMappingURL=SplitItemReferenceTraits.js.map
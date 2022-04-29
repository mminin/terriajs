var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import CatalogMemberReferenceTraits from "./CatalogMemberReferenceTraits";
import mixTraits from "../mixTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import UrlTraits from "./UrlTraits";
export default class UrlReferenceTraits extends mixTraits(CatalogMemberReferenceTraits, UrlTraits) {
    constructor() {
        super(...arguments);
        this.allowLoad = true;
    }
}
__decorate([
    primitiveTrait({
        name: "Allow Load",
        description: "Whether it's ok to attempt to load the URL and detect failures.",
        type: "boolean"
    })
], UrlReferenceTraits.prototype, "allowLoad", void 0);
//# sourceMappingURL=UrlReferenceTraits.js.map
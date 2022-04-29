var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberReferenceTraits from "./CatalogMemberReferenceTraits";
export default class CatalogIndexReferenceTraits extends mixTraits(CatalogMemberReferenceTraits) {
    constructor() {
        super(...arguments);
        this.memberKnownContainerUniqueIds = [];
    }
}
__decorate([
    primitiveArrayTrait({
        type: "string",
        name: "Member known container unique IDs",
        description: "These are used to load models which this model depends on (eg parent groups)."
    })
], CatalogIndexReferenceTraits.prototype, "memberKnownContainerUniqueIds", void 0);
__decorate([
    primitiveArrayTrait({
        type: "string",
        name: "Share keys",
        description: "Share keys can be used to resolve older model IDs to this model."
    })
], CatalogIndexReferenceTraits.prototype, "shareKeys", void 0);
__decorate([
    primitiveTrait({
        name: "Name in catalog",
        description: "The name of the item to be displayed in the catalog. This will only be defined if it differs from `name`.",
        type: "string"
    })
], CatalogIndexReferenceTraits.prototype, "nameInCatalog", void 0);
//# sourceMappingURL=CatalogIndexReferenceTraits.js.map
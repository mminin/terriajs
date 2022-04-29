var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import CatalogMemberFactory from "../../Models/Catalog/CatalogMemberFactory";
import modelReferenceArrayTrait from "../Decorators/modelReferenceArrayTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import ModelTraits from "../ModelTraits";
export default class GroupTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.isOpen = false;
    }
}
__decorate([
    primitiveArrayTrait({
        name: "Exclude members",
        type: "string",
        description: `An array of strings of excluded group and item names. A group or item name that appears in this list will not be shown to the user. This is case-insensitive and will also apply to all child/nested groups`
    })
], GroupTraits.prototype, "excludeMembers", void 0);
__decorate([
    primitiveTrait({
        name: "Is Open",
        description: "True if this group is open and its contents are visible; otherwise, false.",
        type: "boolean"
    })
], GroupTraits.prototype, "isOpen", void 0);
__decorate([
    primitiveTrait({
        name: "Sort members by",
        description: "Sort members by the given property/trait. For example `name`, will sort all members by alphabetically",
        type: "string"
    })
], GroupTraits.prototype, "sortMembersBy", void 0);
__decorate([
    modelReferenceArrayTrait({
        name: "Members",
        description: "The members of this group.",
        factory: CatalogMemberFactory
    })
], GroupTraits.prototype, "members", void 0);
//# sourceMappingURL=GroupTraits.js.map
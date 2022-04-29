var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ReferenceTraits from "./ReferenceTraits";
export default class CatalogMemberReferenceTraits extends mixTraits(ReferenceTraits) {
}
__decorate([
    primitiveTrait({
        name: "Name",
        description: "The name to use for this catalog member before the reference is loaded.",
        type: "string"
    })
], CatalogMemberReferenceTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Description",
        description: "The description to use for this catalog member before the reference is loaded. Markdown and HTML may be used."
    })
], CatalogMemberReferenceTraits.prototype, "description", void 0);
__decorate([
    primitiveTrait({
        name: "Data Custodian",
        type: "string",
        description: "Gets or sets a description of the custodian of this data item."
    })
], CatalogMemberReferenceTraits.prototype, "dataCustodian", void 0);
__decorate([
    primitiveTrait({
        name: "Is a Group",
        description: "Is the target of this reference expected to be a catalog group?",
        type: "boolean"
    })
], CatalogMemberReferenceTraits.prototype, "isGroup", void 0);
__decorate([
    primitiveTrait({
        name: "Is a Function",
        description: "Is the target of this reference expected to be a catalog function?",
        type: "boolean"
    })
], CatalogMemberReferenceTraits.prototype, "isFunction", void 0);
__decorate([
    primitiveTrait({
        name: "Is Mappable",
        description: "Is the target of this reference expected to have map items?",
        type: "boolean"
    })
], CatalogMemberReferenceTraits.prototype, "isMappable", void 0);
__decorate([
    primitiveTrait({
        name: "Is Chartable",
        description: "Is the target of this reference expected to have chart items?",
        type: "boolean"
    })
], CatalogMemberReferenceTraits.prototype, "isChartable", void 0);
//# sourceMappingURL=CatalogMemberReferenceTraits.js.map
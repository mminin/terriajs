var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import CatalogMemberReferenceTraits from "./CatalogMemberReferenceTraits";
import MagdaDistributionFormatTraits from "./MagdaDistributionFormatTraits";
import mixTraits from "../mixTraits";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import UrlTraits from "./UrlTraits";
export default class MagdaReferenceTraits extends mixTraits(CatalogMemberReferenceTraits, UrlTraits) {
}
__decorate([
    primitiveTrait({
        name: "Record ID",
        description: "The ID of the Magda record referred to by this reference.",
        type: "string"
    })
], MagdaReferenceTraits.prototype, "recordId", void 0);
__decorate([
    anyTrait({
        name: "Magda Record Data",
        description: "The available representation of the Magda record as returned by " +
            "the Magda registry API. This representation may not include all " +
            "aspects and it may not be dereferenced."
    })
], MagdaReferenceTraits.prototype, "magdaRecord", void 0);
__decorate([
    anyTrait({
        name: "Override",
        description: "The properties to apply to the dereferenced item, overriding properties that " +
            "come from Magda itself."
    })
], MagdaReferenceTraits.prototype, "override", void 0);
__decorate([
    objectArrayTrait({
        name: "Distribution Formats",
        description: "The supported distribution formats and their mapping to Terria types. " +
            "These are listed in order of preference.",
        type: MagdaDistributionFormatTraits,
        idProperty: "id"
    })
], MagdaReferenceTraits.prototype, "distributionFormats", void 0);
__decorate([
    anyTrait({
        name: "AddOrOverrideAspects",
        description: "The properties to apply to the dereferenced item, overriding the record aspects"
    })
], MagdaReferenceTraits.prototype, "addOrOverrideAspects", void 0);
//# sourceMappingURL=MagdaReferenceTraits.js.map
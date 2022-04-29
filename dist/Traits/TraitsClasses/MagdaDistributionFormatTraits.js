var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class MagdaDistributionFormatTraits extends ModelTraits {
    static isRemoval(format) {
        return format.definition === null;
    }
}
__decorate([
    primitiveTrait({
        name: "ID",
        description: "The ID of this distribution format.",
        type: "string"
    })
], MagdaDistributionFormatTraits.prototype, "id", void 0);
__decorate([
    primitiveTrait({
        name: "Format Regular Expression",
        description: "A regular expression that is matched against the distribution's format.",
        type: "string"
    })
], MagdaDistributionFormatTraits.prototype, "formatRegex", void 0);
__decorate([
    primitiveTrait({
        name: "URL Regular Expression",
        description: "A regular expression that is matched against the distribution's URL.",
        type: "string"
    })
], MagdaDistributionFormatTraits.prototype, "urlRegex", void 0);
__decorate([
    anyTrait({
        name: "Definition",
        description: "The catalog member definition to use when the URL and Format regular expressions match. The `URL` property will also be set."
    })
], MagdaDistributionFormatTraits.prototype, "definition", void 0);
//# sourceMappingURL=MagdaDistributionFormatTraits.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class CkanResourceFormatTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.onlyUseIfSoleResource = false;
        this.removeDuplicates = true;
    }
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
], CkanResourceFormatTraits.prototype, "id", void 0);
__decorate([
    primitiveTrait({
        name: "Format Regular Expression",
        description: "A regular expression that is matched against the distribution's format. This must be defined for this format to be used",
        type: "string"
    })
], CkanResourceFormatTraits.prototype, "formatRegex", void 0);
__decorate([
    primitiveTrait({
        name: "URL Regular Expression",
        description: "A regular expression that is matched against the url, this will only be used if `formatRegex` matches.",
        type: "string"
    })
], CkanResourceFormatTraits.prototype, "urlRegex", void 0);
__decorate([
    primitiveTrait({
        name: "Maximum file size (MB)",
        description: "The maximum allowed file size for this format (in megabytes).",
        type: "number",
        isNullable: true
    })
], CkanResourceFormatTraits.prototype, "maxFileSize", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Only use if sole resource",
        description: `This resource will only match if no other resource types match for a given dataset. Like a "last-resort" resource. This will be ignored if \`useSingleResource\` is used`
    })
], CkanResourceFormatTraits.prototype, "onlyUseIfSoleResource", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Remove duplicate resources",
        description: `Remove resources if they have the same \`name\`. If duplicates are found, then the newest resource will be used (according to created property). This is applied per format`
    })
], CkanResourceFormatTraits.prototype, "removeDuplicates", void 0);
__decorate([
    anyTrait({
        name: "Definition",
        description: "The catalog member definition to use when the URL and Format regular expressions match. The `URL` property will also be set."
    })
], CkanResourceFormatTraits.prototype, "definition", void 0);
//# sourceMappingURL=CkanResourceFormatTraits.js.map
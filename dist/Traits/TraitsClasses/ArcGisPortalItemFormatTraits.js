var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class ArcGisPortalItemFormatTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "ID",
        description: "The ID of this items format.",
        type: "string"
    })
], ArcGisPortalItemFormatTraits.prototype, "id", void 0);
__decorate([
    anyTrait({
        name: "Url Regular Expression",
        description: "A regular expression that is matched against the items url."
    })
], ArcGisPortalItemFormatTraits.prototype, "urlRegex", void 0);
__decorate([
    primitiveTrait({
        name: "Format Regular Expression",
        description: "A regular expression that is matched against the item format.",
        type: "string"
    })
], ArcGisPortalItemFormatTraits.prototype, "formatRegex", void 0);
__decorate([
    anyTrait({
        name: "Definition",
        description: "The catalog member definition to use when the URL and Format regular expressions match. The `URL` property will also be set."
    })
], ArcGisPortalItemFormatTraits.prototype, "definition", void 0);
//# sourceMappingURL=ArcGisPortalItemFormatTraits.js.map
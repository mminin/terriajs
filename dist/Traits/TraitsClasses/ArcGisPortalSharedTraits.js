var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import ArcGisPortalItemFormatTraits from "./ArcGisPortalItemFormatTraits";
import mixTraits from "../mixTraits";
export default class ArcGisPortalSharedTraits extends mixTraits() {
}
__decorate([
    anyTrait({
        name: "Item Properties",
        description: "An object of properties that will be set on the item created from the CKAN resource."
    })
], ArcGisPortalSharedTraits.prototype, "itemProperties", void 0);
__decorate([
    objectArrayTrait({
        name: "Supported Formats",
        description: "The supported formats and their mapping to Terria types. " +
            "These are listed in order of preference.",
        type: ArcGisPortalItemFormatTraits,
        idProperty: "id"
    })
], ArcGisPortalSharedTraits.prototype, "supportedFormats", void 0);
//# sourceMappingURL=ArcGisPortalSharedTraits.js.map
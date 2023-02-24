var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import GltfCatalogItemTraits from "./GltfCatalogItemTraits";
export default class AssImpCatalogItemTraits extends mixTraits(GltfCatalogItemTraits) {
    constructor() {
        super(...arguments);
        this.urls = [];
    }
}
__decorate([
    primitiveArrayTrait({
        type: "string",
        name: "URLs",
        description: `An array of URLs`
    })
], AssImpCatalogItemTraits.prototype, "urls", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Base URL",
        description: `The base URL that paths in the 3D model (eg textures) are relative to`
    })
], AssImpCatalogItemTraits.prototype, "baseUrl", void 0);
//# sourceMappingURL=AssImpCatalogItemTraits.js.map
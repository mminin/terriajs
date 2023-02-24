var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable } from "mobx";
import GltfMixin from "../../../ModelMixins/GltfMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import GltfCatalogItemTraits from "../../../Traits/TraitsClasses/GltfCatalogItemTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
export default class GltfCatalogItem extends UrlMixin(GltfMixin(CreateModel(GltfCatalogItemTraits))) {
    constructor() {
        super(...arguments);
        this.hasLocalData = false;
    }
    get type() {
        return GltfCatalogItem.type;
    }
    get gltfModelUrl() {
        return this.url;
    }
    setFileInput(file) {
        const dataUrl = URL.createObjectURL(file);
        this.setTrait(CommonStrata.user, "url", dataUrl);
        this.hasLocalData = true;
    }
}
GltfCatalogItem.type = "gltf";
__decorate([
    computed
], GltfCatalogItem.prototype, "gltfModelUrl", null);
__decorate([
    observable
], GltfCatalogItem.prototype, "hasLocalData", void 0);
__decorate([
    action
], GltfCatalogItem.prototype, "setFileInput", null);
//# sourceMappingURL=GltfCatalogItem.js.map
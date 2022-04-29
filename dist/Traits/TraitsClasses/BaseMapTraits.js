var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import CatalogMemberFactory from "../../Models/Catalog/CatalogMemberFactory";
import modelReferenceTrait from "../Decorators/modelReferenceTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import ModelTraits from "../ModelTraits";
export class BaseMapTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.contrastColor = "#ffffff";
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Image",
        description: "Path to the basemap image"
    })
], BaseMapTraits.prototype, "image", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Contrast color",
        description: "Color which should be used to contrast with basemap (eg for region mapping feature borders)"
    })
], BaseMapTraits.prototype, "contrastColor", void 0);
__decorate([
    modelReferenceTrait({
        factory: CatalogMemberFactory,
        name: "Base map item",
        description: 'Catalog item defition to be used for the base map. It is also possible to reference an existing catalog item using its id (i.e. `"//Surface Geology"`).'
    })
], BaseMapTraits.prototype, "item", void 0);
export class BaseMapsTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.previewBaseMapId = "basemap-positron";
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "defaultBaseMapId",
        description: "The id of the baseMap user will see on the first mapLoad. This wil be used **before** `defaultBaseMapName`"
    })
], BaseMapsTraits.prototype, "defaultBaseMapId", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "defaultBaseMapName",
        description: "Name of the base map to use as default"
    })
], BaseMapsTraits.prototype, "defaultBaseMapName", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "previewBaseMapId",
        description: "The id of the baseMap to be used as the base map in data preview. "
    })
], BaseMapsTraits.prototype, "previewBaseMapId", void 0);
__decorate([
    objectArrayTrait({
        type: BaseMapTraits,
        idProperty: "item",
        name: "items",
        description: "Array of catalog items definitions that can be used as a Base map."
    })
], BaseMapsTraits.prototype, "items", void 0);
__decorate([
    primitiveArrayTrait({
        type: "string",
        name: "enabledBaseMaps",
        description: "Array of base maps ids that is available to user. Use this do define order of the base maps in settings panel. Leave undefined to show all basemaps."
    })
], BaseMapsTraits.prototype, "enabledBaseMaps", void 0);
//# sourceMappingURL=BaseMapTraits.js.map
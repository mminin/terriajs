var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import { GeoJsonTraits } from "./GeoJsonTraits";
import GetCapabilitiesTraits from "./GetCapabilitiesTraits";
import StyleTraits from "./StyleTraits";
export default class WebFeatureServiceCatalogItemTraits extends mixTraits(GeoJsonTraits, GetCapabilitiesTraits) {
    constructor() {
        super(...arguments);
        this.maxFeatures = 1000;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Type Name(s)",
        description: "The type name or names to display."
    })
], WebFeatureServiceCatalogItemTraits.prototype, "typeNames", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Max features",
        description: "Maximum number of features to display."
    })
], WebFeatureServiceCatalogItemTraits.prototype, "maxFeatures", void 0);
__decorate([
    anyTrait({
        name: "Parameters",
        description: "Additional parameters to pass to the WFS Server when requesting features."
    })
], WebFeatureServiceCatalogItemTraits.prototype, "parameters", void 0);
__decorate([
    objectTrait({
        type: StyleTraits,
        name: "Style",
        description: "Styling rules that follow [simplestyle-spec](https://github.com/mapbox/simplestyle-spec)"
    })
], WebFeatureServiceCatalogItemTraits.prototype, "style", void 0);
//# sourceMappingURL=WebFeatureServiceCatalogItemTraits.js.map
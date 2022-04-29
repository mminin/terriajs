var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import ModelTraits from "../ModelTraits";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
export class SearchParameterTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "id",
        description: "ID of the search parameter"
    })
], SearchParameterTraits.prototype, "id", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Name",
        description: "A human readable name for the search parameter"
    })
], SearchParameterTraits.prototype, "name", void 0);
__decorate([
    anyTrait({
        name: "queryOptions",
        description: "Options used when querying the parameter, these options will be passed to the index used for querying the parameter."
    })
], SearchParameterTraits.prototype, "queryOptions", void 0);
export class ItemSearchTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "providerType",
        description: "The type of the search provider."
    })
], ItemSearchTraits.prototype, "providerType", void 0);
__decorate([
    anyTrait({
        name: "providerOptions",
        description: "Options for the search provider."
    })
], ItemSearchTraits.prototype, "providerOptions", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "resultTemplate",
        description: "Template string to format the item result. You can pass a mustache template and refer to variables in {@ItemSearchResult.properties}. The template can also have HTML markup or markdown formatting."
    })
], ItemSearchTraits.prototype, "resultTemplate", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "highlightColor",
        description: "A color to use for highlighting the selected result. Defaults to {@HighlightColorTraits.highlightColor} or {@Terria.baseMapContrastColor}"
    })
], ItemSearchTraits.prototype, "highlightColor", void 0);
__decorate([
    objectArrayTrait({
        type: SearchParameterTraits,
        name: "Search parameters",
        description: "Search parameter configurations",
        idProperty: "id"
    })
], ItemSearchTraits.prototype, "parameters", void 0);
export default class SearchableItemTraits extends ModelTraits {
}
__decorate([
    objectTrait({
        type: ItemSearchTraits,
        name: "search",
        description: "Item search configuration"
    })
], SearchableItemTraits.prototype, "search", void 0);
//# sourceMappingURL=SearchableItemTraits.js.map
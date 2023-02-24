var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import ModelTraits from "../ModelTraits";
export class ItemPropertiesByTypeTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Type of model",
        description: "The type of model to apply `itemProperties` to. This must be defined.",
        type: "string"
    })
], ItemPropertiesByTypeTraits.prototype, "type", void 0);
__decorate([
    anyTrait({
        name: "Item Properties",
        description: "Sets traits on group member items of specified `type`. This applies to all nested group members (eg members in sub-groups)"
    })
], ItemPropertiesByTypeTraits.prototype, "itemProperties", void 0);
export class ItemPropertiesByIdTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.ids = [];
    }
}
__decorate([
    primitiveArrayTrait({
        name: "IDs of models",
        description: "The IDs of models to apply `itemProperties` to.",
        type: "string"
    })
], ItemPropertiesByIdTraits.prototype, "ids", void 0);
__decorate([
    anyTrait({
        name: "Item Properties",
        description: "Sets traits on group member items of specified `id`. This applies to all nested group members (eg members in sub-groups)"
    })
], ItemPropertiesByIdTraits.prototype, "itemProperties", void 0);
export class ItemPropertiesTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.itemPropertiesByType = [];
        this.itemPropertiesByIds = [];
    }
}
__decorate([
    anyTrait({
        name: "Item Properties",
        description: "Sets traits on group member items (note - will **not** set traits to sub-groups). This applies to all nested group members (eg members in sub-groups). Also see `itemPropertiesByType` and `itemPropertiesByIds`.\n\n" +
            "Item properties will be set in the following order (highest to lowest priority) `itemPropertiesByIds`, `itemPropertiesByType`, `itemProperties`."
    })
], ItemPropertiesTraits.prototype, "itemProperties", void 0);
__decorate([
    objectArrayTrait({
        name: "Item properties by type",
        description: "Sets traits on group member items by model `type` (eg `csv` or `geojson`). This applies to all nested group members (eg members in sub-groups). Only one `itemProperties` can be specified per `type`.\n\n" +
            "Item properties will be set in the following order (highest to lowest priority) `itemPropertiesByIds`, `itemPropertiesByType`, `itemProperties`.",
        type: ItemPropertiesByTypeTraits,
        idProperty: "type"
    })
], ItemPropertiesTraits.prototype, "itemPropertiesByType", void 0);
__decorate([
    objectArrayTrait({
        name: "Item properties by type",
        description: "Sets traits on group member items by model `ID`. This applies to all nested group members (eg members in sub-groups). Only one `itemProperties` can be specified per `id`.\n\n" +
            "Item properties will be set in the following order (highest to lowest priority) `itemPropertiesByIds`, `itemPropertiesByType`, `itemProperties`.",
        type: ItemPropertiesByIdTraits,
        idProperty: "index"
    })
], ItemPropertiesTraits.prototype, "itemPropertiesByIds", void 0);
//# sourceMappingURL=ItemPropertiesTraits.js.map
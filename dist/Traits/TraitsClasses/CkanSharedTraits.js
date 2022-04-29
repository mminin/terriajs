var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CkanResourceFormatTraits from "./CkanResourceFormatTraits";
import ReferenceTraits from "./ReferenceTraits";
export default class CkanSharedTraits extends mixTraits(ReferenceTraits) {
    constructor() {
        super(...arguments);
        this.useResourceName = false;
        this.useDatasetNameAndFormatWhereMultipleResources = true;
        this.useCombinationNameWhereMultipleResources = false;
        this.useSingleResource = false;
    }
}
__decorate([
    anyTrait({
        name: "Item Properties",
        description: "An object of properties that will be set on the item created from the CKAN resource."
    })
], CkanSharedTraits.prototype, "itemProperties", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Use resource name",
        description: `True to use the name of the resource for the name of the catalog item; false to use the name of the dataset.`
    })
], CkanSharedTraits.prototype, "useResourceName", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Use combination name where multiple resources",
        description: `Use a combination of the name and the resource format and dataset where there are multiple resources for a single dataset.`
    })
], CkanSharedTraits.prototype, "useDatasetNameAndFormatWhereMultipleResources", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Use combination of dataset and resource name where multiple resources",
        description: `Use a combination of the name and the resource and dataset name where there are multiple resources for a single dataset.`
    })
], CkanSharedTraits.prototype, "useCombinationNameWhereMultipleResources", void 0);
__decorate([
    objectArrayTrait({
        name: "Supported Resource Formats",
        description: "The supported distribution formats and their mapping to Terria types. " +
            "These are listed in order of preference.",
        type: CkanResourceFormatTraits,
        idProperty: "id"
    })
], CkanSharedTraits.prototype, "supportedResourceFormats", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Use single resource",
        description: `Only use a single resource for each dataset. If multiple resources exist, the highest match from \`supportedResourceFormats\` will be used. If this is true, then \`useDatasetNameAndFormatWhereMultipleResources\` and \`useCombinationNameWhereMultipleResources\` will be ignored`
    })
], CkanSharedTraits.prototype, "useSingleResource", void 0);
//# sourceMappingURL=CkanSharedTraits.js.map
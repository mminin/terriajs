var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * A catalog item to use when we get given a definition we cannot parse
 */
import CreateModel from "../../Definition/CreateModel";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import mixTraits from "../../../Traits/mixTraits";
import CatalogMemberTraits from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import primitiveTrait from "../../../Traits/Decorators/primitiveTrait";
export class StubCatalogItemTraits extends mixTraits(CatalogMemberTraits) {
    constructor() {
        super(...arguments);
        this.isExperiencingIssues = true;
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is experiencing issues",
        description: "Whether the catalog item is experiencing issues which may cause its data to be unavailable"
    })
], StubCatalogItemTraits.prototype, "isExperiencingIssues", void 0);
export default class StubCatalogItem extends CatalogMemberMixin(CreateModel(StubCatalogItemTraits)) {
    get type() {
        return StubCatalogItem.type;
    }
    forceLoadMetadata() {
        return Promise.resolve();
    }
}
StubCatalogItem.type = "stub";
//# sourceMappingURL=StubCatalogItem.js.map
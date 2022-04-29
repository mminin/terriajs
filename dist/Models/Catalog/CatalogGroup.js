import CatalogMemberMixin from "../../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../../ModelMixins/GroupMixin";
import CatalogGroupTraits from "../../Traits/TraitsClasses/CatalogGroupTraits";
import CreateModel from "../Definition/CreateModel";
export default class CatalogGroup extends GroupMixin(CatalogMemberMixin(CreateModel(CatalogGroupTraits))) {
    get type() {
        return CatalogGroup.type;
    }
    forceLoadMembers() {
        return Promise.resolve();
    }
}
CatalogGroup.type = "group";
//# sourceMappingURL=CatalogGroup.js.map
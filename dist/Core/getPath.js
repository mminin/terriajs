import CatalogMemberMixin from "../ModelMixins/CatalogMemberMixin";
import getAncestors from "../Models/getAncestors";
import getDereferencedIfExists from "./getDereferencedIfExists";
import isDefined from "./isDefined";
export default function getPath(item, separator) {
    const sep = isDefined(separator) ? separator : "/";
    return getParentGroups(item).join(sep);
}
export function getParentGroups(item) {
    const dereferenced = getDereferencedIfExists(item);
    return [
        ...getAncestors(dereferenced).map(getDereferencedIfExists),
        dereferenced
    ].map(ancestor => (CatalogMemberMixin.isMixedInto(ancestor) && ancestor.nameInCatalog) ||
        ancestor.uniqueId);
}
//# sourceMappingURL=getPath.js.map
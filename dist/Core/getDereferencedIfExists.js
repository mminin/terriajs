import ReferenceMixin from "../ModelMixins/ReferenceMixin";
export default function getDereferencedIfExists(item) {
    if (ReferenceMixin.isMixedInto(item) && item.target) {
        return item.target;
    }
    return item;
}
//# sourceMappingURL=getDereferencedIfExists.js.map
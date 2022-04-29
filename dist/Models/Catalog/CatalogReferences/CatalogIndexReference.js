import filterOutUndefined from "../../../Core/filterOutUndefined";
import flatten from "../../../Core/flatten";
import TerriaError from "../../../Core/TerriaError";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import ReferenceMixin from "../../../ModelMixins/ReferenceMixin";
import CatalogIndexReferenceTraits from "../../../Traits/TraitsClasses/CatalogIndexReferenceTraits";
import CreateModel from "../../Definition/CreateModel";
import { BaseModel } from "../../Definition/Model";
/** The `CatalogIndexReference` is used to resolve items in the `catalogIndex` to actual models in terria.models.
 *
 * The `catalogIndex` is a "stripped-down" fully resolved tree of models generated using the `generateCatalogIndex` script.
 * An item in the `catalogIndex` will have `CatalogMemberReferenceTraits` with an additional `memberKnownContainerUniqueIds`.
 *
 * This means we can use the `catalogIndex` to search the entire catalog without loading models.
 *
 * When `loadReference` is called, it will attempt to load all parent models first (using `memberKnownContainerUniqueIds`)
 */
export default class CatalogIndexReference extends ReferenceMixin(CreateModel(CatalogIndexReferenceTraits)) {
    constructor() {
        super(...arguments);
        this.weakReference = true;
    }
    get type() {
        return CatalogIndexReference.type;
    }
    async forceLoadReference(previousTarget) {
        var _a, _b, _c, _d;
        if (this.uniqueId === undefined) {
            return;
        }
        // If member already exists - return it
        let member = this.terria.getModelById(BaseModel, this.uniqueId);
        if (member) {
            return member;
        }
        const errors = [];
        // No member exists, so try to load containers
        // Get full list of containers by recursively searching for parent models
        const findContainers = (model) => [
            ...model.memberKnownContainerUniqueIds,
            ...flatten(filterOutUndefined(model.memberKnownContainerUniqueIds.map(parentId => {
                var _a, _b;
                const parent = (_b = (_a = model.terria.catalogIndex) === null || _a === void 0 ? void 0 : _a.models) === null || _b === void 0 ? void 0 : _b.get(parentId);
                if (parent) {
                    return findContainers(parent);
                }
            })))
        ];
        const containers = findContainers(this).reverse();
        // Load containers
        if (containers) {
            for (let i = 0; i < containers.length; i++) {
                const containerId = containers[i];
                let container = this.terria.getModelById(BaseModel, containerId);
                if (!container) {
                    errors.push(TerriaError.from(`Failed to find containerID ${containerId}`));
                }
                if (ReferenceMixin.isMixedInto(container)) {
                    (await container.loadReference()).pushErrorTo(errors, `Failed to load reference ${container.uniqueId}`);
                    container = (_a = container.target) !== null && _a !== void 0 ? _a : container;
                }
                if (GroupMixin.isMixedInto(container)) {
                    (await container.loadMembers()).pushErrorTo(errors, `Failed to load group ${container.uniqueId}`);
                }
            }
        }
        // Does member exist now? - return it
        member = this.terria.getModelById(BaseModel, this.uniqueId);
        if (member) {
            // member.sourceReference = target.sourceReference
            return member;
        }
        // No member exists - throw error
        throw (_c = TerriaError.combine(errors, `Failed to find member ${(_b = this.name) !== null && _b !== void 0 ? _b : this.uniqueId}`)) !== null && _c !== void 0 ? _c : TerriaError.from(`Failed to find member ${(_d = this.name) !== null && _d !== void 0 ? _d : this.uniqueId}`);
    }
}
CatalogIndexReference.type = "catalog-index-reference";
//# sourceMappingURL=CatalogIndexReference.js.map
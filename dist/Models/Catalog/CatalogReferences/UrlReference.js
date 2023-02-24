import ReferenceMixin from "../../../ModelMixins/ReferenceMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import CatalogMemberFactory from "../CatalogMemberFactory";
import CreateModel from "../../Definition/CreateModel";
import UrlReferenceTraits from "../../../Traits/TraitsClasses/UrlReferenceTraits";
import StratumOrder from "../../Definition/StratumOrder";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import updateModelFromJson from "../../Definition/updateModelFromJson";
const urlRecordStratum = "url-record";
StratumOrder.addDefaultStratum(urlRecordStratum);
export default class UrlReference extends UrlMixin(ReferenceMixin(CreateModel(UrlReferenceTraits))) {
    constructor(id, terria, sourceReference, strata) {
        super(id, terria, sourceReference, strata);
    }
    get type() {
        return UrlReference.type;
    }
    forceLoadReference(previousTarget) {
        if (this.url === undefined || this.uniqueId === undefined) {
            return Promise.resolve(undefined);
        }
        const target = UrlReference.createCatalogMemberFromUrlReference(this, this.uniqueId, this.url, this.terria, this.allowLoad || false);
        return Promise.resolve(target);
    }
    static async createCatalogMemberFromUrlReference(sourceReference, id, url, terria, allowLoad, _index) {
        const index = _index || 0;
        if (index >= UrlToCatalogMemberMapping.mapping.length) {
            return Promise.resolve(undefined);
        }
        // Does the mapping at this index match this url?
        // Can we load it if we need to?
        if ((UrlToCatalogMemberMapping.mapping[index].matcher &&
            !UrlToCatalogMemberMapping.mapping[index].matcher(url)) ||
            (UrlToCatalogMemberMapping.mapping[index].requiresLoad && !allowLoad)) {
            // Nope, try the mapping at the next index.
            return UrlReference.createCatalogMemberFromUrlReference(sourceReference, id, url, terria, allowLoad, index + 1);
        }
        else {
            // We've got a match! Try and create a model
            const item = CatalogMemberFactory.create(UrlToCatalogMemberMapping.mapping[index].type, sourceReference.uniqueId, terria, sourceReference);
            if (item === undefined) {
                // Creating the model failed, try the mapping at the next index
                return UrlReference.createCatalogMemberFromUrlReference(sourceReference, id, url, terria, allowLoad, index + 1);
            }
            updateModelFromJson(item, urlRecordStratum, {
                name: url,
                url: url
            }).logError();
            if (allowLoad && CatalogMemberMixin.isMixedInto(item)) {
                const loadMetadataResult = await item.loadMetadata();
                if (loadMetadataResult.error) {
                    return UrlReference.createCatalogMemberFromUrlReference(sourceReference, id, url, terria, allowLoad, index + 1);
                }
            }
            return item;
        }
    }
}
UrlReference.type = "url-reference";
export class UrlMapping {
    constructor() {
        this.mapping = [];
    }
    register(matcher, type, requiresLoad) {
        this.mapping.push({
            matcher,
            type,
            requiresLoad: Boolean(requiresLoad)
        });
    }
}
export const UrlToCatalogMemberMapping = new UrlMapping();
//# sourceMappingURL=UrlReference.js.map
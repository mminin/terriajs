import i18next from "i18next";
import { runInAction } from "mobx";
import ReferenceMixin from "../../../ModelMixins/ReferenceMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import ThreddsItemReferenceTraits from "../../../Traits/TraitsClasses/ThreddsItemReferenceTraits";
import CatalogMemberFactory from "../CatalogMemberFactory";
import CreateModel from "../../Definition/CreateModel";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import WebMapServiceCatalogGroup from "../Ows/WebMapServiceCatalogGroup";
export class ThreddsDatasetStratum extends LoadableStratum(ThreddsItemReferenceTraits) {
    constructor(threddsItemReference, threddsDataset) {
        super();
        this.threddsItemReference = threddsItemReference;
        this.threddsDataset = threddsDataset;
    }
    duplicateLoadableStratum(newModel) {
        return new ThreddsDatasetStratum(this.threddsItemReference, this.threddsDataset);
    }
    static load(threddsItemReference, threddsDataset) {
        return new ThreddsDatasetStratum(threddsItemReference, threddsDataset);
    }
    get name() {
        if (this.threddsDataset === undefined)
            return undefined;
        return this.threddsDataset.name;
    }
    get url() {
        if (this.threddsDataset === undefined)
            return undefined;
        return this.threddsDataset.wmsUrl;
    }
}
ThreddsDatasetStratum.stratumName = "threddsDataset";
StratumOrder.addLoadStratum(ThreddsDatasetStratum.stratumName);
export default class ThreddsItemReference extends UrlMixin(ReferenceMixin(CreateModel(ThreddsItemReferenceTraits))) {
    constructor(id, terria, sourceReference, strata) {
        super(id, terria, sourceReference, strata);
        this._threddsDataset = undefined;
        this._threddsCatalogGroup = undefined;
    }
    get type() {
        return ThreddsItemReference.type;
    }
    get typeName() {
        return i18next.t("models.threddsItem.name");
    }
    setDataset(dataset) {
        this._threddsDataset = dataset;
    }
    setThreddsCatalogGroup(group) {
        this._threddsCatalogGroup = group;
    }
    setThreddsStrata(model) {
        if (this._threddsDataset === undefined)
            return;
        if (model.strata.get(ThreddsDatasetStratum.stratumName) !== undefined)
            return;
        const stratum = ThreddsDatasetStratum.load(this, this._threddsDataset);
        if (stratum === undefined)
            return;
        runInAction(() => {
            model.strata.set(ThreddsDatasetStratum.stratumName, stratum);
        });
    }
    passThreddsStrata(model) {
        const threddsStrata = this.strata.get(ThreddsDatasetStratum.stratumName);
        if (threddsStrata === undefined)
            return;
        runInAction(() => {
            model.strata.set(ThreddsDatasetStratum.stratumName, threddsStrata);
        });
    }
    async forceLoadReference(previousTarget) {
        this.setThreddsStrata(this);
        const model = CatalogMemberFactory.create(WebMapServiceCatalogGroup.type, this.uniqueId, this.terria, this);
        if (model === undefined)
            return;
        this.setThreddsStrata(model);
        previousTarget = model;
        return model;
    }
}
ThreddsItemReference.type = "thredds-item";
//# sourceMappingURL=ThreddsItemReference.js.map
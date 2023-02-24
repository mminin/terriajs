var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, runInAction } from "mobx";
import threddsCrawler from "thredds-catalog-crawler/src/entryBrowser";
import isDefined from "../../../Core/isDefined";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import ThreddsCatalogGroupTraits from "../../../Traits/TraitsClasses/ThreddsCatalogGroupTraits";
import CatalogGroup from "../CatalogGroup";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import LoadableStratum from "../../Definition/LoadableStratum";
import { proxyCatalogItemBaseUrl } from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
import ThreddsItemReference from "../CatalogReferences/ThreddsItemReference";
export class ThreddsStratum extends LoadableStratum(ThreddsCatalogGroupTraits) {
    constructor(_catalogGroup) {
        super();
        this._catalogGroup = _catalogGroup;
        this.threddsCatalog = undefined;
    }
    duplicateLoadableStratum(model) {
        return new ThreddsStratum(model);
    }
    static async load(catalogGroup) {
        return new ThreddsStratum(catalogGroup);
    }
    get members() {
        if (this.threddsCatalog === undefined)
            return [];
        const memberIds = [];
        this.threddsCatalog.catalogs.forEach((catalog) => {
            memberIds.push(`${this._catalogGroup.uniqueId}/${catalog.id}`);
        });
        this.threddsCatalog.datasets.forEach((dataset) => {
            dataset.catalogs.forEach((c) => {
                memberIds.push(`${this._catalogGroup.uniqueId}/${c.id}`);
            });
            memberIds.push(`${this._catalogGroup.uniqueId}/${dataset.id}`);
        });
        return memberIds;
    }
    createThreddsCatalog(catalog) {
        const id = `${this._catalogGroup.uniqueId}/${catalog.id}`;
        let model = this._catalogGroup.terria.getModelById(ThreddsCatalogGroup, id);
        if (!isDefined(model)) {
            model = new ThreddsCatalogGroup(id, this._catalogGroup.terria);
            this._catalogGroup.terria.addModel(model);
        }
        model.setTrait(CommonStrata.definition, "name", catalog.title);
        model.setTrait(CommonStrata.definition, "url", catalog.url);
    }
    async createMembers() {
        if (!isDefined(this._catalogGroup.url))
            return;
        let proxy = proxyCatalogItemBaseUrl(this._catalogGroup, this._catalogGroup.url);
        this.threddsCatalog = await threddsCrawler(this._catalogGroup.url, proxy
            ? {
                proxy
            }
            : undefined);
        if (this.threddsCatalog === undefined)
            return;
        // Create sub-groups for any nested catalogs
        for (let i = 0; i < this.threddsCatalog.catalogs.length; i++) {
            this.createThreddsCatalog(this.threddsCatalog.catalogs[i]);
        }
        // Create members for individual datasets
        for (let i = 0; i < this.threddsCatalog.datasets.length; i++) {
            const ds = this.threddsCatalog.datasets[i];
            await ds.loadAllNestedCatalogs();
            for (let ii = 0; ii < ds.catalogs.length; ii++) {
                this.createThreddsCatalog(ds.catalogs[ii]);
            }
            if (ds.isParentDataset) {
                let parent = this._catalogGroup;
                if (this.threddsCatalog.datasets.length > 1) {
                    const id = `${this._catalogGroup.uniqueId}/${ds.id}`;
                    let model = this._catalogGroup.terria.getModelById(CatalogGroup, id);
                    if (!isDefined(model)) {
                        model = new CatalogGroup(id, this._catalogGroup.terria);
                        this._catalogGroup.terria.addModel(model);
                    }
                    model.setTrait(CommonStrata.definition, "name", ds.name);
                    parent = model;
                }
                ds.datasets.forEach((dataset) => {
                    const item = this.createMemberFromDataset(dataset);
                    if (item !== undefined)
                        parent.add(CommonStrata.definition, item);
                });
            }
            else if (ds.supportsWms) {
                this.createMemberFromDataset(ds);
            }
        }
    }
    createMemberFromDataset(threddsDataset) {
        if (!isDefined(threddsDataset.id)) {
            return undefined;
        }
        const itemId = this._catalogGroup.uniqueId + "/" + threddsDataset.id;
        let item = this._catalogGroup.terria.getModelById(ThreddsItemReference, itemId);
        if (item === undefined) {
            item = new ThreddsItemReference(itemId, this._catalogGroup.terria);
            item.setTrait(CommonStrata.definition, "isGroup", true);
            item.setDataset(threddsDataset);
            item.setThreddsStrata(item);
            item.terria.addModel(item);
        }
        return item;
    }
}
ThreddsStratum.stratumName = "thredds";
__decorate([
    computed
], ThreddsStratum.prototype, "members", null);
__decorate([
    action
], ThreddsStratum.prototype, "createThreddsCatalog", null);
__decorate([
    action
], ThreddsStratum.prototype, "createMembers", null);
__decorate([
    action
], ThreddsStratum.prototype, "createMemberFromDataset", null);
StratumOrder.addLoadStratum(ThreddsStratum.stratumName);
export default class ThreddsCatalogGroup extends UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(ThreddsCatalogGroupTraits)))) {
    get type() {
        return ThreddsCatalogGroup.type;
    }
    get typeName() {
        return i18next.t("models.thredds.nameGroup");
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "1d";
    }
    async forceLoadMetadata() {
        if (!this.strata.get(ThreddsStratum.stratumName)) {
            const stratum = await ThreddsStratum.load(this);
            if (stratum === undefined)
                return;
            await stratum.createMembers();
            runInAction(() => {
                this.strata.set(ThreddsStratum.stratumName, stratum);
            });
        }
    }
    async forceLoadMembers() {
        const stratum = this.strata.get(ThreddsStratum.stratumName);
        if (stratum) {
            await stratum.createMembers();
        }
    }
}
ThreddsCatalogGroup.type = "thredds-group";
__decorate([
    computed
], ThreddsCatalogGroup.prototype, "cacheDuration", null);
//# sourceMappingURL=ThreddsCatalogGroup.js.map
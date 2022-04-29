var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ApiClient, fromCatalog } from "@opendatasoft/api-client";
import i18next from "i18next";
import { action, computed, runInAction } from "mobx";
import URI from "urijs";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import runLater from "../../../Core/runLater";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import { MetadataUrlTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import OpenDataSoftCatalogGroupTraits, { RefineTraits } from "../../../Traits/TraitsClasses/OpenDataSoftCatalogGroupTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import OpenDataSoftCatalogItem from "../CatalogItems/OpenDataSoftCatalogItem";
export class OpenDataSoftCatalogStratum extends LoadableStratum(OpenDataSoftCatalogGroupTraits) {
    constructor(catalogGroup, facetName, facets, datasets) {
        super();
        this.catalogGroup = catalogGroup;
        this.facetName = facetName;
        this.facets = facets;
        this.datasets = datasets;
    }
    static async load(catalogGroup) {
        var _a, _b, _c;
        if (!catalogGroup.url)
            throw "`url` must be set";
        const client = new ApiClient({
            domain: catalogGroup.url
        });
        let datasets;
        let facets;
        // If no facetFilters, try to get some facets
        if (catalogGroup.facetFilters &&
            catalogGroup.facetFilters.length === 0 &&
            !catalogGroup.flatten) {
            facets = (_a = (await client.get(fromCatalog().facets())).facets) === null || _a === void 0 ? void 0 : _a.filter(f => isValidFacet(f));
        }
        // If no facets (or we have facetFiles) - get datasets
        if (!facets || facets.length === 0) {
            let q = fromCatalog()
                .datasets()
                .limit(100)
                .orderBy("title asc")
                // Filter dataset with 'geo' or 'timeserie' features.
                // Possible values: calendar, geo, image, apiproxy, timeserie, and aggregate
                .where(`features = "geo" OR features = "timeserie"`);
            // If facet filters, use them to filter datasets
            if (catalogGroup.facetFilters && catalogGroup.facetFilters.length > 0) {
                q = q.refine(catalogGroup.facetFilters.map(f => `${f.name}:${f.value}`).join(","));
            }
            const catalog = await client.get(q);
            datasets = filterOutUndefined((_c = (_b = catalog.datasets) === null || _b === void 0 ? void 0 : _b.map(d => d.dataset).filter(d => isValidDataset(d))) !== null && _c !== void 0 ? _c : []);
        }
        return new OpenDataSoftCatalogStratum(catalogGroup, undefined, facets !== null && facets !== void 0 ? facets : [], datasets !== null && datasets !== void 0 ? datasets : []);
    }
    duplicateLoadableStratum(model) {
        return new OpenDataSoftCatalogStratum(model, this.facetName, this.facets, this.datasets);
    }
    get members() {
        return [
            ...this.facets.map(f => this.getFacetId(f)),
            ...this.datasets.map(d => this.getDatasetId(d))
        ];
    }
    createMembers() {
        this.facets.forEach(facet => this.createGroupFromFacet(facet));
        this.datasets.forEach(dataset => this.createMemberFromDataset(dataset));
    }
    /** Turn facet into OpenDataSoftCatalogGroup */
    createGroupFromFacet(facet) {
        var _a;
        const layerId = this.getFacetId(facet);
        if (!layerId) {
            return;
        }
        const existingGroupModel = this.catalogGroup.terria.getModelById(OpenDataSoftCatalogGroup, layerId);
        let groupModel;
        if (existingGroupModel === undefined) {
            groupModel = new OpenDataSoftCatalogGroup(layerId, this.catalogGroup.terria, undefined);
            this.catalogGroup.terria.addModel(groupModel);
        }
        else {
            groupModel = existingGroupModel;
        }
        // Replace the stratum inherited from the parent group.
        const stratum = CommonStrata.underride;
        groupModel.strata.delete(stratum);
        groupModel.setTrait(stratum, "name", `${facet.name}${facet.count ? ` (${(_a = facet.count) !== null && _a !== void 0 ? _a : 0})` : ""}`);
        groupModel.setTrait(stratum, "url", this.catalogGroup.url);
        // Set OpenDataSoftDatasetStratum so it doesn't have to be loaded gain
        groupModel.strata.delete(OpenDataSoftCatalogStratum.stratumName);
        // If no more facets, set facetFilter
        if (!facet.facets ||
            !Array.isArray(facet.facets) ||
            facet.facets.length === 0) {
            groupModel.setTrait(stratum, "facetFilters", [
                createStratumInstance(RefineTraits, {
                    name: this.facetName,
                    value: facet.name
                })
            ]);
        }
        else {
            groupModel.strata.set(OpenDataSoftCatalogStratum.stratumName, new OpenDataSoftCatalogStratum(groupModel, facet.name, facet.facets, []));
        }
    }
    /** Turn dataset into OpenDataSoftCatalogItem */
    createMemberFromDataset(dataset) {
        var _a, _b, _c, _d, _e, _f;
        const layerId = this.getDatasetId(dataset);
        if (!layerId) {
            return;
        }
        const existingItemModel = this.catalogGroup.terria.getModelById(OpenDataSoftCatalogItem, layerId);
        let itemModel;
        if (existingItemModel === undefined) {
            itemModel = new OpenDataSoftCatalogItem(layerId, this.catalogGroup.terria, undefined);
            this.catalogGroup.terria.addModel(itemModel);
            // Add older shareKey
            this.catalogGroup.terria.addShareKey(layerId, `${this.catalogGroup.uniqueId}/${dataset.dataset_id}`);
        }
        else {
            itemModel = existingItemModel;
        }
        // Replace the stratum inherited from the parent group.
        const stratum = CommonStrata.underride;
        itemModel.strata.delete(stratum);
        itemModel.setTrait(stratum, "datasetId", dataset.dataset_id);
        itemModel.setTrait(stratum, "url", this.catalogGroup.url);
        itemModel.setTrait(stratum, "name", (_c = (_b = (_a = dataset.metas) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : dataset.dataset_id);
        itemModel.setTrait(stratum, "description", (_f = (_e = (_d = dataset.metas) === null || _d === void 0 ? void 0 : _d.default) === null || _e === void 0 ? void 0 : _e.description) !== null && _f !== void 0 ? _f : undefined);
        itemModel.setTrait(stratum, "metadataUrls", [
            createStratumInstance(MetadataUrlTraits, {
                title: i18next.t("models.openDataSoft.viewDatasetPage"),
                url: `${this.catalogGroup.url}/explore/dataset/${dataset.dataset_id}/information/`
            })
        ]);
    }
    getDatasetId(dataset) {
        // Use OpenDataSoft server hostname for datasets, so we don't create multiple across facets
        return `${this.catalogGroup.url
            ? URI(this.catalogGroup.url).hostname()
            : this.catalogGroup.uniqueId}/${dataset.dataset_id}`;
    }
    getFacetId(facet) {
        return `${this.catalogGroup.uniqueId}/${facet.name}`;
    }
}
OpenDataSoftCatalogStratum.stratumName = "openDataSoftCatalog";
__decorate([
    computed
], OpenDataSoftCatalogStratum.prototype, "members", null);
__decorate([
    action
], OpenDataSoftCatalogStratum.prototype, "createGroupFromFacet", null);
__decorate([
    action
], OpenDataSoftCatalogStratum.prototype, "createMemberFromDataset", null);
StratumOrder.addLoadStratum(OpenDataSoftCatalogStratum.stratumName);
export default class OpenDataSoftCatalogGroup extends UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(OpenDataSoftCatalogGroupTraits)))) {
    get type() {
        return OpenDataSoftCatalogGroup.type;
    }
    async forceLoadMetadata() {
        if (!this.strata.has(OpenDataSoftCatalogStratum.stratumName)) {
            const stratum = await OpenDataSoftCatalogStratum.load(this);
            runInAction(() => {
                this.strata.set(OpenDataSoftCatalogStratum.stratumName, stratum);
            });
        }
    }
    async forceLoadMembers() {
        const opendatasoftServerStratum = (this.strata.get(OpenDataSoftCatalogStratum.stratumName));
        if (opendatasoftServerStratum) {
            await runLater(() => opendatasoftServerStratum.createMembers());
        }
    }
}
OpenDataSoftCatalogGroup.type = "opendatasoft-group";
export function isValidDataset(dataset) {
    return isDefined(dataset) && isDefined(dataset.dataset_id);
}
export function isValidFacet(facet) {
    var _a;
    return (isDefined(facet) &&
        isDefined(facet.name) &&
        ((_a = facet.facets) !== null && _a !== void 0 ? _a : []).reduce((valid, current) => valid && isValidFacet(current), true));
}
//# sourceMappingURL=OpenDataSoftCatalogGroup.js.map
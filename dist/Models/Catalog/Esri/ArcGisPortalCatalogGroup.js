var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, runInAction } from "mobx";
import URI from "urijs";
import isDefined from "../../../Core/isDefined";
import loadJson from "../../../Core/loadJson";
import runLater from "../../../Core/runLater";
import { networkRequestError } from "../../../Core/TerriaError";
import AccessControlMixin from "../../../ModelMixins/AccessControlMixin";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import ArcGisPortalCatalogGroupTraits from "../../../Traits/TraitsClasses/ArcGisPortalCatalogGroupTraits";
import ArcGisPortalItemReference from "./ArcGisPortalItemReference";
import CatalogGroup from "../CatalogGroup";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
export class ArcGisPortalStratum extends LoadableStratum(ArcGisPortalCatalogGroupTraits) {
    constructor(_catalogGroup, _arcgisResponse, _arcgisGroupResponse) {
        super();
        this._catalogGroup = _catalogGroup;
        this._arcgisResponse = _arcgisResponse;
        this._arcgisGroupResponse = _arcgisGroupResponse;
        this.groups = [];
        this.filteredGroups = [];
        this.datasets = [];
        this.filteredDatasets = [];
        this.datasets = this.getDatasets();
        this.filteredDatasets = this.getFilteredDatasets();
        this.groups = this.getGroups();
        this.filteredGroups = this.getFilteredGroups();
    }
    duplicateLoadableStratum(model) {
        return new ArcGisPortalStratum(model, this._arcgisResponse, this._arcgisGroupResponse);
    }
    static async load(catalogGroup) {
        var terria = catalogGroup.terria;
        let portalGroupsServerResponse = undefined;
        let portalItemsServerResponse = undefined;
        // If we need to group by groups we use slightly different API's
        // that allow us to get the data more effectively
        if (catalogGroup.groupBy === "organisationsGroups" ||
            catalogGroup.groupBy === "usersGroups") {
            if (catalogGroup.groupBy === "organisationsGroups") {
                const groupSearchUri = new URI(catalogGroup.url)
                    .segment("/sharing/rest/community/groups")
                    .addQuery({ num: 100, f: "json" });
                if (catalogGroup.groupSearchParams !== undefined) {
                    const groupSearchParams = catalogGroup.groupSearchParams;
                    Object.keys(groupSearchParams).forEach((key) => groupSearchUri.addQuery(key, groupSearchParams[key]));
                }
                portalGroupsServerResponse = await paginateThroughResults(groupSearchUri, catalogGroup);
                if (portalGroupsServerResponse === undefined)
                    return undefined;
            }
            else if (catalogGroup.groupBy === "usersGroups") {
                const groupSearchUri = new URI(catalogGroup.url)
                    .segment(`/sharing/rest/community/self`)
                    .addQuery({ f: "json" });
                const response = await getPortalInformation(groupSearchUri, catalogGroup);
                if (response === undefined)
                    return undefined;
                portalGroupsServerResponse = {
                    total: response.groups.length,
                    results: response.groups,
                    start: 0,
                    num: 0,
                    nextStart: 0
                };
            }
            if (portalGroupsServerResponse === undefined)
                return undefined;
            // Then for each group we've got access to we get the content
            for (let i = 0; i < portalGroupsServerResponse.results.length; ++i) {
                const group = portalGroupsServerResponse.results[i];
                const groupItemSearchUri = new URI(catalogGroup.url)
                    .segment(`/sharing/rest/content/groups/${group.id}/search`)
                    .addQuery({ num: 100, f: "json" });
                if (catalogGroup.searchParams) {
                    const searchParams = catalogGroup.searchParams;
                    Object.keys(searchParams).forEach((key) => groupItemSearchUri.addQuery(key, searchParams[key]));
                }
                const groupResponse = await paginateThroughResults(groupItemSearchUri, catalogGroup);
                if (groupResponse === undefined)
                    return undefined;
                groupResponse.results.forEach((item) => {
                    item.groupId = group.id;
                });
                if (i === 0) {
                    portalItemsServerResponse = groupResponse;
                }
                else if (portalItemsServerResponse !== undefined &&
                    groupResponse !== undefined) {
                    portalItemsServerResponse.results = portalItemsServerResponse.results.concat(groupResponse.results);
                }
            }
        }
        else {
            // If we don't need to group by Portal Groups then we'll search using
            // the regular endpoint
            const itemSearchUri = new URI(catalogGroup.url)
                .segment("/sharing/rest/search")
                .addQuery({ num: 100, f: "json" });
            if (catalogGroup.searchParams !== undefined) {
                const searchParams = catalogGroup.searchParams;
                const params = Object.keys(searchParams);
                params.forEach((key) => itemSearchUri.addQuery(key, searchParams[key]));
            }
            portalItemsServerResponse = await paginateThroughResults(itemSearchUri, catalogGroup);
            if (catalogGroup.groupBy === "portalCategories" &&
                portalItemsServerResponse !== undefined) {
                const categories = new Map();
                portalItemsServerResponse.results.forEach(function (item) {
                    item.categories.forEach(function (category, index) {
                        if (index === 0) {
                            item.groupId = category;
                        }
                        // "/Categories/Land Parcel and Property"
                        if (!categories.has(category)) {
                            const categoryPieces = category.split("/");
                            const categoryGroup = {
                                id: category,
                                title: categoryPieces[categoryPieces.length - 1]
                            };
                            categories.set(category, categoryGroup);
                        }
                    });
                });
                portalGroupsServerResponse = {
                    total: categories.size,
                    results: Array.from(categories.values()),
                    start: 0,
                    num: 0,
                    nextStart: 0
                };
            }
        }
        if (portalItemsServerResponse === undefined)
            return undefined;
        return new ArcGisPortalStratum(catalogGroup, portalItemsServerResponse, portalGroupsServerResponse);
    }
    get members() {
        if (this.filteredGroups.length > 0) {
            const groupIds = [];
            this.filteredGroups.forEach(g => {
                if (this._catalogGroup.hideEmptyGroups && g.members.length > 0) {
                    groupIds.push(g.uniqueId);
                }
                else if (!this._catalogGroup.hideEmptyGroups) {
                    groupIds.push(g.uniqueId);
                }
            });
            return groupIds;
        }
        // Otherwise return the id's of all the resources of all the filtered datasets
        return this.filteredDatasets.map(ds => {
            return this._catalogGroup.uniqueId + "/" + ds.id;
        }, this);
    }
    getDatasets() {
        return this._arcgisResponse.results;
    }
    getFilteredDatasets() {
        if (this.datasets.length === 0)
            return [];
        if (this._catalogGroup.excludeMembers !== undefined) {
            const bl = this._catalogGroup.excludeMembers;
            return this.datasets.filter(ds => bl.indexOf(ds.title) === -1);
        }
        return this.datasets;
    }
    getGroups() {
        if (this._catalogGroup.groupBy === "none")
            return [];
        let groups = [
            ...createUngroupedGroup(this),
            ...createGroupsByPortalGroups(this)
        ];
        groups.sort(function (a, b) {
            if (a.nameInCatalog === undefined || b.nameInCatalog === undefined)
                return 0;
            if (a.nameInCatalog < b.nameInCatalog) {
                return -1;
            }
            if (a.nameInCatalog > b.nameInCatalog) {
                return 1;
            }
            return 0;
        });
        return groups;
    }
    getFilteredGroups() {
        if (this.groups.length === 0)
            return [];
        if (this._catalogGroup.excludeMembers !== undefined) {
            const bl = this._catalogGroup.excludeMembers;
            return this.groups.filter(group => {
                if (group.name === undefined)
                    return false;
                else
                    return bl.indexOf(group.name) === -1;
            });
        }
        return this.groups;
    }
    createMembersFromDatasets() {
        this.filteredDatasets.forEach(dataset => {
            this.createMemberFromDataset(dataset);
        });
    }
    addCatalogItemToCatalogGroup(catalogItem, dataset, groupId) {
        let group = this._catalogGroup.terria.getModelById(CatalogGroup, groupId);
        if (group !== undefined) {
            group.add(CommonStrata.definition, catalogItem);
        }
    }
    addCatalogItemByPortalGroupsToCatalogGroup(catalogItem, dataset) {
        if (dataset.groupId === undefined) {
            const groupId = this._catalogGroup.uniqueId + "/ungrouped";
            this.addCatalogItemToCatalogGroup(catalogItem, dataset, groupId);
            return;
        }
        const groupId = this._catalogGroup.uniqueId + "/" + dataset.groupId;
        this.addCatalogItemToCatalogGroup(catalogItem, dataset, groupId);
    }
    createMemberFromDataset(arcgisDataset) {
        if (!isDefined(arcgisDataset.id)) {
            return;
        }
        const id = this._catalogGroup.uniqueId;
        const itemId = `${id}/${arcgisDataset.id}`;
        let item = this._catalogGroup.terria.getModelById(ArcGisPortalItemReference, itemId);
        if (item === undefined) {
            item = new ArcGisPortalItemReference(itemId, this._catalogGroup.terria);
            item.setDataset(arcgisDataset);
            item.setArcgisPortalCatalog(this._catalogGroup);
            item.setSupportedFormatFromItem(arcgisDataset);
            item.setArcgisStrata(item);
            item.terria.addModel(item);
        }
        if (this._catalogGroup.groupBy === "organisationsGroups" ||
            this._catalogGroup.groupBy === "usersGroups" ||
            this._catalogGroup.groupBy === "portalCategories") {
            this.addCatalogItemByPortalGroupsToCatalogGroup(item, arcgisDataset);
        }
        if (AccessControlMixin.isMixedInto(item) &&
            arcgisDataset.access !== undefined) {
            item.setAccessType(arcgisDataset.access);
        }
    }
}
ArcGisPortalStratum.stratumName = "arcgisPortal";
__decorate([
    computed
], ArcGisPortalStratum.prototype, "members", null);
__decorate([
    action
], ArcGisPortalStratum.prototype, "createMembersFromDatasets", null);
__decorate([
    action
], ArcGisPortalStratum.prototype, "addCatalogItemToCatalogGroup", null);
__decorate([
    action
], ArcGisPortalStratum.prototype, "addCatalogItemByPortalGroupsToCatalogGroup", null);
__decorate([
    action
], ArcGisPortalStratum.prototype, "createMemberFromDataset", null);
StratumOrder.addLoadStratum(ArcGisPortalStratum.stratumName);
export default class ArcGisPortalCatalogGroup extends UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(ArcGisPortalCatalogGroupTraits)))) {
    get type() {
        return ArcGisPortalCatalogGroup.type;
    }
    get typeName() {
        return i18next.t("models.arcgisPortal.nameGroup");
    }
    get cacheDuration() {
        if (isDefined(super.cacheDuration)) {
            return super.cacheDuration;
        }
        return "0d";
    }
    forceLoadMetadata() {
        const portalStratum = (this.strata.get(ArcGisPortalStratum.stratumName));
        if (!portalStratum) {
            return ArcGisPortalStratum.load(this).then(stratum => {
                if (stratum === undefined)
                    return;
                runInAction(() => {
                    this.strata.set(ArcGisPortalStratum.stratumName, stratum);
                });
            });
        }
        else {
            return Promise.resolve();
        }
    }
    async forceLoadMembers() {
        const portalStratum = (this.strata.get(ArcGisPortalStratum.stratumName));
        if (portalStratum) {
            await runLater(() => portalStratum.createMembersFromDatasets());
        }
    }
}
ArcGisPortalCatalogGroup.type = "arcgis-portal-group";
__decorate([
    computed
], ArcGisPortalCatalogGroup.prototype, "cacheDuration", null);
function createGroup(groupId, terria, groupName) {
    const g = new CatalogGroup(groupId, terria);
    g.setTrait(CommonStrata.definition, "name", groupName);
    terria.addModel(g);
    return g;
}
function createUngroupedGroup(arcgisPortal) {
    const groupId = arcgisPortal._catalogGroup.uniqueId + "/ungrouped";
    let existingGroup = arcgisPortal._catalogGroup.terria.getModelById(CatalogGroup, groupId);
    if (existingGroup === undefined) {
        existingGroup = createGroup(groupId, arcgisPortal._catalogGroup.terria, arcgisPortal._catalogGroup.ungroupedTitle);
    }
    return [existingGroup];
}
function createGroupsByPortalGroups(arcgisPortal) {
    if (arcgisPortal._arcgisGroupResponse === undefined)
        return [];
    const out = [];
    arcgisPortal._arcgisGroupResponse.results.forEach((group) => {
        const groupId = arcgisPortal._catalogGroup.uniqueId + "/" + group.id;
        let existingGroup = arcgisPortal._catalogGroup.terria.getModelById(CatalogGroup, groupId);
        if (existingGroup === undefined) {
            existingGroup = createGroup(groupId, arcgisPortal._catalogGroup.terria, group.title);
            if (group.description) {
                existingGroup.setTrait(CommonStrata.definition, "description", group.description);
            }
        }
        if (AccessControlMixin.isMixedInto(existingGroup) &&
            group.access !== undefined) {
            existingGroup.setAccessType(group.access);
        }
        out.push(existingGroup);
    });
    return out;
}
async function paginateThroughResults(uri, catalogGroup) {
    const arcgisPortalResponse = await getPortalInformation(uri, catalogGroup);
    if (arcgisPortalResponse === undefined || !arcgisPortalResponse) {
        throw networkRequestError({
            title: i18next.t("models.arcgisPortal.errorLoadingTitle"),
            message: i18next.t("models.arcgisPortal.errorLoadingMessage")
        });
    }
    let nextStart = arcgisPortalResponse.nextStart;
    while (nextStart !== -1) {
        nextStart = await getMoreResults(uri, catalogGroup, arcgisPortalResponse, nextStart);
    }
    return arcgisPortalResponse;
}
async function getPortalInformation(uri, catalogGroup) {
    try {
        const response = await loadJson(proxyCatalogItemUrl(catalogGroup, uri.toString(), catalogGroup.cacheDuration));
        return response;
    }
    catch (err) {
        console.log(err);
        return undefined;
    }
}
async function getMoreResults(uri, catalogGroup, baseResults, nextResultStart) {
    uri.setQuery("start", nextResultStart);
    try {
        const arcgisPortalResponse = await getPortalInformation(uri, catalogGroup);
        if (arcgisPortalResponse === undefined) {
            return -1;
        }
        baseResults.results = baseResults.results.concat(arcgisPortalResponse.results);
        return arcgisPortalResponse.nextStart;
    }
    catch (err) {
        console.log(err);
        return -1;
    }
}
//# sourceMappingURL=ArcGisPortalCatalogGroup.js.map
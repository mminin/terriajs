var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed } from "mobx";
import RequestErrorEvent from "terriajs-cesium/Source/Core/RequestErrorEvent";
import Resource from "terriajs-cesium/Source/Core/Resource";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import flatten from "../../../Core/flatten";
import isDefined from "../../../Core/isDefined";
import { regexMatches } from "../../../Core/regexMatches";
import TerriaError from "../../../Core/TerriaError";
import SdmxCatalogGroupTraits from "../../../Traits/TraitsClasses/SdmxCatalogGroupTraits";
import CatalogGroup from "../CatalogGroup";
import CommonStrata from "../../Definition/CommonStrata";
import LoadableStratum from "../../Definition/LoadableStratum";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
import StratumOrder from "../../Definition/StratumOrder";
import SdmxJsonCatalogItem from "./SdmxJsonCatalogItem";
export class SdmxServerStratum extends LoadableStratum(SdmxCatalogGroupTraits) {
    constructor(catalogGroup, sdmxServer) {
        super();
        this.catalogGroup = catalogGroup;
        this.sdmxServer = sdmxServer;
        this.dataflowTree = {};
        // If categorisations exist => organise Dataflows into a tree!
        if (isDefined(this.sdmxServer.categorisations)) {
            this.sdmxServer.categorisations.forEach((categorisiation) => {
                var _a;
                const categorySchemeUrn = parseSdmxUrn(categorisiation.target);
                const agencyId = categorySchemeUrn === null || categorySchemeUrn === void 0 ? void 0 : categorySchemeUrn.agencyId;
                const categorySchemeId = categorySchemeUrn === null || categorySchemeUrn === void 0 ? void 0 : categorySchemeUrn.resourceId;
                const categoryIds = categorySchemeUrn === null || categorySchemeUrn === void 0 ? void 0 : categorySchemeUrn.descendantIds; // Only support 1 level of categorisiation for now
                const dataflowId = (_a = parseSdmxUrn(categorisiation.source)) === null || _a === void 0 ? void 0 : _a.resourceId;
                if (!isDefined(agencyId) ||
                    !isDefined(categorySchemeId) ||
                    !isDefined(categoryIds) ||
                    !isDefined(dataflowId))
                    return;
                let agencyNode = this.dataflowTree[agencyId];
                // Create agency node if it doesn't exist
                if (!isDefined(agencyNode)) {
                    const agency = this.getAgency(agencyId);
                    if (!isDefined(agency))
                        return;
                    this.dataflowTree[agencyId] = {
                        type: "agencyScheme",
                        item: agency,
                        members: {}
                    };
                    agencyNode = this.dataflowTree[agencyId];
                }
                let categorySchemeNode = agencyNode.members[categorySchemeId];
                // Create categoryScheme node if it doesn't exist
                if (!isDefined(categorySchemeNode)) {
                    const categoryScheme = this.getCategoryScheme(categorySchemeId);
                    if (!isDefined(categoryScheme))
                        return;
                    agencyNode.members[categorySchemeId] = {
                        type: "categoryScheme",
                        item: categoryScheme,
                        members: {}
                    };
                    categorySchemeNode = agencyNode.members[categorySchemeId];
                }
                let categoryParentNode = categorySchemeNode;
                // Make category nodes (may be nested)
                categoryIds.forEach((categoryId) => {
                    var _a;
                    // Create category node if it doesn't exist
                    if (!isDefined(categoryParentNode.members[categoryId])) {
                        let category;
                        // Find current categoryId in parent categoryScheme or parent category
                        if (categoryParentNode.type === "categoryScheme") {
                            category = this.getCategoryFromCatagoryScheme(categorySchemeId, categoryId);
                        }
                        else if (categoryParentNode.type === "category") {
                            category = this.getCategoryFromCategories((_a = categoryParentNode.item) === null || _a === void 0 ? void 0 : _a.categories, categoryId);
                        }
                        if (!isDefined(category))
                            return;
                        categoryParentNode.members[categoryId] = {
                            type: "category",
                            item: category,
                            members: {}
                        };
                    }
                    // Swap parent node to newly created category node
                    categoryParentNode = categoryParentNode.members[categoryId];
                });
                // Create dataflow!
                const dataflow = this.getDataflow(dataflowId);
                if (!isDefined(dataflow))
                    return;
                categoryParentNode.members[dataflowId] = {
                    type: "dataflow",
                    item: dataflow
                };
            });
            // No categorisations exist => add flat list of dataflows
        }
        else {
            this.dataflowTree = this.sdmxServer.dataflows.reduce((tree, dataflow) => {
                if (isDefined(dataflow.id)) {
                    tree[dataflow.id] = { type: "dataflow", item: dataflow };
                }
                return tree;
            }, {});
        }
    }
    static async load(catalogGroup) {
        var _a, _b, _c, _d, _e, _f, _g;
        // Load agency schemes (may be undefined)
        let agencySchemes = (_b = (_a = (await loadSdmxJsonStructure(proxyCatalogItemUrl(catalogGroup, `${catalogGroup.url}/agencyscheme/`), true))) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.agencySchemes;
        // Load category schemes (may be undefined)
        let categorySchemeResponse = await loadSdmxJsonStructure(proxyCatalogItemUrl(catalogGroup, `${catalogGroup.url}/categoryscheme?references=parentsandsiblings`), true);
        let dataflows = (_c = categorySchemeResponse === null || categorySchemeResponse === void 0 ? void 0 : categorySchemeResponse.data) === null || _c === void 0 ? void 0 : _c.dataflows;
        // If no dataflows from category schemes -> try getting all of them through `dataflow` endpoint
        if (!isDefined(dataflows)) {
            dataflows = (_e = (_d = (await loadSdmxJsonStructure(proxyCatalogItemUrl(catalogGroup, `${catalogGroup.url}/dataflow/`), true))) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.dataflows;
            if (!isDefined(dataflows)) {
                throw new TerriaError({
                    title: i18next.t("models.sdmxServerStratum.loadDataErrorTitle"),
                    message: i18next.t("models.sdmxServerStratum.loadDataErrorMessage")
                });
            }
        }
        return new SdmxServerStratum(catalogGroup, {
            agencySchemes,
            categorySchemes: (_f = categorySchemeResponse === null || categorySchemeResponse === void 0 ? void 0 : categorySchemeResponse.data) === null || _f === void 0 ? void 0 : _f.categorySchemes,
            categorisations: (_g = categorySchemeResponse === null || categorySchemeResponse === void 0 ? void 0 : categorySchemeResponse.data) === null || _g === void 0 ? void 0 : _g.categorisations,
            dataflows
        });
    }
    duplicateLoadableStratum(model) {
        return new SdmxServerStratum(model, this.sdmxServer);
    }
    get members() {
        var _a;
        // Find first node in tree which has more than 1 child
        const findRootGroup = (node) => {
            const children = isDefined(node === null || node === void 0 ? void 0 : node.members)
                ? Object.values(node.members)
                : undefined;
            // If only 1 child -> keep searching
            return isDefined(children) && children.length === 1
                ? findRootGroup(children[0])
                : node;
        };
        let rootTreeNodes = Object.values(this.dataflowTree);
        // If only a single group -> try to find next nested group with more than 1 child
        if (rootTreeNodes.length === 1 && isDefined(rootTreeNodes[0])) {
            rootTreeNodes = Object.values((_a = findRootGroup(rootTreeNodes[0]).members) !== null && _a !== void 0 ? _a : this.dataflowTree);
        }
        return rootTreeNodes.map((node) => this.getMemberId(node));
    }
    createMembers() {
        Object.values(this.dataflowTree).forEach((node) => this.createMemberFromLayer(node));
    }
    createMemberFromLayer(node) {
        const layerId = this.getMemberId(node);
        if (!layerId) {
            return;
        }
        // Replace the stratum inherited from the parent group.
        // If has nested layers -> create model for CatalogGroup
        if (node.members && Object.keys(node.members).length > 0) {
            // Create nested layers
            Object.values(node.members).forEach((member) => this.createMemberFromLayer(member));
            // Create group
            const existingGroupModel = this.catalogGroup.terria.getModelById(CatalogGroup, layerId);
            let groupModel;
            if (existingGroupModel === undefined) {
                groupModel = new CatalogGroup(layerId, this.catalogGroup.terria);
                this.catalogGroup.terria.addModel(groupModel);
            }
            else {
                groupModel = existingGroupModel;
            }
            groupModel.setTrait(CommonStrata.definition, "name", node.item.name || node.item.id);
            groupModel.setTrait(CommonStrata.definition, "members", filterOutUndefined(Object.values(node.members).map((member) => this.getMemberId(member))));
            // Set group description
            if (node.item.description) {
                groupModel.setTrait(CommonStrata.definition, "description", node.item.description);
            }
            return;
        }
        // No nested layers (and type is dataflow) -> create model for SdmxJsonCatalogItem
        if (node.type !== "dataflow" ||
            !isDefined(node.item.id) ||
            !isDefined(node.item.agencyID))
            return;
        const existingItemModel = this.catalogGroup.terria.getModelById(SdmxJsonCatalogItem, layerId);
        let itemModel;
        if (existingItemModel === undefined) {
            itemModel = new SdmxJsonCatalogItem(layerId, this.catalogGroup.terria, undefined);
            this.catalogGroup.terria.addModel(itemModel);
        }
        else {
            itemModel = existingItemModel;
        }
        itemModel.strata.delete(CommonStrata.definition);
        itemModel.setTrait(CommonStrata.definition, "name", node.item.name || node.item.id);
        itemModel.setTrait(CommonStrata.definition, "url", this.catalogGroup.url);
        // Set group description
        if (node.item.description) {
            itemModel.setTrait(CommonStrata.definition, "description", node.item.description);
        }
        itemModel.setTrait(CommonStrata.definition, "agencyId", node.item.agencyID);
        itemModel.setTrait(CommonStrata.definition, "dataflowId", node.item.id);
        itemModel.setTrait(CommonStrata.definition, "modelOverrides", this.catalogGroup.traits.modelOverrides.toJson(this.catalogGroup.modelOverrides));
    }
    getMemberId(node) {
        return `${this.catalogGroup.uniqueId}/${node.type}-${node.item.id}`;
    }
    getDataflow(id) {
        if (!isDefined(id))
            return;
        return this.sdmxServer.dataflows.find((d) => d.id === id);
    }
    getCategoryScheme(id) {
        var _a;
        if (!isDefined(id))
            return;
        return (_a = this.sdmxServer.categorySchemes) === null || _a === void 0 ? void 0 : _a.find((d) => d.id === id);
    }
    getCategoryFromCatagoryScheme(categoryScheme, id) {
        if (!isDefined(id))
            return;
        let resolvedCategoryScheme = typeof categoryScheme === "string"
            ? this.getCategoryScheme(categoryScheme)
            : categoryScheme;
        return this.getCategoryFromCategories(resolvedCategoryScheme === null || resolvedCategoryScheme === void 0 ? void 0 : resolvedCategoryScheme.categories, id);
    }
    getCategoryFromCategories(categories, id) {
        return isDefined(id) ? categories === null || categories === void 0 ? void 0 : categories.find((c) => c.id === id) : undefined;
    }
    getAgency(id) {
        var _a;
        if (!isDefined(id))
            return;
        const agencies = (_a = this.sdmxServer.agencySchemes) === null || _a === void 0 ? void 0 : _a.map((agencyScheme) => agencyScheme.agencies);
        if (!isDefined(agencies))
            return;
        return flatten(filterOutUndefined(agencies)).find((d) => d.id === id);
    }
}
SdmxServerStratum.stratumName = "sdmxServer";
__decorate([
    computed
], SdmxServerStratum.prototype, "members", null);
__decorate([
    action
], SdmxServerStratum.prototype, "createMemberFromLayer", null);
StratumOrder.addLoadStratum(SdmxServerStratum.stratumName);
export function parseSdmxUrn(urn) {
    if (!isDefined(urn))
        return;
    // Format urn:sdmx:org.sdmx.infomodel.xxx.xxx=AGENCY:RESOURCEID(VERSION).SUBRESOURCEID.SUBSUBRESOURCEID...
    // Example urn:sdmx:org.sdmx.infomodel.categoryscheme.Category=SPC:CAS_COM_TOPIC(1.0).ECO
    // Sub resource ID and (and sub sub...) are optional
    const matches = regexMatches(/.+=(.+):(.+)\((.+)\)\.*(.*)/g, urn);
    if (matches.length >= 1 &&
        matches[0].length >= 3 &&
        !isDefined([0, 1, 2].find((idx) => matches[0][idx] === null))) {
        return {
            agencyId: matches[0][0],
            resourceId: matches[0][1],
            version: matches[0][2],
            descendantIds: matches[0][3] !== null ? matches[0][3].split(".") : undefined
        };
    }
}
export async function loadSdmxJsonStructure(url, allowNotImplemeted) {
    try {
        return JSON.parse(await new Resource({
            url,
            headers: {
                Accept: "application/vnd.sdmx.structure+json; charset=utf-8; version=1.0"
            }
        }).fetch());
    }
    catch (error) {
        // If SDMX server has returned an error message
        if (error instanceof RequestErrorEvent && isDefined(error.response)) {
            if (!allowNotImplemeted) {
                throw new TerriaError({
                    title: i18next.t("models.sdmxServerStratum.sdmxStructureLoadErrorTitle"),
                    message: sdmxErrorString.has(error.statusCode)
                        ? `${sdmxErrorString.get(error.statusCode)}: ${error.response}`
                        : `${error.response}`
                });
            }
            // Not sure what happened (maybe CORS)
        }
        else if (!allowNotImplemeted) {
            throw new TerriaError({
                title: i18next.t("models.sdmxServerStratum.sdmxStructureLoadErrorTitle"),
                message: `Unkown error occurred${isDefined(error)
                    ? typeof error === "string"
                        ? `: ${error}`
                        : `: ${JSON.stringify(error)}`
                    : ""}`
            });
        }
    }
}
export var SdmxHttpErrorCodes;
(function (SdmxHttpErrorCodes) {
    // SDMX to HTTP Error Mapping - taken from https://github.com/sdmx-twg/sdmx-rest/blob/7366f56ac08fe4eed758204e32d2e1ca62c78acf/v2_1/ws/rest/docs/4_7_errors.md#sdmx-to-http-error-mapping
    SdmxHttpErrorCodes[SdmxHttpErrorCodes["NoChanges"] = 304] = "NoChanges";
    // 100 No results found = 404 Not found
    SdmxHttpErrorCodes[SdmxHttpErrorCodes["NoResults"] = 404] = "NoResults";
    // 110 Unauthorized = 401 Unauthorized
    SdmxHttpErrorCodes[SdmxHttpErrorCodes["Unauthorized"] = 401] = "Unauthorized";
    // 130 Response too large due to client request = 413 Request entity too large
    // 510 Response size exceeds service limit = 413 Request entity too large
    SdmxHttpErrorCodes[SdmxHttpErrorCodes["ReponseTooLarge"] = 413] = "ReponseTooLarge";
    // 140 Syntax error = 400 Bad syntax
    SdmxHttpErrorCodes[SdmxHttpErrorCodes["SyntaxError"] = 400] = "SyntaxError";
    // 150 Semantic error = 403 Forbidden
    SdmxHttpErrorCodes[SdmxHttpErrorCodes["SemanticError"] = 403] = "SemanticError";
    SdmxHttpErrorCodes[SdmxHttpErrorCodes["UriTooLong"] = 414] = "UriTooLong";
    // 500 Internal Server error = 500 Internal server error
    // 1000+ = 500 Internal server error
    SdmxHttpErrorCodes[SdmxHttpErrorCodes["ServerError"] = 500] = "ServerError";
    // 501 Not implemented = 501 Not implemented
    SdmxHttpErrorCodes[SdmxHttpErrorCodes["NotImplemented"] = 501] = "NotImplemented";
    // 503 Service unavailable = 503 Service unavailable
    SdmxHttpErrorCodes[SdmxHttpErrorCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
})(SdmxHttpErrorCodes || (SdmxHttpErrorCodes = {}));
export const sdmxErrorString = new Map();
sdmxErrorString.set(SdmxHttpErrorCodes.NoChanges, "No changes");
sdmxErrorString.set(SdmxHttpErrorCodes.NoResults, "No results");
sdmxErrorString.set(SdmxHttpErrorCodes.Unauthorized, "Unauthorised");
sdmxErrorString.set(SdmxHttpErrorCodes.ReponseTooLarge, "Response too large");
sdmxErrorString.set(SdmxHttpErrorCodes.SyntaxError, "Syntax error");
sdmxErrorString.set(SdmxHttpErrorCodes.SemanticError, "Semantic error");
sdmxErrorString.set(SdmxHttpErrorCodes.UriTooLong, "URI too long");
sdmxErrorString.set(SdmxHttpErrorCodes.ServerError, "Server error");
sdmxErrorString.set(SdmxHttpErrorCodes.NotImplemented, "Not implemented");
sdmxErrorString.set(SdmxHttpErrorCodes.ServiceUnavailable, "Service unavailable");
//# sourceMappingURL=SdmxJsonServerStratum.js.map
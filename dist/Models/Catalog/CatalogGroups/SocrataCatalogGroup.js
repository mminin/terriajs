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
import TerriaError, { networkRequestError } from "../../../Core/TerriaError";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import { InfoSectionTraits, MetadataUrlTraits } from "../../../Traits/TraitsClasses/CatalogMemberTraits";
import SocrataCatalogGroupTraits, { FacetFilterTraits } from "../../../Traits/TraitsClasses/SocrataCatalogGroupTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import createStratumInstance from "../../Definition/createStratumInstance";
import LoadableStratum from "../../Definition/LoadableStratum";
import StratumOrder from "../../Definition/StratumOrder";
import CatalogGroup from "../CatalogGroup";
import CsvCatalogItem from "../CatalogItems/CsvCatalogItem";
import GeoJsonCatalogItem from "../CatalogItems/GeoJsonCatalogItem";
import SocrataMapViewCatalogItem from "../CatalogItems/SocrataMapViewCatalogItem";
import proxyCatalogItemUrl from "../proxyCatalogItemUrl";
export class SocrataCatalogStratum extends LoadableStratum(SocrataCatalogGroupTraits) {
    constructor(catalogGroup, facets, results) {
        super();
        this.catalogGroup = catalogGroup;
        this.facets = facets;
        this.results = results;
    }
    static async load(catalogGroup) {
        var _a, _b;
        if (!catalogGroup.url)
            throw "`url` must be set";
        const filterQuery = Object.assign({}, catalogGroup.filterQuery, {
            only: "dataset,map"
        });
        const domain = URI(catalogGroup.url).hostname();
        let facets = [];
        let results = [];
        // If not facet filters have been set - get facets
        if (!isDefined(catalogGroup.facetFilters) ||
            catalogGroup.facetFilters.length === 0) {
            const facetsToUse = catalogGroup.facetGroups;
            const facetUri = URI(`${catalogGroup.url}/api/catalog/v1/domains/${domain}/facets`).addQuery(filterQuery);
            const facetResponse = await loadJson(proxyCatalogItemUrl(catalogGroup, facetUri.toString()));
            if (facetResponse.error) {
                throw (_a = facetResponse.message) !== null && _a !== void 0 ? _a : facetResponse.error;
            }
            facets = facetResponse;
            if (!Array.isArray(facets))
                throw `Could not fetch facets for domain ${domain}`;
            facets = facets.filter((f) => facetsToUse.includes(f.facet));
            if (facets.length === 0)
                throw `Could not find any facets for domain ${domain}`;
        }
        // If facetFilter is set, use it to search for datasets (aka resources)
        else {
            const resultsUri = URI(`${catalogGroup.url}/api/catalog/v1?search_context=${domain}`).addQuery(filterQuery);
            catalogGroup.facetFilters.forEach(({ name, value }) => name && isDefined(value) ? resultsUri.addQuery(name, value) : null);
            const resultsResponse = await loadJson(proxyCatalogItemUrl(catalogGroup, resultsUri.toString()));
            if (resultsResponse.error) {
                throw (_b = resultsResponse.message) !== null && _b !== void 0 ? _b : resultsResponse.error;
            }
            results = resultsResponse.results;
            if (!Array.isArray(results) || results.length === 0)
                throw `Could not find any results for domain ${domain} and facets: ${catalogGroup.facetFilters
                    .map(({ name, value }) => `${name} = ${value}`)
                    .join(", ")}`;
        }
        return new SocrataCatalogStratum(catalogGroup, facets, results);
    }
    duplicateLoadableStratum(model) {
        return new SocrataCatalogStratum(model, this.facets, this.results);
    }
    get members() {
        // If we only have one facet, return it's children instead of a single facet group
        if (this.facets.length === 1)
            return this.facets[0].values.map((facetValue) => `${this.getFacetId(this.facets[0])}/${facetValue.value}`);
        return [
            ...this.facets.map((f) => this.getFacetId(f)),
            ...this.results.map((r) => this.getResultId(r))
        ];
    }
    createMembers() {
        this.facets.forEach((facet) => this.createGroupFromFacet(facet));
        this.results.forEach((result) => this.createItemFromResult(result));
    }
    /** Turn facet into SocrataCatalogGroup */
    createGroupFromFacet(facet) {
        const facetGroupId = this.getFacetId(facet);
        // Create group for Facet
        let facetGroup = this.catalogGroup.terria.getModelById(CatalogGroup, facetGroupId);
        if (facetGroup === undefined) {
            facetGroup = new CatalogGroup(facetGroupId, this.catalogGroup.terria, undefined);
            this.catalogGroup.terria.addModel(facetGroup);
        }
        // Replace the stratum inherited from the parent group.
        facetGroup.strata.delete(CommonStrata.definition);
        facetGroup.setTrait(CommonStrata.definition, "name", facet.facet);
        // Create child groups for Facet values
        facet.values.forEach((facetValue) => {
            var _a;
            const facetValueId = `${facetGroupId}/${facetValue.value}`;
            let facetValueGroup = this.catalogGroup.terria.getModelById(SocrataCatalogGroup, facetValueId);
            if (facetValueGroup === undefined) {
                facetValueGroup = new SocrataCatalogGroup(facetValueId, this.catalogGroup.terria, undefined);
                this.catalogGroup.terria.addModel(facetValueGroup);
            }
            // Replace the stratum inherited from the parent group.
            facetValueGroup.strata.delete(CommonStrata.definition);
            facetValueGroup.setTrait(CommonStrata.definition, "name", `${facetValue.value}${facetValue.count ? ` (${(_a = facetValue.count) !== null && _a !== void 0 ? _a : 0})` : ""}`);
            facetValueGroup.setTrait(CommonStrata.definition, "url", this.catalogGroup.url);
            facetValueGroup.setTrait(CommonStrata.definition, "facetFilters", [
                createStratumInstance(FacetFilterTraits, {
                    name: facet.facet,
                    value: facetValue.value
                })
            ]);
            facetGroup.add(CommonStrata.definition, facetValueGroup);
        });
    }
    /** Turn Result into catalog item
     * If type is 'dataset':
     * - If has geometery -> create GeoJSONCatalogItem
     * - Otherwise -> create CsvCatalogItem
     * If type is 'map' -> SocrataMapViewCatalogItem
     * - Then the Socrata `views` API will be used to fetch data (this mimics how Socrata portal map visualisation works - it isn't an official API)
     */
    createItemFromResult(result) {
        const resultId = this.getResultId(result);
        // Add share key for old ID which included parents ID
        this.catalogGroup.terria.addShareKey(resultId, `${this.catalogGroup.uniqueId}/${result.resource.id}`);
        let resultModel;
        // If dataset resource
        // - If has geometry - create GeoJSONCatalogItem
        // - Otherwise - create CsvCatalogItem
        if (result.resource.type === "dataset") {
            if (result.resource.columns_datatype.find((type) => [
                "Point",
                "Line",
                "Polygon",
                "MultiLine",
                "MultiPoint",
                "MultiPolygon",
                "Location"
            ].includes(type))) {
                resultModel = this.catalogGroup.terria.getModelById(GeoJsonCatalogItem, resultId);
                if (resultModel === undefined) {
                    resultModel = new GeoJsonCatalogItem(resultId, this.catalogGroup.terria, undefined);
                    this.catalogGroup.terria.addModel(resultModel);
                }
                // Replace the stratum inherited from the parent group.
                resultModel.strata.delete(CommonStrata.definition);
                resultModel.setTrait(CommonStrata.definition, "url", `${this.catalogGroup.url}/resource/${result.resource.id}.geojson?$limit=10000`);
            }
            else {
                resultModel = this.catalogGroup.terria.getModelById(CsvCatalogItem, resultId);
                if (resultModel === undefined) {
                    resultModel = new CsvCatalogItem(resultId, this.catalogGroup.terria, undefined);
                    this.catalogGroup.terria.addModel(resultModel);
                }
                // Replace the stratum inherited from the parent group.
                resultModel.strata.delete(CommonStrata.definition);
                resultModel.setTrait(CommonStrata.definition, "url", `${this.catalogGroup.url}/resource/${result.resource.id}.csv?$limit=10000`);
            }
            // If type is 'map' -> SocrataMapViewCatalogItem
        }
        else if (result.resource.type === "map") {
            resultModel = this.catalogGroup.terria.getModelById(SocrataMapViewCatalogItem, resultId);
            if (resultModel === undefined) {
                resultModel = new SocrataMapViewCatalogItem(resultId, this.catalogGroup.terria, undefined);
                this.catalogGroup.terria.addModel(resultModel);
            }
            // Replace the stratum inherited from the parent group.
            resultModel.strata.delete(CommonStrata.definition);
            resultModel.setTrait(CommonStrata.definition, "url", this.catalogGroup.url);
            resultModel.setTrait(CommonStrata.definition, "resourceId", result.resource.id);
        }
        if (resultModel) {
            resultModel.setTrait(CommonStrata.definition, "name", result.resource.name);
            resultModel.setTrait(CommonStrata.definition, "description", result.resource.description);
            resultModel.setTrait(CommonStrata.definition, "attribution", result.resource.attribution);
            resultModel.setTrait(CommonStrata.definition, "info", [
                createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.socrataServer.licence"),
                    content: result.metadata.license
                }),
                createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.socrataServer.tags"),
                    content: result.classification.tags.join(", ")
                }),
                createStratumInstance(InfoSectionTraits, {
                    name: i18next.t("models.socrataServer.attributes"),
                    content: result.resource.columns_name.join(", ")
                })
            ]);
            resultModel.setTrait(CommonStrata.definition, "metadataUrls", [
                createStratumInstance(MetadataUrlTraits, {
                    title: i18next.t("models.openDataSoft.viewDatasetPage"),
                    url: result.permalink
                })
            ]);
        }
    }
    getFacetId(facet) {
        return `${this.catalogGroup.uniqueId}/${facet.facet}`;
    }
    getResultId(result) {
        var _a;
        // Use Socrata server hostname for datasets, so we don't create multiple across facets
        return `${this.catalogGroup.url
            ? URI((_a = this.catalogGroup.url) !== null && _a !== void 0 ? _a : "").hostname()
            : this.catalogGroup.uniqueId}/${result.resource.id}`;
    }
}
SocrataCatalogStratum.stratumName = "socrataCatalog";
__decorate([
    computed
], SocrataCatalogStratum.prototype, "members", null);
__decorate([
    action
], SocrataCatalogStratum.prototype, "createGroupFromFacet", null);
__decorate([
    action
], SocrataCatalogStratum.prototype, "createItemFromResult", null);
StratumOrder.addLoadStratum(SocrataCatalogStratum.stratumName);
export default class SocrataCatalogGroup extends UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(SocrataCatalogGroupTraits)))) {
    get type() {
        return SocrataCatalogGroup.type;
    }
    async forceLoadMetadata() {
        try {
            if (!this.strata.has(SocrataCatalogStratum.stratumName)) {
                const stratum = await SocrataCatalogStratum.load(this);
                runInAction(() => {
                    this.strata.set(SocrataCatalogStratum.stratumName, stratum);
                });
            }
        }
        catch (e) {
            networkRequestError(TerriaError.from(e, {
                message: { key: "models.socrataServer.retrieveErrorMessage" }
            }));
        }
    }
    async forceLoadMembers() {
        const socrataServerStratum = (this.strata.get(SocrataCatalogStratum.stratumName));
        if (socrataServerStratum) {
            await runLater(() => socrataServerStratum.createMembers());
        }
    }
}
SocrataCatalogGroup.type = "socrata-group";
//# sourceMappingURL=SocrataCatalogGroup.js.map
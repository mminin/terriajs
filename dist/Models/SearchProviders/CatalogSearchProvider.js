var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { autorun, computed, observable, runInAction } from "mobx";
import { fromPromise } from "mobx-utils";
import { Category, SearchAction } from "../../Core/AnalyticEvents/analyticEvents";
import isDefined from "../../Core/isDefined";
import { TerriaErrorSeverity } from "../../Core/TerriaError";
import GroupMixin from "../../ModelMixins/GroupMixin";
import ReferenceMixin from "../../ModelMixins/ReferenceMixin";
import SearchProvider from "./SearchProvider";
import SearchResult from "./SearchResult";
export function loadAndSearchCatalogRecursively(models, searchTextLowercase, searchResults, resultMap, iteration = 0) {
    // checkTerriaAgainstResults(terria, searchResults)
    // don't go further than 10 deep, but also if we have references that never
    // resolve to a target, might overflow
    if (iteration > 10) {
        return Promise.resolve();
    }
    // add some public interface for terria's `models`?
    const referencesAndGroupsToLoad = models.filter((model) => {
        if (resultMap.get(model.uniqueId) === undefined) {
            const modelToSave = model.target || model;
            // Use a flattened string of definition data later,
            // without only checking name/id/descriptions?
            // saveModelToJson(modelToSave, {
            //   includeStrata: [CommonStrata.definition]
            // });
            autorun(reaction => {
                const searchString = `${modelToSave.name} ${modelToSave.uniqueId} ${modelToSave.description}`;
                const matchesString = searchString.toLowerCase().indexOf(searchTextLowercase) !== -1;
                resultMap.set(model.uniqueId, matchesString);
                if (matchesString) {
                    runInAction(() => {
                        searchResults.results.push(new SearchResult({
                            name: name,
                            catalogItem: modelToSave
                        }));
                    });
                }
                reaction.dispose();
            });
        }
        if (ReferenceMixin.isMixedInto(model) || GroupMixin.isMixedInto(model)) {
            return true;
        }
        // Could also check for loadMembers() here, but will be even slower
        // (relies on external non-magda services to be performant)
        return false;
    });
    // If we have no members to load
    if (referencesAndGroupsToLoad.length === 0) {
        return Promise.resolve();
    }
    return new Promise(resolve => {
        autorun(reaction => {
            Promise.all(referencesAndGroupsToLoad.map(async (model) => {
                if (ReferenceMixin.isMixedInto(model)) {
                    // TODO: could handle errors better here
                    (await model.loadReference()).throwIfError();
                }
                // TODO: investigate performant route for calling loadMembers on additional groupmixins
                // else if (GroupMixin.isMixedInto(model)) {
                //   return model.loadMembers();
                // }
            })).then(() => {
                // Then call this function again to see if new child references were loaded in
                resolve(loadAndSearchCatalogRecursively(models, searchTextLowercase, searchResults, resultMap, iteration + 1));
            });
            reaction.dispose();
        });
    });
}
export default class CatalogSearchProvider extends SearchProvider {
    constructor(options) {
        super();
        this.isSearching = false;
        this.debounceDurationOnceLoaded = 300;
        this.terria = options.terria;
        this.name = "Catalog Items";
    }
    get resultsAreReferences() {
        var _a;
        return (isDefined((_a = this.terria.catalogIndex) === null || _a === void 0 ? void 0 : _a.loadPromise) &&
            fromPromise(this.terria.catalogIndex.loadPromise).state === "fulfilled");
    }
    async doSearch(searchText, searchResults) {
        var _a, _b;
        this.isSearching = true;
        searchResults.results.length = 0;
        searchResults.message = undefined;
        if (searchText === undefined || /^\s*$/.test(searchText)) {
            this.isSearching = false;
            return Promise.resolve();
        }
        // Load catalogIndex if needed
        if (this.terria.catalogIndex && !this.terria.catalogIndex.loadPromise) {
            try {
                await this.terria.catalogIndex.load();
            }
            catch (e) {
                this.terria.raiseErrorToUser(e, "Failed to load catalog index. Searching may be slow/inaccurate");
            }
        }
        (_a = this.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.search, SearchAction.catalog, searchText);
        const resultMap = new Map();
        try {
            if ((_b = this.terria.catalogIndex) === null || _b === void 0 ? void 0 : _b.searchIndex) {
                const results = await this.terria.catalogIndex.search(searchText);
                runInAction(() => (searchResults.results = results));
            }
            else {
                await loadAndSearchCatalogRecursively(this.terria.modelValues, searchText.toLowerCase(), searchResults, resultMap);
            }
            runInAction(() => {
                this.isSearching = false;
            });
            if (searchResults.isCanceled) {
                // A new search has superseded this one, so ignore the result.
                return;
            }
            runInAction(() => {
                this.terria.catalogReferencesLoaded = true;
            });
            if (searchResults.results.length === 0) {
                searchResults.message = "Sorry, no locations match your search query.";
            }
        }
        catch (e) {
            this.terria.raiseErrorToUser(e, {
                message: "An error occurred while searching",
                severity: TerriaErrorSeverity.Warning
            });
            if (searchResults.isCanceled) {
                // A new search has superseded this one, so ignore the result.
                return;
            }
            searchResults.message =
                "An error occurred while searching.  Please check your internet connection or try again later.";
        }
    }
}
__decorate([
    observable
], CatalogSearchProvider.prototype, "isSearching", void 0);
__decorate([
    observable
], CatalogSearchProvider.prototype, "debounceDurationOnceLoaded", void 0);
__decorate([
    computed
], CatalogSearchProvider.prototype, "resultsAreReferences", null);
//# sourceMappingURL=CatalogSearchProvider.js.map
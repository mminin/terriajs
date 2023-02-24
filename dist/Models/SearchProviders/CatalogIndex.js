var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Document } from "flexsearch";
import { action, observable, runInAction } from "mobx";
import { isJsonObject, isJsonString, isJsonStringArray } from "../../Core/Json";
import loadBlob, { isZip, parseZipJsonBlob } from "../../Core/loadBlob";
import loadJson from "../../Core/loadJson";
import CatalogIndexReference from "../Catalog/CatalogReferences/CatalogIndexReference";
import CommonStrata from "../Definition/CommonStrata";
import updateModelFromJson from "../Definition/updateModelFromJson";
import SearchResult from "./SearchResult";
export default class CatalogIndex {
    constructor(terria, url) {
        this.terria = terria;
        this.url = url;
        /** Map from share key -> id */
        this.shareKeysMap = observable.map();
    }
    get models() {
        return this._models;
    }
    get searchIndex() {
        return this._searchIndex;
    }
    get loadPromise() {
        return this._loadPromise;
    }
    getModelByIdOrShareKey(modelId) {
        var _a, _b;
        if ((_a = this.models) === null || _a === void 0 ? void 0 : _a.has(modelId)) {
            return this.models.get(modelId);
        }
        const shareKeyId = this.shareKeysMap.get(modelId);
        if (shareKeyId) {
            return (_b = this.models) === null || _b === void 0 ? void 0 : _b.get(shareKeyId);
        }
    }
    load() {
        if (this._loadPromise)
            return this._loadPromise;
        runInAction(() => (this._loadPromise = this.loadCatalogIndex()));
        return this._loadPromise;
    }
    /** The catalog index is loaded automatically on startup.
     * It is loaded the first time loadInitSources is called (see Terria.forceLoadInitSources) */
    async loadCatalogIndex() {
        // Load catalog index
        try {
            const url = this.terria.corsProxy.getURLProxyIfNecessary(this.url);
            const index = (isZip(url)
                ? await parseZipJsonBlob(await loadBlob(url))
                : await loadJson(url));
            this._models = new Map();
            /**
             * https://github.com/nextapps-de/flexsearch
             * Create search index for fields "name" and "description"
             *  - tokenize property
             *    - "full" = index every possible combination
             *    - "strict" = index whole words
             *  - resolution property = score resolution
             *
             * Note: because we have set `worker: true`, we must use async calls
             */
            this._searchIndex = new Document({
                worker: true,
                document: {
                    id: "id",
                    index: [
                        {
                            field: "name",
                            tokenize: "full",
                            resolution: 9
                        },
                        {
                            field: "description",
                            tokenize: "strict",
                            resolution: 1
                        }
                    ]
                }
            });
            const indexModels = Object.entries(index);
            const promises = [];
            for (let idx = 0; idx < indexModels.length; idx++) {
                const [id, model] = indexModels[idx];
                if (!isJsonObject(model, false))
                    return;
                const reference = new CatalogIndexReference(id, this.terria);
                updateModelFromJson(reference, CommonStrata.definition, model).logError("Error ocurred adding adding catalog model reference");
                if (isJsonStringArray(model.shareKeys)) {
                    model.shareKeys.map((s) => this.shareKeysMap.set(s, id));
                }
                // Add model to CatalogIndexReference map
                this._models.set(id, reference);
                // Add document to search index
                promises.push(this._searchIndex.addAsync(id, {
                    id,
                    name: isJsonString(model.name) ? model.name : "",
                    description: isJsonString(model.description)
                        ? model.description
                        : ""
                }));
            }
            await Promise.all(promises);
        }
        catch (error) {
            this.terria.raiseErrorToUser(error, "Failed to load catalog index");
        }
    }
    async search(q) {
        const results = [];
        /** Example matches object
        ```json
        [
          {
            "field": "name",
            "result": [
              "some-id-1"
            ]
          },
          {
            "field": "description",
            "result": [
              "some-id-2"
            ]
          }
        ]
        ```
    */
        if (!this.searchIndex)
            return [];
        const matches = await this.searchIndex.searchAsync(q);
        const matchedIds = new Set();
        matches.forEach((fieldResult) => {
            fieldResult.result.forEach((id) => {
                var _a;
                const indexReference = (_a = this.models) === null || _a === void 0 ? void 0 : _a.get(id);
                if (indexReference && !matchedIds.has(id)) {
                    matchedIds.add(id);
                    results.push(runInAction(() => {
                        var _a;
                        return new SearchResult({
                            name: (_a = indexReference.name) !== null && _a !== void 0 ? _a : indexReference.uniqueId,
                            catalogItem: indexReference
                        });
                    }));
                }
            });
        });
        return results;
    }
}
__decorate([
    observable
], CatalogIndex.prototype, "_loadPromise", void 0);
__decorate([
    action
], CatalogIndex.prototype, "loadCatalogIndex", null);
//# sourceMappingURL=CatalogIndex.js.map
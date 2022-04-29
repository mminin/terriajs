var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// import CatalogItemNameSearchProviderViewModel from "../ViewModels/CatalogItemNameSearchProviderViewModel";
import { observable, reaction, computed, action } from "mobx";
import filterOutUndefined from "../Core/filterOutUndefined";
import CatalogSearchProvider from "../Models/SearchProviders/CatalogSearchProvider";
export default class SearchState {
    constructor(options) {
        this.catalogSearchText = "";
        this.isWaitingToStartCatalogSearch = false;
        this.locationSearchText = "";
        this.isWaitingToStartLocationSearch = false;
        this.unifiedSearchText = "";
        this.isWaitingToStartUnifiedSearch = false;
        this.showLocationSearchResults = false;
        this.showMobileLocationSearch = false;
        this.showMobileCatalogSearch = false;
        this.locationSearchResults = [];
        this.unifiedSearchResults = [];
        this.catalogSearchProvider =
            options.catalogSearchProvider ||
                new CatalogSearchProvider({ terria: options.terria });
        this.locationSearchProviders = options.locationSearchProviders || [];
        this._catalogSearchDisposer = reaction(() => this.catalogSearchText, () => {
            this.isWaitingToStartCatalogSearch = true;
            if (this.catalogSearchProvider) {
                this.catalogSearchResults = this.catalogSearchProvider.search("");
            }
        });
        this._locationSearchDisposer = reaction(() => this.locationSearchText, () => {
            this.isWaitingToStartLocationSearch = true;
            this.locationSearchResults = this.locationSearchProviders.map(provider => {
                return provider.search("");
            });
        });
        this._unifiedSearchDisposer = reaction(() => this.unifiedSearchText, () => {
            this.isWaitingToStartUnifiedSearch = true;
            this.unifiedSearchResults = this.unifiedSearchProviders.map(provider => {
                return provider.search("");
            });
        });
    }
    dispose() {
        this._catalogSearchDisposer();
        this._locationSearchDisposer();
        this._unifiedSearchDisposer();
    }
    get unifiedSearchProviders() {
        return filterOutUndefined([
            this.catalogSearchProvider,
            ...this.locationSearchProviders
        ]);
    }
    searchCatalog() {
        if (this.isWaitingToStartCatalogSearch) {
            this.isWaitingToStartCatalogSearch = false;
            if (this.catalogSearchResults) {
                this.catalogSearchResults.isCanceled = true;
            }
            if (this.catalogSearchProvider) {
                this.catalogSearchResults = this.catalogSearchProvider.search(this.catalogSearchText);
            }
        }
    }
    setCatalogSearchText(newText) {
        this.catalogSearchText = newText;
    }
    searchLocations() {
        if (this.isWaitingToStartLocationSearch) {
            this.isWaitingToStartLocationSearch = false;
            this.locationSearchResults.forEach(results => {
                results.isCanceled = true;
            });
            this.locationSearchResults = this.locationSearchProviders.map(searchProvider => searchProvider.search(this.locationSearchText));
        }
    }
    searchUnified() {
        if (this.isWaitingToStartUnifiedSearch) {
            this.isWaitingToStartUnifiedSearch = false;
            this.unifiedSearchResults.forEach(results => {
                results.isCanceled = true;
            });
            this.unifiedSearchResults = this.unifiedSearchProviders.map(searchProvider => searchProvider.search(this.unifiedSearchText));
        }
    }
}
__decorate([
    observable
], SearchState.prototype, "catalogSearchProvider", void 0);
__decorate([
    observable
], SearchState.prototype, "locationSearchProviders", void 0);
__decorate([
    observable
], SearchState.prototype, "catalogSearchText", void 0);
__decorate([
    observable
], SearchState.prototype, "isWaitingToStartCatalogSearch", void 0);
__decorate([
    observable
], SearchState.prototype, "locationSearchText", void 0);
__decorate([
    observable
], SearchState.prototype, "isWaitingToStartLocationSearch", void 0);
__decorate([
    observable
], SearchState.prototype, "unifiedSearchText", void 0);
__decorate([
    observable
], SearchState.prototype, "isWaitingToStartUnifiedSearch", void 0);
__decorate([
    observable
], SearchState.prototype, "showLocationSearchResults", void 0);
__decorate([
    observable
], SearchState.prototype, "showMobileLocationSearch", void 0);
__decorate([
    observable
], SearchState.prototype, "showMobileCatalogSearch", void 0);
__decorate([
    observable
], SearchState.prototype, "locationSearchResults", void 0);
__decorate([
    observable
], SearchState.prototype, "catalogSearchResults", void 0);
__decorate([
    observable
], SearchState.prototype, "unifiedSearchResults", void 0);
__decorate([
    computed
], SearchState.prototype, "unifiedSearchProviders", null);
__decorate([
    action
], SearchState.prototype, "searchCatalog", null);
__decorate([
    action
], SearchState.prototype, "setCatalogSearchText", null);
__decorate([
    action
], SearchState.prototype, "searchLocations", null);
__decorate([
    action
], SearchState.prototype, "searchUnified", null);
//# sourceMappingURL=SearchState.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, observable } from "mobx";
import { fromPromise } from "mobx-utils";
import SearchProviderResults from "./SearchProviderResults";
export default class SearchProvider {
    constructor() {
        /** If search results are References to models in terria.models - set this to true.
         * This is so groups/references are opened and loaded properly
         */
        this.resultsAreReferences = false;
        this.name = "Unknown";
        this.isOpen = true;
    }
    toggleOpen() {
        this.isOpen = !this.isOpen;
    }
    search(searchText) {
        const result = new SearchProviderResults(this);
        result.resultsCompletePromise = fromPromise(this.doSearch(searchText, result));
        return result;
    }
}
__decorate([
    observable
], SearchProvider.prototype, "name", void 0);
__decorate([
    observable
], SearchProvider.prototype, "isOpen", void 0);
__decorate([
    action
], SearchProvider.prototype, "toggleOpen", null);
__decorate([
    action
], SearchProvider.prototype, "search", null);
//# sourceMappingURL=SearchProvider.js.map
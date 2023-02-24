var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observable, action } from "mobx";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import defined from "terriajs-cesium/Source/Core/defined";
import GroupMixin from "../../ModelMixins/GroupMixin";
export default class SearchResult {
    constructor(options) {
        this.isOpen = false;
        this.type = "search_result";
        this.name = defaultValue(options.name, "Unknown");
        this.tooltip = options.tooltip;
        this.isImportant = defaultValue(options.isImportant, false);
        this.clickAction = options.clickAction;
        this.catalogItem = options.catalogItem;
        this.location = options.location;
    }
    toggleOpen() {
        if (!defined(this.catalogItem)) {
            return;
        }
        this.isOpen = !this.isOpen;
        // Load this group's items (if we haven't already) when it is opened.
        if (this.isOpen && GroupMixin.isMixedInto(this.catalogItem)) {
            this.catalogItem
                .loadMembers()
                .then((result) => result.raiseError(this.catalogItem.terria));
        }
    }
}
__decorate([
    observable
], SearchResult.prototype, "name", void 0);
__decorate([
    observable
], SearchResult.prototype, "tooltip", void 0);
__decorate([
    observable
], SearchResult.prototype, "isImportant", void 0);
__decorate([
    observable
], SearchResult.prototype, "clickAction", void 0);
__decorate([
    observable
], SearchResult.prototype, "catalogItem", void 0);
__decorate([
    observable
], SearchResult.prototype, "isOpen", void 0);
__decorate([
    observable
], SearchResult.prototype, "type", void 0);
__decorate([
    observable
], SearchResult.prototype, "location", void 0);
__decorate([
    action
], SearchResult.prototype, "toggleOpen", null);
//# sourceMappingURL=SearchResult.js.map
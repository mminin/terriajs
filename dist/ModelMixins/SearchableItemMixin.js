var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed } from "mobx";
import { ItemSearchProviders } from "../Models/ItemSearchProviders/ItemSearchProviders";
/**
 * This mixin adds capability for searching a catalog item using an {@link
 * ItemSearchProvider}.
 */
function SearchableItemMixin(Base) {
    class Klass extends Base {
        constructor() {
            super(...arguments);
            this.hasSearchableItemMixin = true;
        }
        /**
         * Returns true if this item is searchable and has a valid item search provider defined.
         */
        get canSearch() {
            return this.search.providerType
                ? ItemSearchProviders.has(this.search.providerType)
                : false;
        }
        /**
         * Returns an instance of the ItemSearchProvider for searching the item.
         */
        createItemSearchProvider() {
            const klass = this.search.providerType &&
                ItemSearchProviders.get(this.search.providerType);
            if (!klass)
                return;
            return new klass(this.search.providerOptions, this.search.parameters);
        }
    }
    __decorate([
        computed
    ], Klass.prototype, "canSearch", null);
    __decorate([
        action
    ], Klass.prototype, "createItemSearchProvider", null);
    return Klass;
}
(function (SearchableItemMixin) {
    function isMixedInto(model) {
        return model && model.hasSearchableItemMixin;
    }
    SearchableItemMixin.isMixedInto = isMixedInto;
})(SearchableItemMixin || (SearchableItemMixin = {}));
export default SearchableItemMixin;
//# sourceMappingURL=SearchableItemMixin.js.map
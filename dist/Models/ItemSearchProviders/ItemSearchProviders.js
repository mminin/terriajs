import IndexedItemSearchProvider from "./IndexedItemSearchProvider";
export const ItemSearchProviders = new Map([["indexed", IndexedItemSearchProvider]]);
export function registerItemSearchProvider(type, providerClass) {
    ItemSearchProviders.set(type, providerClass);
}
//# sourceMappingURL=ItemSearchProviders.js.map
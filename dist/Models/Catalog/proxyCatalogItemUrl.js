"use strict";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import isDefined from "../../Core/isDefined";
import UrlMixin from "../../ModelMixins/UrlMixin";
/**
 * The terriajs-server is the default server that proxies a URL associated with a catalog item, if necessary.
 * @param {CatalogItem} [catalogItem] The catalog item.
 * @param {string} url The URL to be proxied.
 * @param {string} [cacheDuration] The cache duration to use if catalogItem.cacheDuration is undefined.
 * @returns {string} The URL, now cached if necessary.
 */
export default function proxyCatalogItemUrl(catalogItem, url, cacheDuration) {
    var _a;
    const corsProxy = (_a = catalogItem === null || catalogItem === void 0 ? void 0 : catalogItem.terria) === null || _a === void 0 ? void 0 : _a.corsProxy;
    if (isDefined(corsProxy) &&
        (corsProxy.shouldUseProxy(url) ||
            (UrlMixin.isMixedInto(catalogItem) && catalogItem.forceProxy))) {
        return corsProxy.getURL(url, defaultValue(UrlMixin.isMixedInto(catalogItem) && catalogItem.cacheDuration, cacheDuration));
    }
    else {
        return url;
    }
}
/**
 * Similar to {@link proxyCatalogItemUrl}, but only returns proxy base url, not full URL (for example `proxy/`, instead of `proxy/some/other/resource`)
 */
export function proxyCatalogItemBaseUrl(catalogItem, url, cacheDuration) {
    var _a;
    const corsProxy = (_a = catalogItem === null || catalogItem === void 0 ? void 0 : catalogItem.terria) === null || _a === void 0 ? void 0 : _a.corsProxy;
    if (isDefined(corsProxy) &&
        (corsProxy.shouldUseProxy(url) ||
            (UrlMixin.isMixedInto(catalogItem) && catalogItem.forceProxy))) {
        return corsProxy.getProxyBaseURL(defaultValue(UrlMixin.isMixedInto(catalogItem) && catalogItem.cacheDuration, cacheDuration));
    }
}
//# sourceMappingURL=proxyCatalogItemUrl.js.map
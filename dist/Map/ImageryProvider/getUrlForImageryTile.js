import ImageryProvider from "terriajs-cesium/Source/Scene/ImageryProvider";
import URI from "urijs";
function getUrlForImageryTile(imageryProvider, x, y, level) {
    const oldLoadImage = ImageryProvider.loadImage;
    let tileUrl;
    try {
        ImageryProvider.loadImage = function (_imageryProvider, url) {
            var _a;
            if (typeof url === "string" || url instanceof String) {
                tileUrl = url;
            }
            else if (url.url) {
                tileUrl = url.url;
                // Add the Cesium Ion access token if there is one (for an IonResource).
                const ionAccessToken = (_a = url._ionEndpoint) === null || _a === void 0 ? void 0 : _a.accessToken;
                if (ionAccessToken) {
                    tileUrl = new URI(tileUrl)
                        .addQuery("access_token", ionAccessToken)
                        .toString();
                }
            }
            return undefined;
        };
        imageryProvider.requestImage(x, y, level);
    }
    finally {
        ImageryProvider.loadImage = oldLoadImage;
    }
    return tileUrl;
}
export default getUrlForImageryTile;
//# sourceMappingURL=getUrlForImageryTile.js.map
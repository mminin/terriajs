import URI from "urijs";
export default function joinUrl(rootUrl, url) {
    const uri = URI(url);
    return uri.is("absolute") ? url : uri.absoluteTo(rootUrl).toString();
}
//# sourceMappingURL=joinUrl.js.map
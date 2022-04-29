import URI from "urijs";
import isDefined from "../Core/isDefined";
const loadXML = require("../Core/loadXML");
const loadWithXhr = require("../Core/loadWithXhr");
export default function XmlRequestMixin(Base) {
    class XmlRequestMixin extends Base {
        getXml(url, parameters) {
            if (isDefined(parameters)) {
                url = new URI(url).query(parameters).toString();
            }
            return loadXML(url);
        }
        postXml(url, data) {
            return loadWithXhr({
                url: url,
                method: "POST",
                data,
                overrideMimeType: "text/xml",
                responseType: "document"
            });
        }
    }
    return XmlRequestMixin;
}
//# sourceMappingURL=XmlRequestMixin.js.map
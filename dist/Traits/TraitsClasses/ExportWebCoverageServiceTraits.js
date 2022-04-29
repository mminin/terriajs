var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import ExportableTraits from "./ExportableTraits";
export class KeyValueTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Key",
        description: "Key string."
    })
], KeyValueTraits.prototype, "key", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Value",
        description: "Value string."
    })
], KeyValueTraits.prototype, "value", void 0);
export class WebCoverageServiceParameterTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.outputFormat = "image/geotiff";
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Output CRS",
        description: 'Output CRS (in EPSG format - eg "EPSG:4326").'
    })
], WebCoverageServiceParameterTraits.prototype, "outputCrs", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Output format",
        description: "File format of output (defaults to GeoTIFF)."
    })
], WebCoverageServiceParameterTraits.prototype, "outputFormat", void 0);
__decorate([
    objectArrayTrait({
        type: KeyValueTraits,
        idProperty: "key",
        name: "WCS subsets",
        description: 'Array of key-value pairs for subsets to be included in query parameters. For example `{key: "Time", value: "2020"}` will add query parameter `subset=Time("2020")`'
    })
], WebCoverageServiceParameterTraits.prototype, "subsets", void 0);
__decorate([
    objectArrayTrait({
        type: KeyValueTraits,
        idProperty: "key",
        name: "Duplicate subset values",
        description: "If multiple values have been detected for a particular subset ID (key), then we can only use the first one as WCS only supports one value per subset. Each element in this array represents the **actual** value used for a subset which has multiple values."
    })
], WebCoverageServiceParameterTraits.prototype, "duplicateSubsetValues", void 0);
__decorate([
    objectArrayTrait({
        type: KeyValueTraits,
        idProperty: "index",
        merge: false,
        name: "Additional key-value parameters to add as URL query parameters",
        description: "Each key-value will be added to URL like so - `someurl.com?key=value`."
    })
], WebCoverageServiceParameterTraits.prototype, "additionalParameters", void 0);
export default class ExportWebCoverageServiceTraits extends mixTraits(ExportableTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Linked WCS URL",
        description: "Gets or sets the URL of a WCS that enables clip-and-ship for this WMS item."
    })
], ExportWebCoverageServiceTraits.prototype, "linkedWcsUrl", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Linked WCS Coverage Name",
        description: "Gets or sets the coverage name for linked WCS for clip-and-ship."
    })
], ExportWebCoverageServiceTraits.prototype, "linkedWcsCoverage", void 0);
__decorate([
    objectTrait({
        type: WebCoverageServiceParameterTraits,
        name: "Linked WCS Parameters",
        description: "WCS Parameters included in `GetCoverage` requests (for clip-and-ship)."
    })
], ExportWebCoverageServiceTraits.prototype, "linkedWcsParameters", void 0);
//# sourceMappingURL=ExportWebCoverageServiceTraits.js.map
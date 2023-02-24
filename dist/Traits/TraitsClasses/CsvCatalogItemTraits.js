var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import AutoRefreshingTraits from "./AutoRefreshingTraits";
import TableTraits from "./Table/TableTraits";
import UrlTraits from "./UrlTraits";
class PollingTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.shouldReplaceData = true;
    }
}
__decorate([
    primitiveTrait({
        name: "Seconds",
        description: "Time in seconds to wait before polling for new data.",
        type: "number"
    })
], PollingTraits.prototype, "seconds", void 0);
__decorate([
    primitiveTrait({
        name: "url",
        description: "The URL to poll for new data. If undefined, uses the catalog item `url` if there is one.",
        type: "string"
    })
], PollingTraits.prototype, "url", void 0);
__decorate([
    primitiveTrait({
        name: "shouldReplaceData",
        description: "If true, the new data replaces the existing data, otherwise the new data will be appended to the old data.",
        type: "boolean"
    })
], PollingTraits.prototype, "shouldReplaceData", void 0);
export default class CsvCatalogItemTraits extends mixTraits(AutoRefreshingTraits, UrlTraits, TableTraits) {
}
__decorate([
    primitiveTrait({
        name: "Character Set",
        description: "The character set of the CSV data, overriding the information provided by the server, if any.",
        type: "string"
    })
], CsvCatalogItemTraits.prototype, "characterSet", void 0);
__decorate([
    primitiveTrait({
        name: "CSV Data",
        description: "The actual CSV data, represented as a string.",
        type: "string"
    })
], CsvCatalogItemTraits.prototype, "csvString", void 0);
__decorate([
    primitiveTrait({
        name: "Ignore rows starting with comment",
        description: "Any rows of a CSV starting with '#' or '//' will be ignored. A value of `undefined` will be treated the same as `false`.",
        type: "boolean"
    })
], CsvCatalogItemTraits.prototype, "ignoreRowsStartingWithComment", void 0);
__decorate([
    objectTrait({
        name: "Polling",
        description: "Polling configuration",
        type: PollingTraits
    })
], CsvCatalogItemTraits.prototype, "polling", void 0);
//# sourceMappingURL=CsvCatalogItemTraits.js.map
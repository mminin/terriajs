var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import AutoRefreshingTraits from "./AutoRefreshingTraits";
import CatalogFunctionTraits from "./CatalogFunctionTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import GroupTraits from "./GroupTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
export default class CatalogFunctionJobTraits extends mixTraits(CatalogFunctionTraits, AutoRefreshingTraits, CatalogMemberTraits, LegendOwnerTraits, GroupTraits) {
    constructor() {
        super(...arguments);
        this.logs = [];
        this.jobStatus = "inactive";
        this.downloadedResults = false;
        this.refreshEnabled = false;
        this.refreshInterval = 1;
    }
}
__decorate([
    primitiveArrayTrait({
        name: "Logs",
        description: "Job logs.",
        type: "string"
    })
], CatalogFunctionJobTraits.prototype, "logs", void 0);
__decorate([
    primitiveTrait({
        name: "Job status",
        description: "Job status.",
        type: "string"
    })
], CatalogFunctionJobTraits.prototype, "jobStatus", void 0);
__decorate([
    primitiveTrait({
        name: "Downloaded results",
        description: "Downloaded results.",
        type: "boolean"
    })
], CatalogFunctionJobTraits.prototype, "downloadedResults", void 0);
__decorate([
    primitiveTrait({
        name: "Refresh enabled",
        description: "Toggle for enabling auto refresh. (This overrides Trait in AutoRefreshingTraits)",
        type: "boolean"
    })
], CatalogFunctionJobTraits.prototype, "refreshEnabled", void 0);
__decorate([
    primitiveTrait({
        name: "Refresh interval",
        description: "How often the job will poll for results, in seconds. (This overrides `AutoRefreshingTraits`)",
        type: "number"
    })
], CatalogFunctionJobTraits.prototype, "refreshInterval", void 0);
//# sourceMappingURL=CatalogFunctionJobTraits.js.map
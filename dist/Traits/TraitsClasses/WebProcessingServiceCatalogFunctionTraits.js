var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import mixTraits from "../mixTraits";
import UrlTraits from "./UrlTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import CatalogFunctionTraits from "./CatalogFunctionTraits";
export default class WebProcessingServiceCatalogFunctionTraits extends mixTraits(CatalogFunctionTraits, UrlTraits) {
    constructor() {
        super(...arguments);
        this.executeWithHttpGet = false;
        this.forceConvertResultsToV8 = false;
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Execute with HTTP GET",
        description: "If true, sends a `GET` request to the Execute endpoint instead of the default `POST` request."
    })
], WebProcessingServiceCatalogFunctionTraits.prototype, "executeWithHttpGet", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Store supported",
        description: "Indicates if the output can be stored by the WPS server and be accessed via a URL."
    })
], WebProcessingServiceCatalogFunctionTraits.prototype, "storeSupported", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Status supported",
        description: "Indicates if Execute operation can return just the status information and perform the actual operation asynchronously."
    })
], WebProcessingServiceCatalogFunctionTraits.prototype, "statusSupported", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Identifier",
        description: "The identifier for the process"
    })
], WebProcessingServiceCatalogFunctionTraits.prototype, "identifier", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Force convert results to v8",
        description: "If true, then all results will be converted from v7 to v8. If false, then the `result.version` string will be checked to see if conversion is necessary."
    })
], WebProcessingServiceCatalogFunctionTraits.prototype, "forceConvertResultsToV8", void 0);
//# sourceMappingURL=WebProcessingServiceCatalogFunctionTraits.js.map
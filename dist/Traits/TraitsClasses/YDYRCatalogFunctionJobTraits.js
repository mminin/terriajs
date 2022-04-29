var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import mixTraits from "../mixTraits";
import UrlTraits from "./UrlTraits";
import CatalogFunctionJobTraits from "./CatalogFunctionJobTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class YDYRCatalogFunctionJobTraits extends mixTraits(UrlTraits, CatalogFunctionJobTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Job ID",
        description: "Job ID for YDYR API."
    })
], YDYRCatalogFunctionJobTraits.prototype, "jobId", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Result ID",
        description: "Result ID for YDYR API."
    })
], YDYRCatalogFunctionJobTraits.prototype, "resultId", void 0);
//# sourceMappingURL=YDYRCatalogFunctionJobTraits.js.map
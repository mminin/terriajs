var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class GetCapabilitiesTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.getCapabilitiesCacheDuration = "1d";
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "GetCapabilities URL",
        description: "The URL at which to access to the OGC GetCapabilities service."
    })
], GetCapabilitiesTraits.prototype, "getCapabilitiesUrl", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "GetCapabilities Cache Duration",
        description: "The amount of time to cache GetCapabilities responses."
    })
], GetCapabilitiesTraits.prototype, "getCapabilitiesCacheDuration", void 0);
//# sourceMappingURL=GetCapabilitiesTraits.js.map
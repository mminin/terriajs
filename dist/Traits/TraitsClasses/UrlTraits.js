var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class UrlTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.forceProxy = false;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "URL",
        description: "The base URL of the file or service."
    })
], UrlTraits.prototype, "url", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Force proxy",
        description: "Force the default proxy to be used for all network requests."
    })
], UrlTraits.prototype, "forceProxy", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Cache Duration",
        description: "The cache duration to use for proxied URLs for this catalog member. If undefined, proxied URLs are effectively cachable forever. The duration is expressed as a Varnish-like duration string, such as '1d' (one day) or '10000s' (ten thousand seconds)."
    })
], UrlTraits.prototype, "cacheDuration", void 0);
//# sourceMappingURL=UrlTraits.js.map
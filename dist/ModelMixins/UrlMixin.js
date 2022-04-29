var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import URI from "urijs";
function UrlMixin(Base) {
    class UrlMixin extends Base {
        get hasUrlMixin() {
            return true;
        }
        get uri() {
            if (this.url === undefined) {
                return undefined;
            }
            return new URI(this.url);
        }
    }
    __decorate([
        computed
    ], UrlMixin.prototype, "uri", null);
    return UrlMixin;
}
(function (UrlMixin) {
    function isMixedInto(model) {
        return model && model.hasUrlMixin;
    }
    UrlMixin.isMixedInto = isMixedInto;
})(UrlMixin || (UrlMixin = {}));
export default UrlMixin;
//# sourceMappingURL=UrlMixin.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import StratumOrder from "../Models/Definition/StratumOrder";
function GetCapabilitiesMixin(Base) {
    class GetCapabilitiesMixin extends Base {
        get getCapabilitiesUrl() {
            const getCapabilitiesUrl = super.getCapabilitiesUrl;
            if (getCapabilitiesUrl !== undefined) {
                return getCapabilitiesUrl;
            }
            else {
                return this.defaultGetCapabilitiesUrl;
            }
        }
    }
    __decorate([
        computed
    ], GetCapabilitiesMixin.prototype, "getCapabilitiesUrl", null);
    return GetCapabilitiesMixin;
}
(function (GetCapabilitiesMixin) {
    GetCapabilitiesMixin.getCapabilitiesStratumName = "getCapabilities";
    StratumOrder.addLoadStratum(GetCapabilitiesMixin.getCapabilitiesStratumName);
})(GetCapabilitiesMixin || (GetCapabilitiesMixin = {}));
export default GetCapabilitiesMixin;
//# sourceMappingURL=GetCapabilitiesMixin.js.map
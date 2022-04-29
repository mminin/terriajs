var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import MappableTraits from "./MappableTraits";
import mixTraits from "../mixTraits";
export default class AutoRefreshingTraits extends mixTraits(MappableTraits) {
    constructor() {
        super(...arguments);
        this.refreshEnabled = true;
    }
}
__decorate([
    primitiveTrait({
        name: "Refresh interval",
        description: "How often the data in this model is refreshed, in seconds",
        type: "number"
    })
], AutoRefreshingTraits.prototype, "refreshInterval", void 0);
__decorate([
    primitiveTrait({
        name: "Refresh enabled",
        description: "Toggle for enabling auto refresh.",
        type: "boolean"
    })
], AutoRefreshingTraits.prototype, "refreshEnabled", void 0);
//# sourceMappingURL=AutoRefreshingTraits.js.map
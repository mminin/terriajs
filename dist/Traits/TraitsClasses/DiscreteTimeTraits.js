var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class DiscreteTimeTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Time",
        description: "The discrete time, expressed as an ISO8601 string.",
        type: "string"
    })
], DiscreteTimeTraits.prototype, "time", void 0);
__decorate([
    primitiveTrait({
        name: "Tag",
        description: "The tag associated with this time. If a tag is not specified, the time itself is used as the tag.",
        type: "string"
    })
], DiscreteTimeTraits.prototype, "tag", void 0);
//# sourceMappingURL=DiscreteTimeTraits.js.map
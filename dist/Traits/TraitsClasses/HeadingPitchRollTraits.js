var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class HeadingPitchRollTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Heading",
        description: "Heading in degrees"
    })
], HeadingPitchRollTraits.prototype, "heading", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Pitch",
        description: "Pitch in degrees"
    })
], HeadingPitchRollTraits.prototype, "pitch", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Roll",
        description: "Roll in degrees"
    })
], HeadingPitchRollTraits.prototype, "roll", void 0);
//# sourceMappingURL=HeadingPitchRollTraits.js.map
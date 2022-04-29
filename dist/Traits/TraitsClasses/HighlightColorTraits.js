var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class HighlightColorTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Highlight color",
        type: "string",
        description: "The color used to highlight a feature when it is picked. If not set, this defaults to `Terria.baseMapContrastColor`"
    })
], HighlightColorTraits.prototype, "highlightColor", void 0);
//# sourceMappingURL=HighlightColorTraits.js.map
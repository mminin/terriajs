var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
export default class LayerOrderingTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.keepOnTop = false;
        this.supportsReordering = true;
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Keep on top",
        description: "Keeps the layer on top of all other imagery layers."
    })
], LayerOrderingTraits.prototype, "keepOnTop", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Supports reordering",
        description: "Does this layer support reordering in the workbench."
    })
], LayerOrderingTraits.prototype, "supportsReordering", void 0);
//# sourceMappingURL=LayerOrderingTraits.js.map
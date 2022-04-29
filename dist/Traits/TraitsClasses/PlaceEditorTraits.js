var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import primitiveTrait from "../Decorators/primitiveTrait";
import objectTrait from "../Decorators/objectTrait";
export class EditorTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.isEditable = false;
        this.isTransformable = false;
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is editable?",
        description: "Indicates whether we can edit some aspect of the model item like its visibility or color"
    })
], EditorTraits.prototype, "isEditable", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Is transformable?",
        description: "Indicates whether we can rotate/translate/scale the model"
    })
], EditorTraits.prototype, "isTransformable", void 0);
/**
 * Traits for an external tool
 */
export default class PlaceEditorTraits extends ModelTraits {
}
__decorate([
    objectTrait({
        type: EditorTraits,
        name: "Editor traits",
        description: "Editor traits"
    })
], PlaceEditorTraits.prototype, "editing", void 0);
//# sourceMappingURL=PlaceEditorTraits.js.map
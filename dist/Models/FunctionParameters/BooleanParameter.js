var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import FunctionParameter from "./FunctionParameter";
export default class BooleanParameter extends FunctionParameter {
    constructor(catalogFunction, options) {
        super(catalogFunction, options);
        this.type = "boolean";
        this.trueName = options.trueName;
        this.trueDescription = options.trueDescription;
        this.falseName = options.falseName;
        this.falseDescription = options.falseDescription;
    }
    /**
     * Gets a value indicating whether this parameter has names for its "true" and "false" states.
     */
    get hasNamedStates() {
        return (typeof this.trueName === "string" && typeof this.falseName === "string");
    }
}
BooleanParameter.type = "boolean";
__decorate([
    computed
], BooleanParameter.prototype, "hasNamedStates", null);
//# sourceMappingURL=BooleanParameter.js.map
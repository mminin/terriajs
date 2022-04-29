var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, observable } from "mobx";
import isDefined from "../../Core/isDefined";
import FunctionParameter from "./FunctionParameter";
/**
 * Function Parameter for showing information - this makes no changes to `parameters`, all values are stored locally.
 */
export default class InfoParameter extends FunctionParameter {
    constructor(catalogFunction, options) {
        super(catalogFunction, options);
        this.type = "info";
        this._errorMessage = false;
        if (isDefined(options.value)) {
            this._value = options.value;
        }
        if (isDefined(options.errorMessage)) {
            this._errorMessage = options.errorMessage;
        }
    }
    get isValid() {
        return !this._errorMessage;
    }
    get value() {
        return this._value;
    }
    setValue(strataId, v) {
        this._value = v;
    }
    clearValue(strataId) {
        this._value = undefined;
    }
}
InfoParameter.type = "info";
__decorate([
    observable
], InfoParameter.prototype, "_value", void 0);
__decorate([
    computed
], InfoParameter.prototype, "isValid", null);
__decorate([
    computed
], InfoParameter.prototype, "value", null);
//# sourceMappingURL=InfoParameter.js.map
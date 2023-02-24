var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, observable, reaction } from "mobx";
import isDefined from "../../Core/isDefined";
import CommonStrata from "../Definition/CommonStrata";
import FunctionParameter from "./FunctionParameter";
export default class EnumerationParameter extends FunctionParameter {
    constructor(catalogFunction, options) {
        super(catalogFunction, options);
        this.type = "enumeration";
        this.options = options.options;
        // Set value to something useful if undefined (and a value isRequired)
        reaction(() => this.value, () => {
            var _a, _b;
            if (!isDefined(this.value) &&
                this.isRequired && ((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id)) {
                this.setValue(CommonStrata.user, this.options[0].id);
            }
        }, { fireImmediately: true });
    }
    get isValid() {
        if (!isDefined(this.value)) {
            return !this.isRequired;
        }
        return isDefined(this.options.find((option) => option.id === this.value));
    }
}
EnumerationParameter.type = "enumeration";
__decorate([
    observable
], EnumerationParameter.prototype, "options", void 0);
__decorate([
    computed
], EnumerationParameter.prototype, "isValid", null);
//# sourceMappingURL=EnumerationParameter.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, runInAction } from "mobx";
import combine from "terriajs-cesium/Source/Core/combine";
import isDefined from "../../Core/isDefined";
import omit from "lodash-es/omit";
export default class FunctionParameter {
    constructor(catalogFunction, options) {
        this.catalogFunction = catalogFunction;
        this.isFunctionParameter = true;
        this.id = options.id;
        this.name = options.name || this.id;
        this.description = options.description || "";
        this.isRequired = options.isRequired || false;
    }
    get isValid() {
        if (!isDefined(this.value)) {
            return !this.isRequired;
        }
        return true;
    }
    get value() {
        var _a;
        return (_a = this.catalogFunction.parameters) === null || _a === void 0 ? void 0 : _a[this.id];
    }
    setValue(strataId, v) {
        if (isDefined(v)) {
            let newParameters = {
                [this.id]: v
            };
            if (isDefined(this.catalogFunction.parameters)) {
                newParameters = combine(newParameters, this.catalogFunction.parameters);
            }
            runInAction(() => {
                this.catalogFunction.setTrait(strataId, "parameters", newParameters);
            });
        }
        else {
            this.clearValue(strataId);
        }
    }
    clearValue(strataId) {
        var _a;
        if (isDefined((_a = this.catalogFunction.parameters) === null || _a === void 0 ? void 0 : _a[this.id])) {
            runInAction(() => {
                this.catalogFunction.setTrait(strataId, "parameters", omit(this.catalogFunction.parameters, this.id));
            });
        }
    }
    formatValueAsString(value) {
        value = isDefined(value) ? value : this.value;
        return isDefined(value) ? value.toString() : "-";
    }
    static isInstanceOf(obj) {
        return obj.isFunctionParameter;
    }
}
__decorate([
    computed
], FunctionParameter.prototype, "isValid", null);
__decorate([
    computed
], FunctionParameter.prototype, "value", null);
//# sourceMappingURL=FunctionParameter.js.map
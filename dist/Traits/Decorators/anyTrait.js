import { computed } from "mobx";
import Result from "../../Core/Result";
import Trait from "../Trait";
export default function anyTrait(options) {
    return function (target, propertyKey) {
        const constructor = target.constructor;
        if (!constructor.traits) {
            constructor.traits = {};
        }
        constructor.traits[propertyKey] = new AnyTrait(propertyKey, options, constructor);
    };
}
export class AnyTrait extends Trait {
    constructor(id, options, parent) {
        super(id, options, parent);
        this.decoratorForFlattened = computed.struct;
    }
    getValue(model) {
        for (let stratum of model.strataTopToBottom.values()) {
            const stratumAny = stratum;
            if (stratumAny !== undefined && stratumAny[this.id] !== undefined) {
                return stratumAny[this.id];
            }
        }
        return undefined;
    }
    fromJson(model, stratumName, jsonValue) {
        return new Result(jsonValue);
    }
    toJson(value) {
        return value;
    }
    isSameType(trait) {
        return trait instanceof AnyTrait;
    }
}
//# sourceMappingURL=anyTrait.js.map
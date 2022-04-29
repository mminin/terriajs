import Result from "../../Core/Result";
import TerriaError from "../../Core/TerriaError";
import Trait from "../Trait";
export default function primitiveTrait(options) {
    return function (target, propertyKey) {
        const constructor = target.constructor;
        if (!constructor.traits) {
            constructor.traits = {};
        }
        constructor.traits[propertyKey] = new PrimitiveTrait(propertyKey, options, constructor);
    };
}
export class PrimitiveTrait extends Trait {
    constructor(id, options, parent) {
        super(id, options, parent);
        this.type = options.type;
        this.isNullable = options.isNullable || false;
    }
    getValue(model) {
        const strataTopToBottom = model.strataTopToBottom;
        for (let stratum of strataTopToBottom.values()) {
            const value = stratum[this.id];
            if (value !== undefined) {
                return value;
            }
        }
        return undefined;
    }
    fromJson(model, stratumName, jsonValue) {
        if (typeof jsonValue !== this.type &&
            (!this.isNullable || jsonValue !== null)) {
            return Result.error(new TerriaError({
                title: "Invalid property",
                message: `Property ${this.id} is expected to be of type ${this.type} but instead it is of type ${typeof jsonValue}.`
            }));
        }
        return new Result(jsonValue);
    }
    toJson(value) {
        return value;
    }
    isSameType(trait) {
        return (trait instanceof PrimitiveTrait &&
            trait.type === this.type &&
            trait.isNullable === this.isNullable);
    }
}
//# sourceMappingURL=primitiveTrait.js.map
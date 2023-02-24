import Result from "../../Core/Result";
import TerriaError from "../../Core/TerriaError";
import Trait from "../Trait";
export default function primitiveArrayTrait(options) {
    return function (target, propertyKey) {
        const constructor = target.constructor;
        if (!constructor.traits) {
            constructor.traits = {};
        }
        constructor.traits[propertyKey] = new PrimitiveArrayTrait(propertyKey, options, constructor);
    };
}
export class PrimitiveArrayTrait extends Trait {
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
        if (!this.isValidJson(jsonValue)) {
            return Result.error(new TerriaError({
                title: "Invalid property",
                message: `Property ${this.id} is expected to be of type ${this.type}[].`
            }));
        }
        return new Result(jsonValue);
    }
    toJson(value) {
        return value;
    }
    isSameType(trait) {
        return (trait instanceof PrimitiveArrayTrait &&
            trait.type === this.type &&
            trait.isNullable === this.isNullable);
    }
    isValidJson(jsonValue) {
        if (jsonValue === null && this.isNullable) {
            return true;
        }
        if (!Array.isArray(jsonValue)) {
            return false;
        }
        return jsonValue.every((item) => typeof item === this.type);
    }
}
//# sourceMappingURL=primitiveArrayTrait.js.map
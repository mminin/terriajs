import { computed } from "mobx";
import Result from "../../Core/Result";
import TerriaError from "../../Core/TerriaError";
import createStratumInstance from "../../Models/Definition/createStratumInstance";
import saveStratumToJson from "../../Models/Definition/saveStratumToJson";
import NestedStrataMap from "../NestedStrataMap";
import Trait from "../Trait";
import traitsClassToModelClass from "../traitsClassToModelClass";
export default function objectTrait(options) {
    return function (target, propertyKey) {
        const constructor = target.constructor;
        if (!constructor.traits) {
            constructor.traits = {};
        }
        constructor.traits[propertyKey] = new ObjectTrait(propertyKey, options, constructor);
    };
}
export class ObjectTrait extends Trait {
    constructor(id, options, parent) {
        super(id, options, parent);
        this.decoratorForFlattened = computed.struct;
        this.type = options.type;
        this.isNullable = options.isNullable || false;
        this.modelClass = options.modelClass || traitsClassToModelClass(this.type);
    }
    getValue(model) {
        return new this.modelClass(undefined, model.terria, undefined, new NestedStrataMap(model.TraitsClass, model.strata, this.id));
    }
    fromJson(model, stratumName, jsonValue) {
        const ResultType = this.type;
        const result = createStratumInstance(ResultType);
        if (this.isNullable && jsonValue === null) {
            return new Result(jsonValue);
        }
        const errors = [];
        Object.keys(jsonValue).forEach(propertyName => {
            const trait = ResultType.traits[propertyName];
            if (trait === undefined) {
                errors.push(new TerriaError({
                    title: "Unknown property",
                    message: `${propertyName} is not a valid sub-property of ${this.id}.`
                }));
                return;
            }
            const subJsonValue = jsonValue[propertyName];
            if (subJsonValue === undefined) {
                result[propertyName] = undefined;
            }
            else {
                result[propertyName] = trait
                    .fromJson(model, stratumName, subJsonValue)
                    .pushErrorTo(errors);
            }
        });
        return new Result(result, TerriaError.combine(errors, `Error${errors.length !== 1 ? "s" : ""} occurred while updating objectTrait model "${model.uniqueId}" from JSON`));
    }
    toJson(value) {
        if (value === undefined) {
            return undefined;
        }
        return saveStratumToJson(this.type.traits, value);
    }
    isSameType(trait) {
        return (trait instanceof ObjectTrait &&
            trait.type === this.type &&
            trait.isNullable === this.isNullable);
    }
}
//# sourceMappingURL=objectTrait.js.map
import { computed } from "mobx";
import Result from "../../Core/Result";
import TerriaError from "../../Core/TerriaError";
import createStubCatalogItem from "../../Models/Catalog/createStubCatalogItem";
import upsertModelFromJson from "../../Models/Definition/upsertModelFromJson";
import Trait from "../Trait";
export default function modelReferenceTrait(options) {
    return function (target, propertyKey) {
        const constructor = target.constructor;
        if (!constructor.traits) {
            constructor.traits = {};
        }
        constructor.traits[propertyKey] = new ModelReferenceTrait(propertyKey, options, constructor);
    };
}
export class ModelReferenceTrait extends Trait {
    constructor(id, options, parent) {
        super(id, options, parent);
        this.decoratorForFlattened = computed.struct;
        this.factory = options.factory;
        this.modelParentId = options.modelParentId;
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
        var _a;
        const errors = [];
        let result;
        if (typeof jsonValue === "string") {
            result = jsonValue;
        }
        else if (typeof jsonValue === "object") {
            if (this.factory === undefined) {
                errors.push(new TerriaError({
                    title: "Cannot create Model",
                    message: "A modelReferenceTrait does not have a factory but it contains an embedded model that does not yet exist."
                }));
            }
            else {
                const newModel = upsertModelFromJson(this.factory, model.terria, model.uniqueId === undefined
                    ? this.modelParentId
                        ? this.modelParentId
                        : "/"
                    : model.uniqueId, stratumName, jsonValue, {}).catchError((error) => errors.push(error));
                result = (_a = newModel === null || newModel === void 0 ? void 0 : newModel.uniqueId) !== null && _a !== void 0 ? _a : createStubCatalogItem(model.terria).uniqueId;
            }
        }
        else {
            errors.push(new TerriaError({
                title: "Invalid property",
                message: `Elements of ${this.id} are expected to be strings or objects but instead are of type ${typeof jsonValue}.`
            }));
        }
        return new Result(result, TerriaError.combine(errors, `Error updating model "${model.uniqueId}" from JSON`));
    }
    toJson(value) {
        return value;
    }
    isSameType(trait) {
        return (trait instanceof ModelReferenceTrait && trait.factory === this.factory);
    }
}
//# sourceMappingURL=modelReferenceTrait.js.map
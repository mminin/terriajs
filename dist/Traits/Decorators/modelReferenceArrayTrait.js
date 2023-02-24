import { computed } from "mobx";
import isDefined from "../../Core/isDefined";
import Result from "../../Core/Result";
import TerriaError from "../../Core/TerriaError";
import createStubCatalogItem from "../../Models/Catalog/createStubCatalogItem";
import upsertModelFromJson from "../../Models/Definition/upsertModelFromJson";
import ModelReference from "../ModelReference";
import Trait from "../Trait";
export default function modelReferenceArrayTrait(options) {
    return function (target, propertyKey) {
        const constructor = target.constructor;
        if (!constructor.traits) {
            constructor.traits = {};
        }
        constructor.traits[propertyKey] = new ModelReferenceArrayTrait(propertyKey, options, constructor);
    };
}
export class ModelReferenceArrayTrait extends Trait {
    constructor(id, options, parent) {
        super(id, options, parent);
        this.decoratorForFlattened = computed.struct;
        this.factory = options.factory;
    }
    // This can probably be converted to a general array handler.
    // It takes an optional idProperty. If not specified, the values are themselves IDs.
    // It ensures that each ID is unique and that the topmost stratum wins for a given ID.
    // There can even be properties to control relative ordering of items in different strata.
    getValue(model) {
        const strataTopToBottom = model.strataTopToBottom;
        const result = [];
        const idMap = {};
        const removedIds = {};
        // Create a single array with all the unique model IDs.
        for (let stratum of strataTopToBottom.values()) {
            const modelIdArray = stratum[this.id];
            if (modelIdArray) {
                modelIdArray.forEach((modelId) => {
                    if (ModelReference.isRemoved(modelId)) {
                        // This ID is removed in this stratum.
                        removedIds[modelId.removed] = true;
                    }
                    else if (removedIds[modelId]) {
                        // This ID was removed by a stratum above this one, so ignore it.
                        return;
                    }
                    else if (!idMap[modelId]) {
                        // This is the first time we've seen this ID, so add it
                        idMap[modelId] = true;
                        result.push(modelId);
                    }
                });
            }
        }
        // TODO: only freeze in debug builds?
        // TODO: can we instead react to modifications of the array?
        return Object.freeze(result);
    }
    fromJson(model, stratumName, jsonValue) {
        // TODO: support removals
        if (!Array.isArray(jsonValue)) {
            return Result.error(new TerriaError({
                title: "Invalid property",
                message: `Property ${this.id} is expected to be an array but instead it is of type ${typeof jsonValue}.`
            }));
        }
        const errors = [];
        const result = jsonValue
            .map((jsonElement) => {
            var _a;
            if (typeof jsonElement === "string") {
                return jsonElement;
            }
            else if (typeof jsonElement === "object") {
                if (this.factory === undefined) {
                    errors.push(new TerriaError({
                        title: "Cannot create Model",
                        message: "A modelReferenceArrayTrait does not have a factory but it contains an embedded model that does not yet exist."
                    }));
                    return;
                }
                const nestedModel = upsertModelFromJson(this.factory, model.terria, model.uniqueId === undefined ? "/" : model.uniqueId, stratumName, jsonElement, {}).pushErrorTo(errors);
                // Maybe this should throw if undefined?
                return ((_a = nestedModel === null || nestedModel === void 0 ? void 0 : nestedModel.uniqueId) !== null && _a !== void 0 ? _a : createStubCatalogItem(model.terria).uniqueId);
            }
            else {
                errors.push(new TerriaError({
                    title: "Invalid property",
                    message: `Elements of ${this.id} are expected to be strings or objects but instead are of type ${typeof jsonElement}.`
                }));
            }
        })
            .filter(isDefined);
        return new Result(result, TerriaError.combine(errors, `Error updating modelReferenceArrayTrait model "${model.uniqueId}" from JSON`));
    }
    toJson(value) {
        return value;
    }
    isSameType(trait) {
        return (trait instanceof ModelReferenceArrayTrait &&
            trait.factory === this.factory);
    }
}
//# sourceMappingURL=modelReferenceArrayTrait.js.map
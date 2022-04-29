import { isObservableArray, runInAction } from "mobx";
import Result from "../../Core/Result";
import TerriaError from "../../Core/TerriaError";
import createStratumInstance from "./createStratumInstance";
import isDefined from "../../Core/isDefined";
export default function updateModelFromJson(model, stratumName, json, replaceStratum = false) {
    const traits = model.traits;
    const errors = [];
    runInAction(() => {
        if (replaceStratum) {
            model.strata.set(stratumName, createStratumInstance(model));
        }
        Object.keys(json).forEach(propertyName => {
            var _a;
            if (propertyName === "id" ||
                propertyName === "type" ||
                propertyName === "localId" ||
                propertyName === "shareKeys") {
                return;
            }
            const trait = traits[propertyName];
            if (trait === undefined) {
                errors.push(new TerriaError({
                    title: "Unknown property",
                    message: `The property \`${propertyName}\` is not valid for type \`${(_a = model.type) !== null && _a !== void 0 ? _a : json.type}\`.`
                }));
                return;
            }
            const jsonValue = json[propertyName];
            if (jsonValue === undefined) {
                model.setTrait(stratumName, propertyName, undefined);
            }
            else {
                let newTrait = trait
                    .fromJson(model, stratumName, jsonValue)
                    .pushErrorTo(errors);
                if (isDefined(newTrait)) {
                    // We want to merge members of groups with the same name/id
                    if (propertyName === "members") {
                        newTrait = mergeWithExistingMembers(model, stratumName, propertyName, newTrait);
                    }
                    model.setTrait(stratumName, propertyName, newTrait);
                }
            }
        });
    });
    return new Result(undefined, TerriaError.combine(errors, `Error updating model \`${model.uniqueId}\` from JSON`));
}
function mergeWithExistingMembers(model, stratumName, propertyName, newTrait) {
    const existingTrait = model.getTrait(stratumName, propertyName);
    if (existingTrait !== undefined && isObservableArray(existingTrait)) {
        existingTrait.push(...newTrait);
        return existingTrait;
    }
    return newTrait;
}
//# sourceMappingURL=updateModelFromJson.js.map
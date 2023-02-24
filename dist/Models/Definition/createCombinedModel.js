var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseModel } from "./Model";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import traitsClassToModelClass from "../../Traits/traitsClassToModelClass";
import createStratumInstance from "./createStratumInstance";
import { computed, decorate } from "mobx";
export default function createCombinedModel(top, bottom, ModelClass) {
    if (top.TraitsClass !== bottom.TraitsClass) {
        throw new DeveloperError("The two models in createCombinedModel must have the same TraitsClass.");
    }
    const strata = new CombinedStrata(top, bottom);
    if (!ModelClass) {
        ModelClass = traitsClassToModelClass(top.TraitsClass);
    }
    return new ModelClass(top.uniqueId, top.terria, undefined, strata);
}
export function extractTopModel(model) {
    if (model.strata instanceof CombinedStrata) {
        return model.strata.top;
    }
    return undefined;
}
export function extractBottomModel(model) {
    if (model.strata instanceof CombinedStrata) {
        return model.strata.bottom;
    }
    return undefined;
}
class CombinedStrata {
    constructor(top, bottom) {
        this.top = top;
        this.bottom = bottom;
    }
    clear() {
        this.top.strata.clear();
    }
    delete(key) {
        return this.top.strata.delete(key);
    }
    forEach(callbackfn, thisArg) {
        this.strata.forEach((value, key) => {
            callbackfn.call(thisArg, value, key, this);
        });
    }
    get(key) {
        return this.strata.get(key);
    }
    has(key) {
        return this.strata.has(key);
    }
    set(key, value) {
        this.top.strata.set(key, value);
        return this;
    }
    get size() {
        return this.strata.size;
    }
    [Symbol.iterator]() {
        return this.strata.entries();
    }
    entries() {
        return this.strata.entries();
    }
    keys() {
        return this.strata.keys();
    }
    values() {
        return this.strata.values();
    }
    get [Symbol.toStringTag]() {
        return this.strata.toString();
    }
    get strata() {
        const result = new Map();
        // Add the strata fro the top
        for (let key of this.top.strata.keys()) {
            const topStratum = this.top.strata.get(key);
            const bottomStratum = this.bottom.strata.get(key);
            if (topStratum !== undefined && bottomStratum !== undefined) {
                result.set(key, createCombinedStratum(this.top.TraitsClass, topStratum, bottomStratum));
            }
            else if (topStratum !== undefined) {
                result.set(key, topStratum);
            }
            else if (bottomStratum !== undefined) {
                const newTopStratum = createStratumInstance(this.top.TraitsClass);
                this.top.strata.set(key, newTopStratum);
                result.set(key, createCombinedStratum(this.top.TraitsClass, newTopStratum, bottomStratum));
            }
        }
        // Add any strata that are only in the bottom
        for (let key of this.bottom.strata.keys()) {
            if (this.top.strata.has(key)) {
                continue;
            }
            const bottomStratum = this.bottom.strata.get(key);
            if (bottomStratum === undefined) {
                continue;
            }
            result.set(key, bottomStratum);
        }
        return result;
    }
}
__decorate([
    computed
], CombinedStrata.prototype, "strata", null);
function createCombinedStratum(TraitsClass, top, bottom) {
    const strata = new Map([
        ["top", top],
        ["bottom", bottom]
    ]);
    const result = {
        strata: strata,
        strataTopToBottom: strata,
        TraitsClass: TraitsClass
    };
    const traits = TraitsClass.traits;
    const decorators = {};
    Object.keys(traits).forEach((traitName) => {
        const trait = traits[traitName];
        Object.defineProperty(result, traitName, {
            get: function () {
                const traitValue = trait.getValue(this);
                // The value may be a model (from ObjectTrait) or an array of models
                // (from ObjectArrayTrait). In either case the models will have two
                // strata named "top" and "bottom" because they will use
                // `NestedStrataMap` or `ArrayNestedStrataMap`. But we don't want
                // models because models have defaults. So instead extract the
                // two strata and call `createCombinedStratum` with them.
                if (traitValue instanceof BaseModel) {
                    return unwrapCombinedStratumFromModel(traitValue);
                }
                else if (Array.isArray(traitValue)) {
                    return traitValue.map((item) => {
                        if (item instanceof BaseModel) {
                            return unwrapCombinedStratumFromModel(item);
                        }
                        else {
                            return item;
                        }
                    });
                }
                return traitValue;
            },
            set: function (value) {
                top[traitName] = value;
            },
            enumerable: true,
            configurable: true
        });
        decorators[traitName] = trait.decoratorForFlattened || computed;
    });
    decorate(result, decorators);
    return result;
}
function unwrapCombinedStratumFromModel(value) {
    const nestedTop = value.strata.get("top");
    const nestedBottom = value.strata.get("bottom");
    if (nestedTop !== undefined && nestedBottom !== undefined) {
        return createCombinedStratum(value.TraitsClass, nestedTop, nestedBottom);
    }
    else if (nestedTop !== undefined) {
        return nestedTop;
    }
    else {
        return nestedBottom;
    }
}
//# sourceMappingURL=createCombinedModel.js.map
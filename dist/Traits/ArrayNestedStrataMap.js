var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import createStratumInstance from "../Models/Definition/createStratumInstance";
/**
 * A strata map where the strata are obtained from a sub-property of another
 * parent strata map.
 */
export default class ArrayNestedStrataMap {
    constructor(parentModel, parentProperty, objectTraits, objectIdProperty, objectId, merge) {
        this.parentModel = parentModel;
        this.parentProperty = parentProperty;
        this.objectTraits = objectTraits;
        this.objectIdProperty = objectIdProperty;
        this.objectId = objectId;
        this.merge = merge;
    }
    clear() {
        this.parentModel.strata.forEach((value, key) => {
            this.delete(key);
        });
    }
    delete(key) {
        const parentValue = this.parentModel.strata.get(key);
        if (parentValue === undefined) {
            return false;
        }
        let array = parentValue[this.parentProperty];
        if (array === undefined) {
            return false;
        }
        const index = array.findIndex((value, index) => {
            const id = getObjectId(this.objectIdProperty, value, index);
            return id === this.objectId;
        });
        if (index < 0) {
            return false;
        }
        array.splice(index, 1);
        return true;
    }
    forEach(callbackfn, thisArg) {
        this.strata.forEach((value, key, _) => callbackfn(value, key, this), thisArg);
    }
    get(key) {
        return this.strata.get(key);
    }
    has(key) {
        return this.strata.has(key);
    }
    set(key, value) {
        this.delete(key);
        let parentValue = this.parentModel.strata.get(key);
        if (parentValue === undefined) {
            parentValue = createStratumInstance(this.parentModel.TraitsClass);
            this.parentModel.strata.set(key, parentValue);
        }
        let array = parentValue[this.parentProperty];
        if (array === undefined) {
            parentValue[this.parentProperty] = [];
            array = parentValue[this.parentProperty];
        }
        value[this.objectIdProperty] = this.objectId;
        array.push(value);
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
        const strataTopToBottom = this.parentModel
            .strataTopToBottom;
        const result = new Map();
        // Find the strata that go into this object.
        for (let stratumId of strataTopToBottom.keys()) {
            const stratum = strataTopToBottom.get(stratumId);
            const objectArray = stratum[this.parentProperty];
            if (!objectArray) {
                continue;
            }
            // Find this object in the array, if it exists at all.
            const thisObject = objectArray.find((o, i) => {
                return getObjectId(this.objectIdProperty, o, i) === this.objectId;
            });
            if (thisObject === undefined) {
                continue;
            }
            if (this.objectTraits.isRemoval !== undefined &&
                this.objectTraits.isRemoval(thisObject)) {
                // This object is removed in this stratum, so stop here.
                break;
            }
            // This stratum applies to this object.
            result.set(stratumId, thisObject);
            // If merge is false, only return the top-most strata's object
            if (!this.merge)
                return result;
        }
        return result;
    }
}
__decorate([
    computed
], ArrayNestedStrataMap.prototype, "strata", null);
export function getObjectId(idProperty, object, index) {
    if (idProperty === "index") {
        if (object.index === undefined) {
            return index.toString();
        }
        else {
            return object.index.toString();
        }
    }
    else {
        return object[idProperty];
    }
}
//# sourceMappingURL=ArrayNestedStrataMap.js.map
import createStratumInstance from "../Models/Definition/createStratumInstance";
/**
 * A strata map where the strata are obtained from a sub-property of another
 * parent strata map.
 */
export default class NestedStrataMap {
    constructor(parentTraitsClass, parent, parentProperty) {
        this.parentTraitsClass = parentTraitsClass;
        this.parent = parent;
        this.parentProperty = parentProperty;
    }
    clear() {
        this.parent.forEach((value) => {
            value[this.parentProperty] = undefined;
        });
    }
    delete(key) {
        const parentValue = this.parent.get(key);
        if (parentValue === undefined) {
            return false;
        }
        const hasValue = parentValue[this.parentProperty] !== undefined;
        parentValue[this.parentProperty] = undefined;
        return hasValue;
    }
    forEach(callbackfn, thisArg) {
        this.parent.forEach((parentValue, key) => {
            const value = parentValue[this.parentProperty];
            if (value !== undefined) {
                callbackfn.call(thisArg, value, key, this);
            }
        });
    }
    get(key) {
        const parentValue = this.parent.get(key);
        return parentValue && parentValue[this.parentProperty];
    }
    has(key) {
        return this.parent.has(key);
    }
    set(key, value) {
        let parentValue = this.parent.get(key);
        if (parentValue === undefined) {
            parentValue = createStratumInstance(this.parentTraitsClass);
            this.parent.set(key, parentValue);
        }
        parentValue[this.parentProperty] = value;
        return this;
    }
    get size() {
        return this.parent.size;
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    *entries() {
        for (let entry of this.parent.entries()) {
            const parentValue = entry[1];
            const value = parentValue[this.parentProperty];
            if (value === undefined) {
                continue;
            }
            yield [entry[0], value];
        }
    }
    *keys() {
        // Only return keys that have a value.
        for (let entry of this.entries()) {
            yield entry[0];
        }
    }
    *values() {
        for (let entry of this.parent.entries()) {
            const parentValue = entry[1];
            const value = parentValue[this.parentProperty];
            if (value === undefined) {
                continue;
            }
            yield value;
        }
    }
    get [Symbol.toStringTag]() {
        return new Map(this.entries()).toString();
    }
}
//# sourceMappingURL=NestedStrataMap.js.map
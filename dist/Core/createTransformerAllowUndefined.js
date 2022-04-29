var _a;
import { createTransformer } from "mobx-utils";
const undefinedObjectSymbol = Symbol("isUndefinedObject");
class UndefinedObject {
    constructor() {
        this[_a] = true;
    }
}
_a = undefinedObjectSymbol;
function isUndefinedObject(x) {
    return typeof x === "object" && undefinedObjectSymbol in x;
}
const undefinedObject = new UndefinedObject();
/**
 * This function is identical to the MobX `createTransformer` function except that it allows `undefined` to be used as a transformed value.
 * @param transformer The transformer function.
 * @param onCleanup A function called when a memoized result is no longer needed.
 */
export default function createTransformerAllowUndefined(transformer, onCleanup) {
    function unwrap(object) {
        return transformer(isUndefinedObject(object) ? undefined : object);
    }
    Object.defineProperty(unwrap, "name", {
        value: (transformer.name || "anonymous") + "-allowUndefined"
    });
    const unwrapOnCleanup = onCleanup == undefined
        ? undefined
        : function (resultObject, sourceObject) {
            const unwrapped = isUndefinedObject(sourceObject)
                ? undefined
                : sourceObject;
            return onCleanup(resultObject, unwrapped);
        };
    const transformed = createTransformer(unwrap, unwrapOnCleanup);
    return function wrap(object) {
        return transformed(object === undefined ? undefinedObject : object);
    };
}
//# sourceMappingURL=createTransformerAllowUndefined.js.map
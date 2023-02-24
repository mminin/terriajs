import { computed, decorate } from "mobx";
export default function addModelStrataView(model, Traits) {
    const traits = Traits.traits;
    const decorators = {};
    const propertyTarget = typeof model === "function" ? model.prototype : model;
    const traitsInstance = new Traits();
    Object.keys(traits).forEach((traitName) => {
        const trait = traits[traitName];
        const defaultValue = traitsInstance[traitName];
        Object.defineProperty(propertyTarget, traitName, {
            get: function () {
                const value = trait.getValue(this);
                return value === undefined ? defaultValue : value;
            },
            enumerable: true,
            configurable: true
        });
        decorators[traitName] = trait.decoratorForFlattened || computed;
    });
    decorate(model, decorators);
    return model;
}
//# sourceMappingURL=addModelStrataView.js.map
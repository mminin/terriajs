var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable, runInAction, toJS } from "mobx";
import filterOutUndefined from "../../Core/filterOutUndefined";
import flatten from "../../Core/flatten";
import isDefined from "../../Core/isDefined";
import TerriaError from "../../Core/TerriaError";
import { getObjectId } from "../../Traits/ArrayNestedStrataMap";
import addModelStrataView from "./addModelStrataView";
import createStratumInstance from "./createStratumInstance";
import { isLoadableStratum } from "./LoadableStratum";
import { BaseModel } from "./Model";
import StratumOrder from "./StratumOrder";
export default function CreateModel(Traits) {
    class Model extends BaseModel {
        constructor(id, terria, sourceReference, strata) {
            super(id, terria, sourceReference);
            this.traits = Traits.traits;
            this.TraitsClass = Traits;
            /**
             * Babel transpiles this & correctly assigns undefined to this property as
             * under `proposal-class-fields` declaring a property without initialising
             * it still declares it, thus treated as
             *
             * `sourceReference = undefined;`
             * >This differs a bit from certain transpiler implementations, which would
             * >just entirely ignore a field declaration which has no initializer.
             *
             * instead of what we had expected with TypeScript's treatment of this class
             * property being:
             * `readonly sourceReference: BaseModel | undefined;`
             *
             * whereas ts-loader strips the type completely along with the implicit
             * undefined assignment getting removed entirely before it hits
             * babel-loader, side-stepping this case.
             *
             * Given we don't actually do anything different to the main constructor
             * call in `BaseModel`, it feels more correct to remove this annotation
             * rather than declare it here + re-assigning it in the `Model` constructor
             */
            // readonly sourceReference: BaseModel | undefined;
            /**
             * Gets the uniqueIds of models that are known to contain this one.
             * This is important because strata sometimes flow from container to
             * container, so the properties of this model may not be complete
             * if the container isn't loaded yet. It's also important for locating
             * this model in a hierarchical catalog.
             */
            this.knownContainerUniqueIds = [];
            this.strata = strata || observable.map();
        }
        dispose() { }
        getOrCreateStratum(id) {
            let result = this.strata.get(id);
            if (!result) {
                const newStratum = createStratumInstance(Traits);
                runInAction(() => {
                    this.strata.set(id, newStratum);
                });
                result = newStratum;
            }
            return result;
        }
        duplicateModel(newId, sourceReference) {
            let newModel;
            try {
                newModel = new this.constructor(newId, this.terria, sourceReference);
            }
            catch (e) {
                throw TerriaError.from(`Failed to create model \`"${newId}"\``);
            }
            this.strata.forEach((stratum, stratumId) => {
                try {
                    const newStratum = isLoadableStratum(stratum)
                        ? stratum.duplicateLoadableStratum(newModel)
                        : createStratumInstance(Traits, toJS(stratum));
                    newModel.strata.set(stratumId, newStratum);
                }
                catch (e) {
                    throw TerriaError.from(e, {
                        message: `Failed to duplicate stratum \`${stratumId}\` for model \`${newId}\`.`,
                        importance: -1
                    });
                }
            });
            return newModel;
        }
        get strataTopToBottom() {
            return StratumOrder.sortTopToBottom(this.strata);
        }
        get strataBottomToTop() {
            return StratumOrder.sortBottomToTop(this.strata);
        }
        setTrait(stratumId, trait, value) {
            this.getOrCreateStratum(stratumId)[trait] = value;
        }
        getTrait(stratumId, trait) {
            return this.getOrCreateStratum(stratumId)[trait];
        }
        addObject(stratumId, traitId, objectId) {
            const trait = this.traits[traitId];
            const nestedTraitsClass = trait.type;
            const newStratum = createStratumInstance(nestedTraitsClass);
            const stratum = this.getOrCreateStratum(stratumId);
            let array = stratum[traitId];
            if (array === undefined) {
                stratum[traitId] = [];
                array = stratum[traitId];
            }
            // If objectID is provided, set idProperty and then return new object
            if (isDefined(objectId)) {
                newStratum[trait.idProperty] = objectId;
                array.push(newStratum);
                const models = this[traitId];
                return models.find((o, i) => getObjectId(trait.idProperty, o, i) === objectId);
            }
            // If no objectID is provided, we create a new object the end of the array (across all strata)
            // This method `isRemoval` and `idProperty="index"` into account.
            else {
                let maxIndex = -1;
                this.strata.forEach((s) => { var _a; return (_a = s[traitId]) === null || _a === void 0 ? void 0 : _a.forEach((e, idx) => (maxIndex = idx > maxIndex ? idx : maxIndex)); });
                // Make array in this stratum the same length as largest array across all strata
                for (let i = array.length; i <= maxIndex; i++) {
                    array[i] = createStratumInstance(nestedTraitsClass);
                }
                // Add new object at the end of the array
                array[maxIndex + 1] = newStratum;
                // Return newly created model
                const models = this[traitId];
                return models[models.length - 1];
            }
        }
        /** Return full list of knownContainerUniqueIds.
         * This will recursively traverse tree of knownContainerUniqueIds models to return full list of dependencies
         */
        get completeKnownContainerUniqueIds() {
            const findContainers = (model) => [
                ...model.knownContainerUniqueIds,
                ...flatten(filterOutUndefined(model.knownContainerUniqueIds.map((parentId) => {
                    const parent = this.terria.getModelById(BaseModel, parentId);
                    if (parent) {
                        return findContainers(parent);
                    }
                })))
            ];
            return findContainers(this).reverse();
        }
    }
    Model.TraitsClass = Traits;
    Model.traits = Traits.traits;
    __decorate([
        observable
    ], Model.prototype, "knownContainerUniqueIds", void 0);
    __decorate([
        computed
    ], Model.prototype, "strataTopToBottom", null);
    __decorate([
        computed
    ], Model.prototype, "strataBottomToTop", null);
    __decorate([
        action
    ], Model.prototype, "setTrait", null);
    __decorate([
        computed
    ], Model.prototype, "completeKnownContainerUniqueIds", null);
    addModelStrataView(Model, Traits);
    return Model;
}
//# sourceMappingURL=CreateModel.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, isObservableArray, runInAction, toJS } from "mobx";
import Mustache from "mustache";
import AsyncLoader from "../Core/AsyncLoader";
import isDefined from "../Core/isDefined";
import { isJsonObject, isJsonString } from "../Core/Json";
import hasTraits from "../Models/Definition/hasTraits";
import updateModelFromJson from "../Models/Definition/updateModelFromJson";
import CatalogMemberReferenceTraits from "../Traits/TraitsClasses/CatalogMemberReferenceTraits";
import AccessControlMixin from "./AccessControlMixin";
import GroupMixin from "./GroupMixin";
import MappableMixin from "./MappableMixin";
import ReferenceMixin from "./ReferenceMixin";
function CatalogMemberMixin(Base) {
    class CatalogMemberMixin extends AccessControlMixin(Base) {
        constructor() {
            super(...arguments);
            // The names of items in the CatalogMember's info array that contain details of the source of this CatalogMember's data.
            // This should be overridden by children of this class. For an example see the WebMapServiceCatalogItem
            this._sourceInfoItemNames = undefined;
            this._metadataLoader = new AsyncLoader(this.forceLoadMetadata.bind(this));
        }
        get typeName() {
            return;
        }
        get loadMetadataResult() {
            return this._metadataLoader.result;
        }
        /**
         * Gets a value indicating whether metadata is currently loading.
         */
        get isLoadingMetadata() {
            return this._metadataLoader.isLoading;
        }
        get isLoading() {
            return (this.isLoadingMetadata ||
                (MappableMixin.isMixedInto(this) && this.isLoadingMapItems) ||
                (ReferenceMixin.isMixedInto(this) && this.isLoadingReference) ||
                (GroupMixin.isMixedInto(this) && this.isLoadingMembers));
        }
        /** Calls AsyncLoader to load metadata. It is safe to call this as often as necessary.
         * If metadata is already loaded or already loading, it will
         * return the existing promise.
         *
         * This returns a Result object, it will contain errors if they occur - they will not be thrown.
         * To throw errors, use `(await loadMetadata()).throwIfError()`
         *
         * {@see AsyncLoader}
         */
        async loadMetadata() {
            return (await this._metadataLoader.load()).clone({
                message: `Failed to load \`${getName(this)}\` metadata`,
                importance: -1
            });
        }
        /**
         * Forces load of the metadata. This method does _not_ need to consider
         * whether the metadata is already loaded.
         *
         * You **can not** make changes to observables until **after** an asynchronous call {@see AsyncLoader}.
         *
         * Errors can be thrown here.
         *
         * {@see AsyncLoader}
         */
        async forceLoadMetadata() { }
        get hasCatalogMemberMixin() {
            return true;
        }
        get inWorkbench() {
            return this.terria.workbench.contains(this);
        }
        get name() {
            return super.name || this.uniqueId;
        }
        get nameInCatalog() {
            return super.nameInCatalog || this.name;
        }
        get nameSortKey() {
            var parts = (this.nameInCatalog || "").split(/(\d+)/);
            return parts.map(function (part) {
                var parsed = parseInt(part, 10);
                if (parsed === parsed) {
                    return parsed;
                }
                else {
                    return part.trim().toLowerCase();
                }
            });
        }
        get hasDescription() {
            return ((isJsonString(this.description) && this.description.length > 0) ||
                (isObservableArray(this.info) &&
                    this.info.some((info) => descriptionRegex.test(info.name || ""))));
        }
        get infoAsObject() {
            const infoObject = {};
            this.info.forEach((infoItem) => {
                if (infoItem.name !== undefined && infoItem.name.length > 0) {
                    const infoNameNoSpaces = infoItem.name.replace(/ /g, "");
                    if (isDefined(infoItem.content) &&
                        !isDefined(infoObject[infoNameNoSpaces])) {
                        infoObject[infoNameNoSpaces] = infoItem.content;
                    }
                    else if (isDefined(infoItem.contentAsObject)) {
                        infoObject[infoNameNoSpaces] = infoItem.contentAsObject;
                    }
                }
            });
            return infoObject;
        }
        get infoWithoutSources() {
            const sourceInfoItemNames = this._sourceInfoItemNames;
            if (sourceInfoItemNames === undefined) {
                return this.info;
            }
            else {
                return this.info.filter((infoItem) => {
                    if (infoItem.name === undefined)
                        return true;
                    return sourceInfoItemNames.indexOf(infoItem.name) === -1;
                });
            }
        }
        /** Converts modelDimensions to selectableDimensions
         * This will apply modelDimension JSON value to user stratum
         */
        get selectableDimensions() {
            var _a;
            return ((_a = this.modelDimensions.map((dim) => ({
                id: dim.id,
                name: dim.name,
                selectedId: dim.selectedId,
                disable: dim.disable,
                allowUndefined: dim.allowUndefined,
                options: dim.options,
                setDimensionValue: (stratumId, selectedId) => {
                    var _a;
                    runInAction(() => dim.setTrait(stratumId, "selectedId", selectedId));
                    const value = (_a = dim.options.find((o) => o.id === selectedId)) === null || _a === void 0 ? void 0 : _a.value;
                    if (isDefined(value)) {
                        const result = updateModelFromJson(this, stratumId, mustacheNestedJsonObject(toJS(value), this));
                        result.raiseError(this.terria, `Failed to update catalog item ${getName(this)}`);
                        // If no error then call loadMapItems
                        if (!result.error && MappableMixin.isMixedInto(this)) {
                            this.loadMapItems().then((loadMapItemsResult) => {
                                loadMapItemsResult.raiseError(this.terria);
                            });
                        }
                    }
                }
            }))) !== null && _a !== void 0 ? _a : []);
        }
        get viewingControls() {
            return [];
        }
        dispose() {
            super.dispose();
            this._metadataLoader.dispose();
        }
    }
    __decorate([
        computed
    ], CatalogMemberMixin.prototype, "isLoading", null);
    __decorate([
        computed
    ], CatalogMemberMixin.prototype, "inWorkbench", null);
    __decorate([
        computed
    ], CatalogMemberMixin.prototype, "name", null);
    __decorate([
        computed
    ], CatalogMemberMixin.prototype, "nameInCatalog", null);
    __decorate([
        computed
    ], CatalogMemberMixin.prototype, "nameSortKey", null);
    __decorate([
        computed
    ], CatalogMemberMixin.prototype, "hasDescription", null);
    __decorate([
        computed
    ], CatalogMemberMixin.prototype, "infoAsObject", null);
    __decorate([
        computed
    ], CatalogMemberMixin.prototype, "infoWithoutSources", null);
    __decorate([
        computed
    ], CatalogMemberMixin.prototype, "selectableDimensions", null);
    __decorate([
        computed
    ], CatalogMemberMixin.prototype, "viewingControls", null);
    return CatalogMemberMixin;
}
const descriptionRegex = /description/i;
(function (CatalogMemberMixin) {
    function isMixedInto(model) {
        return model && model.hasCatalogMemberMixin;
    }
    CatalogMemberMixin.isMixedInto = isMixedInto;
})(CatalogMemberMixin || (CatalogMemberMixin = {}));
export default CatalogMemberMixin;
/** Convenience function to get user readable name of a BaseModel */
export const getName = action((model) => {
    var _a, _b, _c;
    return ((_c = (_b = (_a = (CatalogMemberMixin.isMixedInto(model) ? model.name : undefined)) !== null && _a !== void 0 ? _a : (hasTraits(model, CatalogMemberReferenceTraits, "name")
        ? model.name
        : undefined)) !== null && _b !== void 0 ? _b : model === null || model === void 0 ? void 0 : model.uniqueId) !== null && _c !== void 0 ? _c : "Unknown model");
});
/** Recursively apply mustache template to all nested string properties in a JSON Object */
function mustacheNestedJsonObject(obj, view) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (isJsonString(value)) {
            acc[key] = Mustache.render(value, view);
        }
        else if (isJsonObject(value, false)) {
            acc[key] = mustacheNestedJsonObject(value, view);
        }
        else {
            acc[key] = value;
        }
        return acc;
    }, {});
}
//# sourceMappingURL=CatalogMemberMixin.js.map
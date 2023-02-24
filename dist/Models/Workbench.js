var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, computed, observable } from "mobx";
import filterOutUndefined from "../Core/filterOutUndefined";
import Result from "../Core/Result";
import TerriaError, { TerriaErrorSeverity } from "../Core/TerriaError";
import CatalogMemberMixin, { getName } from "../ModelMixins/CatalogMemberMixin";
import ChartableMixin from "../ModelMixins/ChartableMixin";
import MappableMixin from "../ModelMixins/MappableMixin";
import ReferenceMixin from "../ModelMixins/ReferenceMixin";
import TimeFilterMixin from "../ModelMixins/TimeFilterMixin";
import LayerOrderingTraits from "../Traits/TraitsClasses/LayerOrderingTraits";
import CommonStrata from "./Definition/CommonStrata";
import hasTraits from "./Definition/hasTraits";
const keepOnTop = (model) => hasTraits(model, LayerOrderingTraits, "keepOnTop") && model.keepOnTop;
const supportsReordering = (model) => hasTraits(model, LayerOrderingTraits, "supportsReordering") &&
    model.supportsReordering;
export default class Workbench {
    constructor() {
        this._items = observable.array();
    }
    /**
     * Gets or sets the list of items on the workbench.
     */
    get items() {
        return this._items.map(dereferenceModel);
    }
    set items(items) {
        this._items.spliceWithArray(0, this._items.length, items.slice());
    }
    /**
     * Gets the unique IDs of the items in the workbench.
     */
    get itemIds() {
        return filterOutUndefined(this._items.map((item) => item.uniqueId));
    }
    /**
     * Gets the unique IDs of the items in the workbench.
     */
    get shouldExpandAll() {
        return this._items.every((item) => !item.isOpenInWorkbench);
    }
    /**
     * Checks if the workbench contains time-based WMS
     */
    get hasTimeWMS() {
        return this._items.some((item) => {
            var _a;
            return item.type === "wms" &&
                TimeFilterMixin.isMixedInto(item) && ((_a = item.discreteTimesAsSortedJulianDates) === null || _a === void 0 ? void 0 : _a.length);
        });
    }
    /**
     * Removes a model or its dereferenced equivalent from the workbench.
     * @param item The model.
     */
    remove(item) {
        const index = this.indexOf(item);
        if (index >= 0) {
            this._items.splice(index, 1);
        }
    }
    /**
     * Removes all models from the workbench.
     */
    removeAll() {
        this._items.clear();
    }
    /**
     * Collapses all models from the workbench.
     */
    collapseAll() {
        this._items.map((item) => {
            item.setTrait(CommonStrata.user, "isOpenInWorkbench", false);
        });
    }
    /**
     * Expands all models from the workbench.
     */
    expandAll() {
        this._items.map((item) => {
            item.setTrait(CommonStrata.user, "isOpenInWorkbench", true);
        });
    }
    /**
     * Adds an item to the workbench. If the item is already present, this method does nothing.
     * Note that the model's dereferenced equivalent may appear in the {@link Workbench#items} list
     * rather than the model itself.
     * @param item The model to add.
     */
    insertItem(item, index = 0) {
        if (this.contains(item)) {
            return;
        }
        const targetItem = dereferenceModel(item);
        // Keep reorderable data sources (e.g.: imagery layers) below non-orderable ones (e.g.: GeoJSON).
        if (supportsReordering(targetItem)) {
            while (index < this.items.length &&
                !supportsReordering(this.items[index])) {
                ++index;
            }
        }
        else {
            while (index > 0 &&
                this.items.length > 0 &&
                supportsReordering(this.items[index - 1])) {
                --index;
            }
        }
        if (!keepOnTop(targetItem)) {
            while (index < this.items.length &&
                keepOnTop(this.items[index]) &&
                supportsReordering(this.items[index]) === supportsReordering(targetItem)) {
                ++index;
            }
        }
        else {
            while (index > 0 &&
                this.items.length > 0 &&
                !keepOnTop(this.items[index - 1]) &&
                supportsReordering(this.items[index - 1]) ===
                    supportsReordering(targetItem)) {
                --index;
            }
        }
        // Make sure the reference, rather than the target, is added to the items list.
        const referenceItem = item.sourceReference ? item.sourceReference : item;
        this._items.splice(index, 0, referenceItem);
    }
    /**
     * Adds or removes a model to/from the workbench. If the model is a reference,
     * it will also be dereferenced. If, after dereferencing, the item turns out not to
     * be {@link AsyncMappableMixin} or {@link ChartableMixin} but it is a {@link GroupMixin}, it will
     * be removed from the workbench. If it is mappable, `loadMapItems` will be called.
     *
     * If an error occurs, it will only be added to the workbench if the severity is TerriaError.Warning - otherwise it will not be added
     *
     * @param item The item to add to or remove from the workbench.
     */
    async add(item) {
        if (Array.isArray(item)) {
            const results = await Promise.all(item.reverse().map((i) => this.add(i)));
            return Result.combine(results, {
                title: i18next.t("workbench.addItemErrorTitle"),
                message: i18next.t("workbench.addItemErrorMessage"),
                importance: -1
            });
        }
        this.insertItem(item);
        let error;
        if (ReferenceMixin.isMixedInto(item)) {
            error = (await item.loadReference()).error;
            if (item.target) {
                this.remove(item);
                return this.add(item.target);
            }
        }
        // Add warning message if item isn't mappable or chartable
        if (!error &&
            !MappableMixin.isMixedInto(item) &&
            !ChartableMixin.isMixedInto(item)) {
            error = TerriaError.from(`${getName(item)} doesn't have anything to visualize`, TerriaErrorSeverity.Warning);
        }
        if (!error && CatalogMemberMixin.isMixedInto(item))
            error = (await item.loadMetadata()).error;
        if (!error && MappableMixin.isMixedInto(item)) {
            error = (await item.loadMapItems()).error;
            if (!error && item.zoomOnAddToWorkbench && !item.disableZoomTo) {
                item.terria.currentViewer.zoomTo(item);
            }
        }
        // Remove item if TerriaError severity is Error
        if ((error === null || error === void 0 ? void 0 : error.severity) === TerriaErrorSeverity.Error) {
            this.remove(item);
        }
        return Result.none(error, {
            title: i18next.t("workbench.addItemErrorTitle"),
            message: i18next.t("workbench.addItemErrorMessage"),
            importance: -1
        });
    }
    /**
     * Determines if a given model or its dereferenced equivalent exists in the workbench list.
     * @param item The model.
     * @returns True if the model or its dereferenced equivalent exists on the workbench; otherwise, false.
     */
    contains(item) {
        return this.indexOf(item) >= 0;
    }
    /**
     * Returns the index of a given model or its dereferenced equivalent in the workbench list.
     * @param item The model.
     * @returns The index of the model or its dereferenced equivalent, or -1 if neither exist on the workbench.
     */
    indexOf(item) {
        return this.items.findIndex((model) => model === item || dereferenceModel(model) === dereferenceModel(item));
    }
    /**
     * Used to re-order the workbench list.
     * @param item The model to be moved.
     * @param newIndex The new index to shift the model to.
     */
    moveItemToIndex(item, newIndex) {
        if (!this.contains(item)) {
            return;
        }
        this.remove(item);
        this.insertItem(item, newIndex);
    }
}
__decorate([
    computed
], Workbench.prototype, "items", null);
__decorate([
    computed
], Workbench.prototype, "itemIds", null);
__decorate([
    computed
], Workbench.prototype, "shouldExpandAll", null);
__decorate([
    computed
], Workbench.prototype, "hasTimeWMS", null);
__decorate([
    action
], Workbench.prototype, "remove", null);
__decorate([
    action
], Workbench.prototype, "removeAll", null);
__decorate([
    action
], Workbench.prototype, "collapseAll", null);
__decorate([
    action
], Workbench.prototype, "expandAll", null);
__decorate([
    action
], Workbench.prototype, "insertItem", null);
__decorate([
    action
], Workbench.prototype, "moveItemToIndex", null);
function dereferenceModel(model) {
    if (ReferenceMixin.isMixedInto(model) && model.target !== undefined) {
        return model.target;
    }
    return model;
}
//# sourceMappingURL=Workbench.js.map
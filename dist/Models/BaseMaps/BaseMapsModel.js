var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed } from "mobx";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import isDefined from "../../Core/isDefined";
import Result from "../../Core/Result";
import TerriaError from "../../Core/TerriaError";
import ModelReference from "../../Traits/ModelReference";
import { BaseMapsTraits, BaseMapTraits } from "../../Traits/TraitsClasses/BaseMapTraits";
import BingMapsCatalogItem from "../Catalog/CatalogItems/BingMapsCatalogItem";
import CommonStrata from "../Definition/CommonStrata";
import CreateModel from "../Definition/CreateModel";
import { BaseModel } from "../Definition/Model";
import updateModelFromJson from "../Definition/updateModelFromJson";
import filterOutUndefined from "./../../Core/filterOutUndefined";
import { defaultBaseMaps } from "./defaultBaseMaps";
export class BaseMapModel extends CreateModel(BaseMapTraits) {
}
export class BaseMapsModel extends CreateModel(BaseMapsTraits) {
    /**
     * List of the basemaps to show in setting panel
     */
    get baseMapItems() {
        return filterOutUndefined(this.filterBaseMapItems().map(({ item, image, contrastColor }) => !item || ModelReference.isRemoved(item)
            ? undefined
            : {
                image,
                contrastColor,
                item: this.terria.getModelById(BaseModel, item)
            }));
    }
    filterBaseMapItems() {
        const items = this.items;
        const baseMaps = [];
        if (!this.enabledBaseMaps) {
            return this.items;
        }
        for (const id of this.enabledBaseMaps) {
            const baseMap = items === null || items === void 0 ? void 0 : items.find(baseMap => baseMap.item === id);
            if ((baseMap === null || baseMap === void 0 ? void 0 : baseMap.item) && !ModelReference.isRemoved(baseMap.item)) {
                baseMaps.push(baseMap);
            }
        }
        return baseMaps;
    }
    // Can't do this in constructor since {@link CatalogMemberFactory} doesn't
    // have any values at the moment of initializing Terria class.
    initializeDefaultBaseMaps() {
        return this.loadFromJson(CommonStrata.definition, {
            items: defaultBaseMaps(this.terria)
        });
    }
    add(stratumId, baseMap) {
        if (baseMap.item === undefined) {
            throw new DeveloperError("A model without a `uniqueId` cannot be added to a group.");
        }
        const resolvedItem = this.terria.getModelById(BaseModel, baseMap.item);
        if (resolvedItem instanceof BingMapsCatalogItem) {
            addBingMapsKey(resolvedItem, this.terria);
        }
        const items = this.getTrait(stratumId, "items");
        if (isDefined(items)) {
            items.push(baseMap);
        }
        else {
            this.setTrait(stratumId, "items", [baseMap]);
        }
    }
    loadFromJson(stratumId, newBaseMaps) {
        var _a;
        const errors = [];
        const { items, ...rest } = newBaseMaps;
        if (items !== undefined) {
            const { items: itemsTrait } = this.traits;
            const newItemsIds = itemsTrait.fromJson(this, stratumId, items);
            (_a = newItemsIds.pushErrorTo(errors)) === null || _a === void 0 ? void 0 : _a.forEach((member) => {
                const existingItem = this.items.find(baseMap => baseMap.item === member.item);
                if (existingItem) {
                    // object array trait doesn't automatically update model item
                    existingItem.setTrait(stratumId, "image", member.image);
                }
                else {
                    this.add(stratumId, member);
                }
            });
        }
        updateModelFromJson(this, stratumId, rest).pushErrorTo(errors);
        return new Result(undefined, TerriaError.combine(errors, `Failed to add members from JSON for model \`${this.uniqueId}\``));
    }
}
__decorate([
    computed
], BaseMapsModel.prototype, "baseMapItems", null);
__decorate([
    action
], BaseMapsModel.prototype, "add", null);
__decorate([
    action
], BaseMapsModel.prototype, "loadFromJson", null);
function addBingMapsKey(item, terria) {
    if (!item.key) {
        item.setTrait(CommonStrata.defaults, "key", terria.configParameters.bingMapsKey);
    }
}
//# sourceMappingURL=BaseMapsModel.js.map
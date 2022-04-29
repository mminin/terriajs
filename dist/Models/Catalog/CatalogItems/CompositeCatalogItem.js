var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { action, autorun, computed, runInAction } from "mobx";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import filterOutUndefined from "../../../Core/filterOutUndefined";
import isDefined from "../../../Core/isDefined";
import Result from "../../../Core/Result";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import ModelReference from "../../../Traits/ModelReference";
import CompositeCatalogItemTraits from "../../../Traits/TraitsClasses/CompositeCatalogItemTraits";
import CommonStrata from "../../Definition/CommonStrata";
import CreateModel from "../../Definition/CreateModel";
import { BaseModel } from "../../Definition/Model";
export default class CompositeCatalogItem extends MappableMixin(CatalogMemberMixin(CreateModel(CompositeCatalogItemTraits))) {
    constructor() {
        super(...arguments);
        this._visibilityDisposer = autorun(() => {
            this.syncVisibilityToMembers();
        });
    }
    get type() {
        return CompositeCatalogItem.type;
    }
    get typeName() {
        return i18next.t("models.composite.name");
    }
    get memberModels() {
        const members = this.members;
        if (members === undefined) {
            return [];
        }
        return filterOutUndefined(members.map(id => ModelReference.isRemoved(id)
            ? undefined
            : this.terria.getModelById(BaseModel, id)));
    }
    async forceLoadMetadata() {
        const members = this.memberModels.filter(CatalogMemberMixin.isMixedInto);
        // Avoid calling loadX functions in a computed context
        await Promise.resolve();
        Result.combine(await Promise.all(members.map(async (model) => await model.loadMetadata())), "Failed to load composite catalog items metadata").throwIfError();
    }
    async forceLoadMapItems() {
        const members = this.memberModels.filter(MappableMixin.isMixedInto);
        // Avoid calling loadX functions in a computed context
        await Promise.resolve();
        Result.combine(await Promise.all(members.map(model => model.loadMapItems())), "Failed to load composite catalog items mapItems").throwIfError();
    }
    syncVisibilityToMembers() {
        const { show } = this;
        this.memberModels.forEach(model => {
            runInAction(() => {
                model.setTrait(CommonStrata.underride, "show", show);
            });
        });
    }
    get mapItems() {
        const result = [];
        this.memberModels.filter(MappableMixin.isMixedInto).forEach(model => {
            result.push(...model.mapItems);
        });
        return result;
    }
    add(stratumId, member) {
        if (member.uniqueId === undefined) {
            throw new DeveloperError("A model without a `uniqueId` cannot be added to a composite.");
        }
        if (!isDefined(this.terria.getModelById(BaseModel, member.uniqueId))) {
            this.terria.addModel(member);
        }
        const members = this.getTrait(stratumId, "members");
        if (isDefined(members)) {
            members.push(member.uniqueId);
        }
        else {
            this.setTrait(stratumId, "members", [member.uniqueId]);
        }
    }
    dispose() {
        super.dispose();
        this._visibilityDisposer();
    }
}
CompositeCatalogItem.type = "composite";
__decorate([
    computed
], CompositeCatalogItem.prototype, "memberModels", null);
__decorate([
    computed
], CompositeCatalogItem.prototype, "mapItems", null);
__decorate([
    action
], CompositeCatalogItem.prototype, "add", null);
//# sourceMappingURL=CompositeCatalogItem.js.map
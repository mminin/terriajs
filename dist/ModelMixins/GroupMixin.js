var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { uniq } from "lodash-es";
import { action, computed, runInAction } from "mobx";
import clone from "terriajs-cesium/Source/Core/clone";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import AsyncLoader from "../Core/AsyncLoader";
import filterOutUndefined from "../Core/filterOutUndefined";
import flatten from "../Core/flatten";
import isDefined from "../Core/isDefined";
import { isJsonNumber, isJsonString } from "../Core/Json";
import Result from "../Core/Result";
import CatalogMemberFactory from "../Models/Catalog/CatalogMemberFactory";
import CommonStrata from "../Models/Definition/CommonStrata";
import hasTraits from "../Models/Definition/hasTraits";
import { BaseModel } from "../Models/Definition/Model";
import ModelReference from "../Traits/ModelReference";
import { ItemPropertiesTraits } from "../Traits/TraitsClasses/ItemPropertiesTraits";
import CatalogMemberMixin, { getName } from "./CatalogMemberMixin";
import ReferenceMixin from "./ReferenceMixin";
const naturalSort = require("javascript-natural-sort");
naturalSort.insensitive = true;
const MERGED_GROUP_ID_PREPEND = "__merged__";
function GroupMixin(Base) {
    class Klass extends Base {
        constructor() {
            super(...arguments);
            this._memberLoader = new AsyncLoader(this.forceLoadMembers.bind(this));
        }
        get isGroup() {
            return true;
        }
        /**
         * Gets a value indicating whether the set of members is currently loading.
         */
        get isLoadingMembers() {
            return this._memberLoader.isLoading;
        }
        get loadMembersResult() {
            return this._memberLoader.result;
        }
        /** Get merged excludeMembers from all parent groups. This will go through all knownContainerUniqueIds and merge all excludeMembers arrays */
        get mergedExcludeMembers() {
            var _a;
            const blacklistSet = new Set((_a = this.excludeMembers) !== null && _a !== void 0 ? _a : []);
            this.knownContainerUniqueIds.forEach((containerId) => {
                const container = this.terria.getModelById(BaseModel, containerId);
                if (container && GroupMixin.isMixedInto(container)) {
                    container.mergedExcludeMembers.forEach((s) => blacklistSet.add(s));
                }
            });
            return Array.from(blacklistSet);
        }
        get memberModels() {
            const members = this.members;
            if (members === undefined) {
                return [];
            }
            const models = filterOutUndefined(members.map((id) => {
                if (!ModelReference.isRemoved(id)) {
                    const model = this.terria.getModelById(BaseModel, id);
                    if (this.mergedExcludeMembers.length == 0) {
                        return model;
                    }
                    // Get model name and apply excludeMembers
                    const modelName = CatalogMemberMixin.isMixedInto(model)
                        ? model.name
                        : undefined;
                    if (model &&
                        // Does excludeMembers not include model ID
                        !this.mergedExcludeMembers.find((name) => {
                            var _a;
                            return ((_a = model.uniqueId) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) ===
                                name.toLowerCase().trim();
                        }) &&
                        // Does excludeMembers not include model name
                        (!modelName ||
                            !this.mergedExcludeMembers.find((name) => modelName.toLowerCase().trim() === name.toLowerCase().trim())))
                        return model;
                }
            }));
            // Sort members if necessary
            // Check if trait "this.sortMembersBy" exists and is a string or number
            // If not, then the model will be placed at the end of the array
            if (isDefined(this.sortMembersBy)) {
                return models.sort((a, b) => {
                    const aValue = getSortProperty(a, this.sortMembersBy);
                    const bValue = getSortProperty(b, this.sortMembersBy);
                    return naturalSort(isJsonString(aValue) || isJsonNumber(aValue) ? aValue : Infinity, isJsonString(bValue) || isJsonNumber(bValue) ? bValue : Infinity);
                });
            }
            return models;
        }
        /**
         * Load the group members if necessary. Returns an existing promise
         * if the members are already loaded or if loading is already in progress,
         * so it is safe and performant to call this function as often as
         * necessary. When the promise returned by this function resolves, the
         * list of members in `GroupMixin#members` and `GroupMixin#memberModels`
         * should be complete, but the individual members will not necessarily be
         * loaded themselves.
         *
         * This returns a Result object, it will contain errors if they occur - they will not be thrown.
         * To throw errors, use `(await loadMetadata()).throwIfError()`
         *
         * {@see AsyncLoader}
         */
        async loadMembers() {
            try {
                // Call loadMetadata if CatalogMemberMixin
                if (CatalogMemberMixin.isMixedInto(this))
                    (await this.loadMetadata()).throwIfError();
                // Call Group AsyncLoader if no errors occurred while loading metadata
                (await this._memberLoader.load()).throwIfError();
                // Order here is important, as mergeGroupMembersByName will create models and the following functions will be applied on memberModels
                this.mergeGroupMembersByName();
                this.refreshKnownContainerUniqueIds(this.uniqueId);
                this.addShareKeysToMembers();
                this.addItemPropertiesToMembers();
            }
            catch (e) {
                return Result.error(e, `Failed to load group \`${getName(this)}\``);
            }
            return Result.none();
        }
        toggleOpen(stratumId) {
            this.setTrait(stratumId, "isOpen", !this.isOpen);
        }
        /** "Merges" group members with the same name if `mergeGroupsByName` Trait is set to `true`
         * It does this by:
         * - Creating a new CatalogGroup with all members of each merged group
         * - Appending merged group ids to `excludeMembers`
         * This is only applied to the first level of group members (it is not recursive)
         * `mergeGroupsByName` is not applied to nested groups automatically.
         */
        mergeGroupMembersByName() {
            if (!this.mergeGroupsByName)
                return;
            // Create map of group names to group models
            const membersByName = new Map();
            this.memberModels.forEach((member) => {
                var _a, _b;
                if (GroupMixin.isMixedInto(member) &&
                    CatalogMemberMixin.isMixedInto(member) &&
                    member.name) {
                    // Push member to map
                    (_b = (_a = membersByName.get(member.name)) === null || _a === void 0 ? void 0 : _a.push(member)) !== null && _b !== void 0 ? _b : membersByName.set(member.name, [member]);
                }
            });
            membersByName.forEach((groups, name) => {
                var _a;
                if (groups.length > 1) {
                    const groupIdsToMerge = groups
                        .map((g) => g.uniqueId)
                        .filter(isJsonString);
                    const mergedGroupId = `${this.uniqueId}/${MERGED_GROUP_ID_PREPEND}${name}`;
                    let mergedGroup = this.terria.getModelById(BaseModel, mergedGroupId);
                    // Create mergedGroup if it doesn't exist - and then add it to group.members
                    if (!mergedGroup) {
                        mergedGroup = CatalogMemberFactory.create("group", mergedGroupId, this.terria);
                        if (mergedGroup) {
                            // We add groupIdsToMerge as shareKeys here for backward compatibility
                            this.terria.addModel(mergedGroup, groupIdsToMerge);
                            this.add(CommonStrata.override, mergedGroup);
                        }
                    }
                    // Set merged group traits - name and members
                    // Also set excludeMembers to exclude all groups that are merged.
                    if (GroupMixin.isMixedInto(mergedGroup) &&
                        CatalogMemberMixin.isMixedInto(mergedGroup)) {
                        mergedGroup.setTrait(CommonStrata.definition, "name", name);
                        mergedGroup.setTrait(CommonStrata.definition, "members", flatten(groups.map((g) => [...g.members])));
                        this.setTrait(CommonStrata.override, "excludeMembers", uniq([...((_a = this.excludeMembers) !== null && _a !== void 0 ? _a : []), ...groupIdsToMerge]));
                    }
                }
            });
        }
        refreshKnownContainerUniqueIds(uniqueId) {
            if (!uniqueId)
                return;
            this.memberModels.forEach((model) => {
                if (model.knownContainerUniqueIds.indexOf(uniqueId) < 0) {
                    model.knownContainerUniqueIds.push(uniqueId);
                }
            });
        }
        addItemPropertiesToMembers() {
            this.memberModels.forEach((model) => {
                applyItemProperties(this, model);
            });
        }
        addShareKeysToMembers(members = this.memberModels) {
            const groupId = this.uniqueId;
            if (!groupId)
                return;
            // Get shareKeys for this Group
            const shareKeys = this.terria.modelIdShareKeysMap.get(groupId);
            if (!shareKeys || shareKeys.length === 0)
                return;
            /**
             * Go through each shareKey and create new shareKeys for members
             * - Look at current member.uniqueId
             * - Replace instances of group.uniqueID in member.uniqueId with shareKey
             * For example:
             * - group.uniqueId = 'some-group-id'
             * - member.uniqueId = 'some-group-id/some-member-id'
             * - group.shareKeys = 'old-group-id'
             * - So we want to create member.shareKeys = ["old-group-id/some-member-id"]
             *
             * We also repeat this process for each shareKey for each member
             */
            members.forEach((model) => {
                // Only add shareKey if model.uniqueId is an autoID (i.e. contains groupId)
                if (isDefined(model.uniqueId) && model.uniqueId.includes(groupId)) {
                    shareKeys.forEach((groupShareKey) => {
                        // Get shareKeys for current model
                        const modelShareKeys = this.terria.modelIdShareKeysMap.get(model.uniqueId);
                        modelShareKeys === null || modelShareKeys === void 0 ? void 0 : modelShareKeys.forEach((modelShareKey) => {
                            this.terria.addShareKey(model.uniqueId, modelShareKey.replace(groupId, groupShareKey));
                        });
                        this.terria.addShareKey(model.uniqueId, model.uniqueId.replace(groupId, groupShareKey));
                    });
                    // If member is a Group -> apply shareKeys to the next level of members
                    if (GroupMixin.isMixedInto(model)) {
                        this.addShareKeysToMembers(model.memberModels);
                    }
                }
            });
        }
        add(stratumId, member) {
            if (member.uniqueId === undefined) {
                throw new DeveloperError("A model without a `uniqueId` cannot be added to a group.");
            }
            const members = this.getTrait(stratumId, "members");
            if (isDefined(members)) {
                members.push(member.uniqueId);
            }
            else {
                this.setTrait(stratumId, "members", [member.uniqueId]);
            }
            if (this.uniqueId !== undefined &&
                member.knownContainerUniqueIds.indexOf(this.uniqueId) < 0) {
                member.knownContainerUniqueIds.push(this.uniqueId);
            }
        }
        addMembersFromJson(stratumId, members) {
            var _a;
            const newMemberIds = this.traits["members"].fromJson(this, stratumId, members);
            (_a = newMemberIds
                .ignoreError()) === null || _a === void 0 ? void 0 : _a.map((memberId) => this.terria.getModelById(BaseModel, memberId)).forEach((member) => {
                this.add(stratumId, member);
            });
            if (newMemberIds.error)
                return Result.error(newMemberIds.error, `Failed to add members from JSON for model \`${this.uniqueId}\``);
            return Result.none();
        }
        /**
         * Used to re-order catalog members
         *
         * @param stratumId name of the stratum to update
         * @param member the member to be moved
         * @param newIndex the new index to shift the member to
         *
         * @returns true if the member was moved to the new index successfully
         */
        moveMemberToIndex(stratumId, member, newIndex) {
            if (member.uniqueId === undefined) {
                throw new DeveloperError("Cannot reorder a model without a `uniqueId`.");
            }
            const members = this.members;
            const moveFrom = members.indexOf(member.uniqueId);
            if (members[newIndex] === undefined) {
                throw new DeveloperError(`Invalid 'newIndex' target: ${newIndex}`);
            }
            if (moveFrom === -1) {
                throw new DeveloperError(`A model couldn't be found in the group ${this.uniqueId} for member uniqueId ${member.uniqueId}`);
            }
            const cloneArr = clone(members);
            // shift a current member to the new index
            cloneArr.splice(newIndex, 0, cloneArr.splice(moveFrom, 1)[0]);
            this.setTrait(stratumId, "members", cloneArr);
            return true;
        }
        remove(stratumId, member) {
            if (member.uniqueId === undefined) {
                return;
            }
            const members = this.getTrait(stratumId, "members");
            if (isDefined(members)) {
                const index = members.indexOf(member.uniqueId);
                if (index !== -1) {
                    members.splice(index, 1);
                }
            }
        }
        dispose() {
            super.dispose();
            this._memberLoader.dispose();
        }
    }
    __decorate([
        computed
    ], Klass.prototype, "mergedExcludeMembers", null);
    __decorate([
        computed
    ], Klass.prototype, "memberModels", null);
    __decorate([
        action
    ], Klass.prototype, "toggleOpen", null);
    __decorate([
        action
    ], Klass.prototype, "mergeGroupMembersByName", null);
    __decorate([
        action
    ], Klass.prototype, "refreshKnownContainerUniqueIds", null);
    __decorate([
        action
    ], Klass.prototype, "addItemPropertiesToMembers", null);
    __decorate([
        action
    ], Klass.prototype, "addShareKeysToMembers", null);
    __decorate([
        action
    ], Klass.prototype, "add", null);
    __decorate([
        action
    ], Klass.prototype, "addMembersFromJson", null);
    __decorate([
        action
    ], Klass.prototype, "moveMemberToIndex", null);
    __decorate([
        action
    ], Klass.prototype, "remove", null);
    return Klass;
}
(function (GroupMixin) {
    function isMixedInto(model) {
        return (model &&
            "isGroup" in model &&
            model.isGroup &&
            "forceLoadMembers" in model &&
            typeof model.forceLoadMembers === "function");
    }
    GroupMixin.isMixedInto = isMixedInto;
})(GroupMixin || (GroupMixin = {}));
export default GroupMixin;
function getSortProperty(model, prop) {
    return (CatalogMemberMixin.isMixedInto(model) &&
        hasTraits(model, model.TraitsClass, prop)) ||
        (GroupMixin.isMixedInto(model) &&
            hasTraits(model, model.TraitsClass, prop)) ||
        (ReferenceMixin.isMixedInto(model) &&
            hasTraits(model, model.TraitsClass, prop))
        ? model[prop]
        : undefined;
}
function setItemPropertyTraits(model, itemProperties) {
    if (!itemProperties)
        return;
    Object.keys(itemProperties).map((k) => model.setTrait(CommonStrata.override, k, itemProperties[k]));
}
/** Applies itemProperties object to a model - this will set traits in override stratum.
 * Also copy ItemPropertiesTraits to target if it supports them
 */
export function applyItemProperties(model, target) {
    runInAction(() => {
        var _a;
        if (!target.uniqueId)
            return;
        // Apply itemProperties to non GroupMixin targets
        if (!GroupMixin.isMixedInto(target))
            setItemPropertyTraits(target, model.itemProperties);
        // Apply itemPropertiesByType
        setItemPropertyTraits(target, (_a = model.itemPropertiesByType.find((itemProps) => itemProps.type && itemProps.type === target.type)) === null || _a === void 0 ? void 0 : _a.itemProperties);
        // Apply itemPropertiesByIds
        model.itemPropertiesByIds.forEach((itemPropsById) => {
            if (itemPropsById.ids.includes(target.uniqueId)) {
                setItemPropertyTraits(target, itemPropsById.itemProperties);
            }
        });
        // Copy over ItemPropertiesTraits from model, if target has them
        // For example GroupMixin and ReferenceMixin
        if (hasTraits(target, ItemPropertiesTraits, "itemProperties"))
            target.setTrait(CommonStrata.underride, "itemProperties", model.traits.itemProperties.toJson(model.itemProperties));
        if (hasTraits(target, ItemPropertiesTraits, "itemPropertiesByType"))
            target.setTrait(CommonStrata.underride, "itemPropertiesByType", model.traits.itemPropertiesByType.toJson(model.itemPropertiesByType));
        if (hasTraits(target, ItemPropertiesTraits, "itemPropertiesByIds"))
            target.setTrait(CommonStrata.underride, "itemPropertiesByIds", model.traits.itemPropertiesByIds.toJson(model.itemPropertiesByIds));
    });
}
//# sourceMappingURL=GroupMixin.js.map
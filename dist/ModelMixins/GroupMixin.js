var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed } from "mobx";
import clone from "terriajs-cesium/Source/Core/clone";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import AsyncLoader from "../Core/AsyncLoader";
import filterOutUndefined from "../Core/filterOutUndefined";
import isDefined from "../Core/isDefined";
import { isJsonNumber, isJsonString } from "../Core/Json";
import Result from "../Core/Result";
import hasTraits from "../Models/Definition/hasTraits";
import { BaseModel } from "../Models/Definition/Model";
import ModelReference from "../Traits/ModelReference";
import CatalogMemberMixin, { getName } from "./CatalogMemberMixin";
const naturalSort = require("javascript-natural-sort");
naturalSort.insensitive = true;
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
            this.knownContainerUniqueIds.forEach(containerId => {
                const container = this.terria.getModelById(BaseModel, containerId);
                if (container && GroupMixin.isMixedInto(container)) {
                    container.mergedExcludeMembers.forEach(s => blacklistSet.add(s));
                }
            });
            return Array.from(blacklistSet);
        }
        get memberModels() {
            const members = this.members;
            if (members === undefined) {
                return [];
            }
            const models = filterOutUndefined(members.map(id => {
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
                        !this.mergedExcludeMembers.find(name => {
                            var _a;
                            return ((_a = model.uniqueId) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) ===
                                name.toLowerCase().trim();
                        }) &&
                        // Does excludeMembers not include model name
                        (!modelName ||
                            !this.mergedExcludeMembers.find(name => modelName.toLowerCase().trim() === name.toLowerCase().trim())))
                        return model;
                }
            }));
            // Sort members if necessary
            // Check if trait "this.sortMembersBy" exists and is a string or number
            // If not, then the model will be placed at the end of the array
            if (isDefined(this.sortMembersBy)) {
                return models.sort((a, b) => {
                    const aValue = CatalogMemberMixin.isMixedInto(a) &&
                        hasTraits(a, a.TraitsClass, this.sortMembersBy)
                        ? a[this.sortMembersBy]
                        : Infinity;
                    const bValue = CatalogMemberMixin.isMixedInto(b) &&
                        hasTraits(b, b.TraitsClass, this.sortMembersBy)
                        ? b[this.sortMembersBy]
                        : Infinity;
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
                this.refreshKnownContainerUniqueIds(this.uniqueId);
                this.addShareKeysToMembers();
            }
            catch (e) {
                return Result.error(e, `Failed to load group \`${getName(this)}\``);
            }
            return Result.none();
        }
        toggleOpen(stratumId) {
            this.setTrait(stratumId, "isOpen", !this.isOpen);
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
                    shareKeys.forEach(groupShareKey => {
                        // Get shareKeys for current model
                        const modelShareKeys = this.terria.modelIdShareKeysMap.get(model.uniqueId);
                        modelShareKeys === null || modelShareKeys === void 0 ? void 0 : modelShareKeys.forEach(modelShareKey => {
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
    ], Klass.prototype, "refreshKnownContainerUniqueIds", null);
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
//# sourceMappingURL=GroupMixin.js.map
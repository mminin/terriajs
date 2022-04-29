var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable } from "mobx";
import { BaseModel } from "../Models/Definition/Model";
function AccessControlMixin(Base) {
    class Klass extends Base {
        get hasAccessControlMixin() {
            return true;
        }
        /**
         * Returns the accessType for this model, default is public
         * Models can override this method to return access type differently
         */
        get accessType() {
            if (this._accessType)
                return this._accessType;
            if (AccessControlMixin.isMixedInto(this.sourceReference)) {
                // This item is the target of a reference item, return the accessType
                // of the reference item.
                return this.sourceReference.accessType;
            }
            // Try and return the parents accessType
            if (this.knownContainerUniqueIds.length > 0) {
                const parentId = this.knownContainerUniqueIds[0];
                const parent = parentId && this.terria.getModelById(BaseModel, parentId);
                if (AccessControlMixin.isMixedInto(parent)) {
                    return parent.accessType;
                }
            }
            // default
            return "public";
        }
        /* TODO: check if we actually need provision to explcitly set accessType */
        setAccessType(accessType) {
            this._accessType = accessType;
        }
        get isPublic() {
            return this.accessType === "public";
        }
        get isPrivate() {
            return this.accessType !== "public";
        }
    }
    __decorate([
        observable
    ], Klass.prototype, "_accessType", void 0);
    __decorate([
        computed
    ], Klass.prototype, "accessType", null);
    __decorate([
        action
    ], Klass.prototype, "setAccessType", null);
    __decorate([
        computed
    ], Klass.prototype, "isPublic", null);
    __decorate([
        computed
    ], Klass.prototype, "isPrivate", null);
    return Klass;
}
(function (AccessControlMixin) {
    function isMixedInto(model) {
        return model && model.hasAccessControlMixin;
    }
    AccessControlMixin.isMixedInto = isMixedInto;
})(AccessControlMixin || (AccessControlMixin = {}));
export default AccessControlMixin;
//# sourceMappingURL=AccessControlMixin.js.map
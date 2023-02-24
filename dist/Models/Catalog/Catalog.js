var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { autorun, observable } from "mobx";
import { USER_ADDED_CATEGORY_ID } from "../../Core/addedByUser";
import CatalogGroup from "./CatalogGroup";
import CommonStrata from "../Definition/CommonStrata";
import { BaseModel } from "../Definition/Model";
import isDefined from "../../Core/isDefined";
export default class Catalog {
    constructor(terria) {
        this.terria = terria;
        this.group = new CatalogGroup("/", this.terria);
        this.terria.addModel(this.group);
        this._disposeCreateUserAddedGroup = autorun(() => {
            // Make sure the catalog has a user added data group even if its
            // group or group members are reset.
            if (!this.group.memberModels.find((m) => m.uniqueId === USER_ADDED_CATEGORY_ID)) {
                let userAddedDataGroup = this.terria.getModelById(BaseModel, USER_ADDED_CATEGORY_ID);
                if (!isDefined(userAddedDataGroup)) {
                    userAddedDataGroup = new CatalogGroup(USER_ADDED_CATEGORY_ID, this.terria);
                    const userAddedGroupName = i18next.t("core.userAddedData");
                    userAddedDataGroup.setTrait(CommonStrata.definition, "name", userAddedGroupName);
                    const userAddedGroupDescription = i18next.t("models.catalog.userAddedDataGroup");
                    userAddedDataGroup.setTrait(CommonStrata.definition, "description", userAddedGroupDescription);
                    this.terria.addModel(userAddedDataGroup);
                }
                this.group.add(CommonStrata.definition, userAddedDataGroup);
            }
        });
    }
    destroy() {
        this._disposeCreateUserAddedGroup();
    }
    get userAddedDataGroup() {
        const group = this.group.memberModels.find((m) => m.uniqueId === USER_ADDED_CATEGORY_ID);
        return group;
    }
}
__decorate([
    observable
], Catalog.prototype, "group", void 0);
//# sourceMappingURL=Catalog.js.map
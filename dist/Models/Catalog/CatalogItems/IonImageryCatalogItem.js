var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import IonImageryProvider from "terriajs-cesium/Source/Scene/IonImageryProvider";
import isDefined from "../../../Core/isDefined";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../../../ModelMixins/MappableMixin";
import IonImageryCatalogItemTraits from "../../../Traits/TraitsClasses/IonImageryCatalogItemTraits";
import CreateModel from "../../Definition/CreateModel";
export default class IonImageryCatalogItem extends MappableMixin(CatalogMemberMixin(CreateModel(IonImageryCatalogItemTraits))) {
    get type() {
        return IonImageryCatalogItem.type;
    }
    forceLoadMapItems() {
        return Promise.resolve();
    }
    get mapItems() {
        if (!isDefined(this.imageryProvider)) {
            return [];
        }
        return [
            {
                show: this.show,
                alpha: this.opacity,
                imageryProvider: this.imageryProvider,
                clippingRectangle: this.clipToRectangle
                    ? this.cesiumRectangle
                    : undefined
            }
        ];
    }
    get imageryProvider() {
        if (isDefined(this.ionAssetId)) {
            const provider = new IonImageryProvider({
                assetId: this.ionAssetId,
                accessToken: this.ionAccessToken ||
                    this.terria.configParameters.cesiumIonAccessToken,
                server: this.ionServer
            });
            if (this.attribution) {
                provider._credit = this.attribution;
            }
            return provider;
        }
    }
}
IonImageryCatalogItem.type = "ion-imagery";
__decorate([
    computed
], IonImageryCatalogItem.prototype, "mapItems", null);
__decorate([
    computed
], IonImageryCatalogItem.prototype, "imageryProvider", null);
//# sourceMappingURL=IonImageryCatalogItem.js.map
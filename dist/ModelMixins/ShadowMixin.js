var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, runInAction } from "mobx";
import ShadowMode from "terriajs-cesium/Source/Scene/ShadowMode";
import i18next from "i18next";
function ShadowMixin(Base) {
    class ShadowMixin extends Base {
        get hasShadows() {
            return true;
        }
        get cesiumShadows() {
            switch (this.shadows.toLowerCase()) {
                case "none":
                    return ShadowMode.DISABLED;
                case "both":
                    return ShadowMode.ENABLED;
                case "cast":
                    return ShadowMode.CAST_ONLY;
                case "receive":
                    return ShadowMode.RECEIVE_ONLY;
                default:
                    return ShadowMode.DISABLED;
            }
        }
        /** Shadow SelectableDimension. This has to be added to a catalog member's `selectableDimension` array */
        get shadowDimension() {
            return {
                id: "shadows",
                name: i18next.t("models.shadow.name"),
                options: [
                    { id: "NONE", name: i18next.t("models.shadow.options.none") },
                    { id: "CAST", name: i18next.t("models.shadow.options.cast") },
                    { id: "RECEIVE", name: i18next.t("models.shadow.options.receive") },
                    { id: "BOTH", name: i18next.t("models.shadow.options.both") }
                ],
                selectedId: this.shadows,
                disable: !this.showShadowUi,
                setDimensionValue: (strata, shadow) => runInAction(() => this.setTrait(strata, "shadows", shadow))
            };
        }
    }
    __decorate([
        computed
    ], ShadowMixin.prototype, "cesiumShadows", null);
    __decorate([
        computed
    ], ShadowMixin.prototype, "shadowDimension", null);
    return ShadowMixin;
}
(function (ShadowMixin) {
    function isMixedInto(model) {
        return model && model.hasShadows;
    }
    ShadowMixin.isMixedInto = isMixedInto;
})(ShadowMixin || (ShadowMixin = {}));
export default ShadowMixin;
//# sourceMappingURL=ShadowMixin.js.map
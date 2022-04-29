var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import createStratumInstance from "../Models/Definition/createStratumInstance";
import LoadableStratum from "../Models/Definition/LoadableStratum";
import StratumOrder from "../Models/Definition/StratumOrder";
import DiffableTraits from "../Traits/TraitsClasses/DiffableTraits";
import LegendTraits from "../Traits/TraitsClasses/LegendTraits";
import TimeFilterMixin from "./TimeFilterMixin";
class DiffStratum extends LoadableStratum(DiffableTraits) {
    constructor(catalogItem) {
        super();
        this.catalogItem = catalogItem;
    }
    duplicateLoadableStratum(model) {
        return new DiffStratum(model);
    }
    get legends() {
        if (this.catalogItem.isShowingDiff && this.diffLegendUrl) {
            const urlMimeType = new URL(this.diffLegendUrl).searchParams.get("format") || undefined;
            return [
                createStratumInstance(LegendTraits, {
                    url: this.diffLegendUrl,
                    urlMimeType
                })
            ];
        }
        return undefined;
    }
    get diffLegendUrl() {
        const diffStyleId = this.catalogItem.diffStyleId;
        const firstDate = this.catalogItem.firstDiffDate;
        const secondDate = this.catalogItem.secondDiffDate;
        if (diffStyleId && firstDate && secondDate) {
            return this.catalogItem.getLegendUrlForStyle(diffStyleId, JulianDate.fromIso8601(firstDate), JulianDate.fromIso8601(secondDate));
        }
        return undefined;
    }
    get disableDateTimeSelector() {
        return this.catalogItem.isShowingDiff;
    }
}
DiffStratum.stratumName = "diffStratum";
__decorate([
    computed
], DiffStratum.prototype, "legends", null);
__decorate([
    computed
], DiffStratum.prototype, "diffLegendUrl", null);
__decorate([
    computed
], DiffStratum.prototype, "disableDateTimeSelector", null);
function DiffableMixin(Base) {
    class DiffableMixin extends TimeFilterMixin(Base) {
        constructor(...args) {
            super(...args);
            const diffStratum = new DiffStratum(this);
            this.strata.set(DiffStratum.stratumName, diffStratum);
        }
        get hasDiffableMixin() {
            return true;
        }
        get canFilterTimeByFeature() {
            // Hides the SatelliteImageryTimeFilterSection for the item if it is
            // currently showing difference image
            return super.canFilterTimeByFeature && !this.isShowingDiff;
        }
    }
    __decorate([
        computed
    ], DiffableMixin.prototype, "canFilterTimeByFeature", null);
    return DiffableMixin;
}
(function (DiffableMixin) {
    function isMixedInto(model) {
        return model === null || model === void 0 ? void 0 : model.hasDiffableMixin;
    }
    DiffableMixin.isMixedInto = isMixedInto;
    StratumOrder.addLoadStratum(DiffStratum.stratumName);
})(DiffableMixin || (DiffableMixin = {}));
export default DiffableMixin;
//# sourceMappingURL=DiffableMixin.js.map
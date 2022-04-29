var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import LatLonHeightTraits from "./LatLonHeightTraits";
import ModelTraits from "../ModelTraits";
import objectTrait from "../Decorators/objectTrait";
export default class ChartPointOnMapTraits extends ModelTraits {
}
__decorate([
    objectTrait({
        name: "Chart expand point on map",
        description: "The point on map where the current chart for the item was generated from. A marker will be shown at this point if the chart is active.",
        type: LatLonHeightTraits
    })
], ChartPointOnMapTraits.prototype, "chartPointOnMap", void 0);
//# sourceMappingURL=ChartPointOnMapTraits.js.map
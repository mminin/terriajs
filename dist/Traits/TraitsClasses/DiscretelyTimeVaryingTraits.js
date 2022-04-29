var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ChartTraits from "./ChartTraits";
import MappableTraits from "./MappableTraits";
import TimeVaryingTraits from "./TimeVaryingTraits";
export default class DiscretelyTimeVaryingTraits extends mixTraits(ChartTraits, TimeVaryingTraits, MappableTraits) {
    constructor() {
        super(...arguments);
        this.fromContinuous = "nearest";
        this.showInChartPanel = false;
        this.disableDateTimeSelector = false;
        this.multiplierDefaultDeltaStep = 2;
    }
}
__decorate([
    primitiveTrait({
        name: "Mapping from Continuous Time",
        description: "Specifies how a continuous time (e.g. the timeline control) is mapped to a discrete time for this dataset. Valid values are: <br/>" +
            " * `nearest` - the nearest available discrete time to the current continuous time is used. <br/>" +
            " * `next` - the discrete time equal to or after the current continuous time is used. <br/>" +
            " * `previous` - the discrete time equal to or before the current continuous time is used.",
        type: "string"
    })
], DiscretelyTimeVaryingTraits.prototype, "fromContinuous", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Show in chart",
        description: "Whether to plot data availability on a chart."
    })
], DiscretelyTimeVaryingTraits.prototype, "showInChartPanel", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Disable date time selector",
        description: "When true, disables the date time selector in the workbench"
    })
], DiscretelyTimeVaryingTraits.prototype, "disableDateTimeSelector", void 0);
__decorate([
    primitiveTrait({
        name: "Time Multiplier",
        description: "The multiplierDefaultDeltaStep is used to set the default multiplier (see `TimeVaryingTraits.multiplier` trait) - it represents the average number of (real-time) seconds between (dataset) time steps. For example, a value of five would set the `multiplier` so that a new time step (of this dataset) would appear every five seconds (on average) if the timeline is playing. This trait will only take effect if `multiplier` is **not** explicitly set.",
        type: "number"
    })
], DiscretelyTimeVaryingTraits.prototype, "multiplierDefaultDeltaStep", void 0);
//# sourceMappingURL=DiscretelyTimeVaryingTraits.js.map
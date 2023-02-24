var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../../ModelTraits";
import primitiveTrait from "../../Decorators/primitiveTrait";
import primitiveArrayTrait from "../../Decorators/primitiveArrayTrait";
export default class TableTimeStyleTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Time Column",
        description: "The column that indicates the time of a sample or the start time of an interval.",
        type: "string",
        isNullable: true
    })
], TableTimeStyleTraits.prototype, "timeColumn", void 0);
__decorate([
    primitiveTrait({
        name: "End Time Column",
        description: "The column that indicates the end time of an interval.",
        type: "string"
    })
], TableTimeStyleTraits.prototype, "endTimeColumn", void 0);
__decorate([
    primitiveArrayTrait({
        name: "ID Columns",
        description: "The columns that identify an entity as it changes over time.",
        type: "string"
    })
], TableTimeStyleTraits.prototype, "idColumns", void 0);
__decorate([
    primitiveTrait({
        name: "Is Sampled",
        description: 'True if the rows in this CSV correspond to "sampled" data, and so ' +
            "the feature position, color, and size should be interpolated to produce " +
            "smooth animation of the features over time. If False, then times are " +
            "treated as the start of discrete periods and feature positions, colors, and " +
            "sizes are kept constant until the next time. This value is ignored " +
            "if the CSV does not have both a time column and an ID column.",
        type: "boolean"
    })
], TableTimeStyleTraits.prototype, "isSampled", void 0);
__decorate([
    primitiveTrait({
        name: "Display Duration",
        type: "number",
        description: "Display duration for each row in the table, in minutes."
    })
], TableTimeStyleTraits.prototype, "displayDuration", void 0);
__decorate([
    primitiveTrait({
        name: "Spread start time",
        type: "boolean",
        description: 'Indicates if start time of feature should be "spread" so that all features are displayed at the earliest time step. This is useful for non-contiguous sensor data. If true, the earliest time step will display the earliest values for all features (eg sensor IDs) - even if the time value is **after** the earliest time step. This means that at time step 0, all features will be displayed.'
    })
], TableTimeStyleTraits.prototype, "spreadStartTime", void 0);
__decorate([
    primitiveTrait({
        name: "Spread end time",
        type: "boolean",
        description: 'Indicates if finish time of feature should be "spread" so that all features are displayed at the latest time step. See also `spreadStartTime`.'
    })
], TableTimeStyleTraits.prototype, "spreadFinishTime", void 0);
//# sourceMappingURL=TimeStyleTraits.js.map
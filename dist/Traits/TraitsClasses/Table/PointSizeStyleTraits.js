var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../../ModelTraits";
import primitiveTrait from "../../Decorators/primitiveTrait";
export default class TablePointSizeStyleTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.nullSize = 9;
        this.sizeFactor = 14;
        this.sizeOffset = 10;
    }
}
__decorate([
    primitiveTrait({
        name: "Point Size Column",
        description: "The column to use to size points. This column must be of type `scalar`",
        type: "string"
    })
], TablePointSizeStyleTraits.prototype, "pointSizeColumn", void 0);
__decorate([
    primitiveTrait({
        name: "Null Size",
        description: "The point size, in pixels, to use when the column has no value.",
        type: "number"
    })
], TablePointSizeStyleTraits.prototype, "nullSize", void 0);
__decorate([
    primitiveTrait({
        name: "Size Factor",
        description: "The size, in pixels, of the point is:\n" +
            "  `Normalized Value * Size Factor + Size Offset`\n" +
            "where the Normalized Value is a value in the range 0 to 1 with " +
            "0 representing the lowest value in the column and 1 representing " +
            "the highest.",
        type: "number"
    })
], TablePointSizeStyleTraits.prototype, "sizeFactor", void 0);
__decorate([
    primitiveTrait({
        name: "Size Offset",
        description: "The size, in pixels, of the point is:\n" +
            "  `Normalized Value * Size Factor + Size Offset`\n" +
            "where the Normalized Value is a value in the range 0 to 1 with " +
            "0 representing the lowest value in the column and 1 representing " +
            "the highest.",
        type: "number"
    })
], TablePointSizeStyleTraits.prototype, "sizeOffset", void 0);
//# sourceMappingURL=PointSizeStyleTraits.js.map
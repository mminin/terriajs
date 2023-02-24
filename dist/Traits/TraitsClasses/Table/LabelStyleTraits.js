var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../../Decorators/objectArrayTrait";
import objectTrait from "../../Decorators/objectTrait";
import primitiveArrayTrait from "../../Decorators/primitiveArrayTrait";
import primitiveTrait from "../../Decorators/primitiveTrait";
import mixTraits from "../../mixTraits";
import { BinStyleTraits, EnumStyleTraits, TableStyleMapSymbolTraits, TableStyleMapTraits } from "./StyleMapTraits";
/** Supports subset of CZML Label https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/Label
 *
 * Unimplemented properties
 * - show
 * - eyeOffset
 * - horizontalOrigin
 * - verticalOrigin
 * - heightReference
 * - showBackground
 * - backgroundColor
 * - backgroundPadding
 * - translucencyByDistance
 * - pixelOffsetScaleByDistance
 * - scaleByDistance
 * - distanceDisplayCondition
 * - disableDepthTestDistance

 */
export class LabelSymbolTraits extends mixTraits(TableStyleMapSymbolTraits) {
    constructor() {
        super(...arguments);
        this.font = "30px sans-serif";
        this.style = "FILL";
        this.scale = 1;
        this.fillColor = "#ffffff";
        this.outlineColor = "#000000";
        this.outlineWidth = 1;
        this.pixelOffset = [0, 0];
        this.horizontalOrigin = "LEFT";
        this.verticalOrigin = "CENTER";
    }
}
__decorate([
    primitiveTrait({
        name: "Label column",
        description: "ID of column to use as label",
        type: "string"
    })
], LabelSymbolTraits.prototype, "labelColumn", void 0);
__decorate([
    primitiveTrait({
        name: "Font",
        description: "Font CSS string. Default is `30px sans-serif`.",
        type: "string"
    })
], LabelSymbolTraits.prototype, "font", void 0);
__decorate([
    primitiveTrait({
        name: "Style",
        description: 'Label style. Possible values are `"FILL"`, `"OUTLINE"` and `"FILL_AND_OUTLINE"`. Default is `"FILL"`.',
        type: "string"
    })
], LabelSymbolTraits.prototype, "style", void 0);
__decorate([
    primitiveTrait({
        name: "Scale",
        description: "The scale of the label. The scale is multiplied with the pixel size of the label's text.",
        type: "number"
    })
], LabelSymbolTraits.prototype, "scale", void 0);
__decorate([
    primitiveTrait({
        name: "Fill color",
        description: "The fill color of the label.",
        type: "string"
    })
], LabelSymbolTraits.prototype, "fillColor", void 0);
__decorate([
    primitiveTrait({
        name: "Outline color",
        description: "The outline color of the label.",
        type: "string"
    })
], LabelSymbolTraits.prototype, "outlineColor", void 0);
__decorate([
    primitiveTrait({
        name: "Outline width",
        description: "The outline width of the label.",
        type: "number"
    })
], LabelSymbolTraits.prototype, "outlineWidth", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Pixel offset",
        description: "The number of pixels up and to the right to place the label.",
        type: "number"
    })
], LabelSymbolTraits.prototype, "pixelOffset", void 0);
__decorate([
    primitiveTrait({
        name: "Horizontal origin",
        description: 'The horizontal location of an origin relative to an object. For example, LEFT will place the label on the right of the point. Possible values are `"LEFT"`, `"CENTER"` and `"RIGHT"`. Default is `"RIGHT"`.',
        type: "string"
    })
], LabelSymbolTraits.prototype, "horizontalOrigin", void 0);
__decorate([
    primitiveTrait({
        name: "Vertical origin",
        description: 'The vertical location of an origin relative to an object. For example, TOP will place the label above the point. Possible values are `"TOP"`, `"CENTER"`, `"BASELINE"` and `"BOTTOM"`. Default is `"CENTER"`.',
        type: "string"
    })
], LabelSymbolTraits.prototype, "verticalOrigin", void 0);
export class EnumLabelSymbolTraits extends mixTraits(LabelSymbolTraits, EnumStyleTraits) {
}
EnumLabelSymbolTraits.isRemoval = EnumStyleTraits.isRemoval;
export class BinLabelSymbolTraits extends mixTraits(LabelSymbolTraits, BinStyleTraits) {
}
BinLabelSymbolTraits.isRemoval = BinStyleTraits.isRemoval;
export default class TableLabelStyleTraits extends mixTraits(TableStyleMapTraits) {
    constructor() {
        super(...arguments);
        // Override TableStyleMapTraits.enabled default
        this.enabled = false;
        this.enum = [];
        this.bin = [];
        this.null = new LabelSymbolTraits();
    }
}
__decorate([
    primitiveTrait({
        name: "Enabled",
        description: "True to enable. False by default",
        type: "boolean"
    })
], TableLabelStyleTraits.prototype, "enabled", void 0);
__decorate([
    objectArrayTrait({
        name: "Enum Colors",
        description: "The colors to use for enumerated values. This property is ignored " +
            "if the `Color Column` type is not `enum`.",
        type: EnumLabelSymbolTraits,
        idProperty: "value"
    })
], TableLabelStyleTraits.prototype, "enum", void 0);
__decorate([
    objectArrayTrait({
        name: "Enum Colors",
        description: "The colors to use for enumerated values. This property is ignored " +
            "if the `Color Column` type is not `enum`.",
        type: BinLabelSymbolTraits,
        idProperty: "index"
    })
], TableLabelStyleTraits.prototype, "bin", void 0);
__decorate([
    objectTrait({
        name: "Enum Colors",
        description: "The colors to use for enumerated values. This property is ignored " +
            "if the `Color Column` type is not `enum`.",
        type: LabelSymbolTraits
    })
], TableLabelStyleTraits.prototype, "null", void 0);
//# sourceMappingURL=LabelStyleTraits.js.map
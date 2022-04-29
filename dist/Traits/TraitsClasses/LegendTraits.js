var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveTrait from "../Decorators/primitiveTrait";
import ModelTraits from "../ModelTraits";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
export class LegendItemTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.maxMultipleTitlesShowed = 10;
        this.imageHeight = 20;
        this.imageWidth = 20;
    }
}
__decorate([
    primitiveTrait({
        name: "Title",
        description: "The title to display next to this legend item.",
        type: "string"
    })
], LegendItemTraits.prototype, "title", void 0);
__decorate([
    primitiveTrait({
        name: "Multiple Titles",
        description: "Multiple titles to display next to this legend item.",
        type: "string"
    })
], LegendItemTraits.prototype, "multipleTitles", void 0);
__decorate([
    primitiveTrait({
        name: "Maximum multiple titles showed",
        description: "Maximum number of multiple titles to display next to this legend item. (Default is 10)",
        type: "string"
    })
], LegendItemTraits.prototype, "maxMultipleTitlesShowed", void 0);
__decorate([
    primitiveTrait({
        name: "Title",
        description: "The title to display above this legend item, i.e. marking the top of " +
            "a box on the legend.",
        type: "string"
    })
], LegendItemTraits.prototype, "titleAbove", void 0);
__decorate([
    primitiveTrait({
        name: "Title",
        description: "The title to display below this legend item, i.e. marking the bottom of " +
            "a box on the legend.",
        type: "string"
    })
], LegendItemTraits.prototype, "titleBelow", void 0);
__decorate([
    primitiveTrait({
        name: "Color",
        description: "The CSS color to display for this item. This property is ignored if " +
            "`Legend URL` is specified.",
        type: "string"
    })
], LegendItemTraits.prototype, "color", void 0);
__decorate([
    primitiveTrait({
        name: "Outline Color",
        description: "The CSS color with which to outline this item.",
        type: "string"
    })
], LegendItemTraits.prototype, "outlineColor", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Multiple Colors",
        description: "Multiple colors to show with this item in a grid arrangement.",
        type: "string"
    })
], LegendItemTraits.prototype, "multipleColors", void 0);
__decorate([
    primitiveTrait({
        name: "Image URL",
        description: "The URL of an image to display with this item.",
        type: "string"
    })
], LegendItemTraits.prototype, "imageUrl", void 0);
__decorate([
    primitiveTrait({
        name: "Add Spacing Above",
        description: "True to add a bit of extra spacing above this item in order to separate it visually from the rest of the legend.",
        type: "boolean"
    })
], LegendItemTraits.prototype, "addSpacingAbove", void 0);
__decorate([
    primitiveTrait({
        name: "Legend Image Height",
        description: "The height of the legend image.",
        type: "number"
    })
], LegendItemTraits.prototype, "imageHeight", void 0);
__decorate([
    primitiveTrait({
        name: "Legend Image Width",
        description: "The width of the legend image.",
        type: "number"
    })
], LegendItemTraits.prototype, "imageWidth", void 0);
export default class LegendTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.imageScaling = 1;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Title",
        description: "A title to be displayed above the legend."
    })
], LegendTraits.prototype, "title", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "URL",
        description: "The URL of the legend image."
    })
], LegendTraits.prototype, "url", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Scaling",
        description: "Scaling of the legend. For example, a high DPI legend may have scaling = `0.5`, so it will be scaled doown 50%"
    })
], LegendTraits.prototype, "imageScaling", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "URL MIME Type",
        description: "The MIME type of the `URL` legend image."
    })
], LegendTraits.prototype, "urlMimeType", void 0);
__decorate([
    objectArrayTrait({
        name: "Items",
        description: "",
        type: LegendItemTraits,
        idProperty: "index"
    })
], LegendTraits.prototype, "items", void 0);
//# sourceMappingURL=LegendTraits.js.map
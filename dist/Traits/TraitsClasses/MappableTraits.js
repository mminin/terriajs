var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import AttributionTraits from "./AttributionTraits";
export class RectangleTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "West",
        description: "The westernmost longitude in degrees."
    })
], RectangleTraits.prototype, "west", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "South",
        description: "The southernmost longitude in degrees."
    })
], RectangleTraits.prototype, "south", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "East",
        description: "The easternmost longitude in degrees."
    })
], RectangleTraits.prototype, "east", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "North",
        description: "The northernmost longitude in degrees."
    })
], RectangleTraits.prototype, "north", void 0);
export class InitialMessageTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Title",
        description: "The title of the message."
    })
], InitialMessageTraits.prototype, "title", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Content",
        description: "The content of the message."
    })
], InitialMessageTraits.prototype, "content", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Key",
        description: "Identifier. If multiple messages with the same key are triggered, only the first will be displayed."
    })
], InitialMessageTraits.prototype, "key", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Confirmation",
        description: "Whether the message requires confirmation."
    })
], InitialMessageTraits.prototype, "confirmation", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Name",
        description: "If `confirmation` is true, the text to put on the confirmation button."
    })
], InitialMessageTraits.prototype, "confirmText", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Width",
        description: "Width of the message."
    })
], InitialMessageTraits.prototype, "width", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "height",
        description: "Height of the message."
    })
], InitialMessageTraits.prototype, "height", void 0);
export default class MappableTraits extends mixTraits(AttributionTraits) {
    constructor() {
        super(...arguments);
        this.disablePreview = false;
        this.disableZoomTo = false;
        this.zoomOnAddToWorkbench = false;
        this.show = true;
    }
}
__decorate([
    objectTrait({
        type: RectangleTraits,
        name: "Rectangle",
        description: "The bounding box rectangle that contains all the data in this catalog item."
    })
], MappableTraits.prototype, "rectangle", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Disable Preview",
        description: "Disables the preview on the Add Data panel. This is useful when the preview will be very slow to load."
    })
], MappableTraits.prototype, "disablePreview", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Disable zoom to",
        description: "Disables the zoom to (aka 'Ideal Zoom') button in the workbench."
    })
], MappableTraits.prototype, "disableZoomTo", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Zoom on enable",
        description: "Zoom to dataset when added to workbench. Doesn't work if `disableZoomTo` is true."
    })
], MappableTraits.prototype, "zoomOnAddToWorkbench", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Show",
        description: "Show or hide a workbench item. When show is false, a mappable item is removed from the map and a chartable item is removed from the chart panel."
    })
], MappableTraits.prototype, "show", void 0);
__decorate([
    objectTrait({
        name: "Initial message",
        type: InitialMessageTraits,
        description: "A message to show when the user adds the catalog item to the workbench. Useful for showing disclaimers."
    })
], MappableTraits.prototype, "initialMessage", void 0);
//# sourceMappingURL=MappableTraits.js.map
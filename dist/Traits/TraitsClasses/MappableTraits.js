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
import { FeatureInfoTemplateTraits } from "./FeatureInfoTraits";
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
export class LookAtTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.targetHeight = 100;
        this.heading = 0;
        this.pitch = 45;
        this.range = 500;
    }
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Target longitude",
        description: "Target longitude on the WGS84 ellipsoid in degrees"
    })
], LookAtTraits.prototype, "targetLongitude", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Target latitude",
        description: "Target latitude on the WGS84 ellipsoid in degrees"
    })
], LookAtTraits.prototype, "targetLatitude", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Target height",
        description: "Target height in meters. Treat it as camera height. A positive value is above the WGS84 ellipsoid. Default to 100 meters."
    })
], LookAtTraits.prototype, "targetHeight", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Heading",
        description: "Heading in degrees. Treat it as camera bearing. North is 0. A positive value rotates clockwise, negative anti-clockwise. Default to 0."
    })
], LookAtTraits.prototype, "heading", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Pitch",
        description: "Pitch in degrees. Treat it as camera pitch. A positive value is to look down, negative up. Default to 45."
    })
], LookAtTraits.prototype, "pitch", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Range",
        description: "The range in meters. It is the distance between the target position and camera position projected onto the local plane. Not negative and default to 500."
    })
], LookAtTraits.prototype, "range", void 0);
export class VectorTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "x",
        description: "X component of vector in the Earth-centered Fixed frame."
    })
], VectorTraits.prototype, "x", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "y",
        description: "Y component of vector in the Earth-centered Fixed frame."
    })
], VectorTraits.prototype, "y", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "z",
        description: "Z component of vector in the Earth-centered Fixed frame."
    })
], VectorTraits.prototype, "z", void 0);
export class CameraTraits extends RectangleTraits {
}
__decorate([
    objectTrait({
        type: VectorTraits,
        name: "position",
        description: "Position of the camera in the Earth-centered Fixed frame in meters."
    })
], CameraTraits.prototype, "position", void 0);
__decorate([
    objectTrait({
        type: VectorTraits,
        name: "direction",
        description: "The look direction of the camera in the Earth-centered Fixed frame."
    })
], CameraTraits.prototype, "direction", void 0);
__decorate([
    objectTrait({
        type: VectorTraits,
        name: "up",
        description: "The up vector direction of the camera in the Earth-centered Fixed frame."
    })
], CameraTraits.prototype, "up", void 0);
export class IdealZoomTraits extends ModelTraits {
}
__decorate([
    objectTrait({
        type: LookAtTraits,
        name: "Look at",
        description: "Parameters for camera to look at a target."
    })
], IdealZoomTraits.prototype, "lookAt", void 0);
__decorate([
    objectTrait({
        type: CameraTraits,
        name: "Camera",
        description: "Use camera position, direction and up if fully defined. Otherwise use rectangle if fully defined."
    })
], IdealZoomTraits.prototype, "camera", void 0);
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
    objectTrait({
        type: IdealZoomTraits,
        name: "Ideal zoom",
        description: "Override default ideal zoom if the given values are valid."
    })
], MappableTraits.prototype, "idealZoom", void 0);
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
__decorate([
    objectTrait({
        type: FeatureInfoTemplateTraits,
        name: "Feature info template",
        description: "A template object for formatting content in feature info panel"
    })
], MappableTraits.prototype, "featureInfoTemplate", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Show string if (feature info) property value is null",
        description: "If the value of a property is null or undefined, show the specified string as the value of the property. Otherwise, the property name will not be listed at all."
    })
], MappableTraits.prototype, "showStringIfPropertyValueIsNull", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum shown feature infos",
        description: 'The maximum number of "feature infos" that can be displayed in feature info panel.'
    })
], MappableTraits.prototype, "maximumShownFeatureInfos", void 0);
//# sourceMappingURL=MappableTraits.js.map
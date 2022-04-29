var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import { observable } from "mobx";
export var UIMode;
(function (UIMode) {
    UIMode[UIMode["Difference"] = 0] = "Difference";
})(UIMode || (UIMode = {}));
/**
 * A mode for interacting with the map.
 */
export default class MapInteractionMode {
    constructor(options) {
        /**
         * Gets or sets a callback that is invoked when the user cancels the interaction mode.  If this property is undefined,
         * the interaction mode cannot be canceled.
         */
        this.onCancel = options.onCancel;
        /**
         * Gets or sets the details of a custom user interface for this map interaction mode. This property is not used by
         * the `MapInteractionMode` itself, so it can be anything that is suitable for the user interface. In the standard
         * React-based user interface included with TerriaJS, this property is a function that is called with no parameters
         * and is expected to return a React component.
         */
        this.customUi = options.customUi;
        /**
         * Gets or sets the html formatted message displayed on the map when in this mode.
         */
        this.message = function () {
            return options.message;
        };
        /**
         * Gets or sets the react node displayed on the map when in this mode.
         */
        this.messageAsNode = function () {
            return options.messageAsNode;
        };
        /**
         * Set the text of the button for the dialog the message is displayed on.
         */
        this.buttonText = defaultValue(options.buttonText, "Cancel");
        /**
         * Gets or sets the features that are currently picked.
         */
        this.pickedFeatures = undefined;
        /**
         * Gets or sets whether to use the diff tool UI+styles
         */
        this.uiMode = defaultValue(options.uiMode, undefined);
        /**
         * Determines whether a rectangle will be requested from the user rather than a set of pickedFeatures.
         */
        // this.drawRectangle = defaultValue(options.drawRectangle, false);
        this.onEnable = options.onEnable;
        this.invisible = defaultValue(options.invisible, false);
    }
}
__decorate([
    observable
], MapInteractionMode.prototype, "customUi", void 0);
__decorate([
    observable
], MapInteractionMode.prototype, "message", void 0);
__decorate([
    observable
], MapInteractionMode.prototype, "messageAsNode", void 0);
__decorate([
    observable
], MapInteractionMode.prototype, "pickedFeatures", void 0);
//# sourceMappingURL=MapInteractionMode.js.map
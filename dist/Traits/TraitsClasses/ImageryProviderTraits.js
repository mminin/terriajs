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
import OpacityTraits from "./OpacityTraits";
import SplitterTraits from "./SplitterTraits";
import FeaturePickingTraits from "./FeaturePickingTraits";
export class TileErrorHandlingTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "tileErrorThresholdBeforeDisabling",
        description: "The number of tile failures before disabling the item."
    })
], TileErrorHandlingTraits.prototype, "thresholdBeforeDisablingItem", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "treat403AsError",
        description: "Indicates whether a 403 response code when requesting a tile should be treated as an error. If false, 403s are assumed to just be missing tiles and need not be reported to the user."
    })
], TileErrorHandlingTraits.prototype, "treat403AsError", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "treat404AsError",
        description: "Indicates whether a 404 response code when requesting a tile should be treated as an error. If false, 404s are assumed to just be missing tiles and need not be reported to the user."
    })
], TileErrorHandlingTraits.prototype, "treat404AsError", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "ignoreUnknownTileErrors",
        description: "A flag indicating whether non-specific (no HTTP status code) tile errors should be ignored. This is a last resort, for dealing with odd cases such as data sources that return non-images (eg XML) with a 200 status code. No error messages will be shown to the user."
    })
], TileErrorHandlingTraits.prototype, "ignoreUnknownTileErrors", void 0);
export default class ImageryProviderTraits extends mixTraits(FeaturePickingTraits, OpacityTraits, SplitterTraits) {
    constructor() {
        super(...arguments);
        this.tileErrorHandlingOptions = {
            thresholdBeforeDisablingItem: 5,
            treat403AsError: true,
            treat404AsError: false,
            ignoreUnknownTileErrors: false
        };
        this.clipToRectangle = true;
        this.tileWidth = 256;
        this.tileHeight = 256;
    }
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Leaflet update interval",
        description: "Update a tile only once during this interval when the map is panned. Value should be specified in milliseconds."
    })
], ImageryProviderTraits.prototype, "leafletUpdateInterval", void 0);
__decorate([
    objectTrait({
        type: TileErrorHandlingTraits,
        name: "tileErrorHandling",
        description: "Options for handling tile errors"
    })
], ImageryProviderTraits.prototype, "tileErrorHandlingOptions", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Clip to rectangle",
        description: `Gets or sets a value indicating whether this dataset should be clipped to the {@link CatalogItem#rectangle}.
If true, no part of the dataset will be displayed outside the rectangle.
This property is true by default, leading to better performance and avoiding tile request errors that might occur when requesting tiles outside the server-specified rectangle.
However, it may also cause features to be cut off in some cases, such as if a server reports an extent that does not take into account that the representation of features sometimes require a larger spatial extent than the features themselves.
For example, if a point feature on the edge of the extent is drawn as a circle with a radius of 5 pixels, half of that circle will be cut off.`
    })
], ImageryProviderTraits.prototype, "clipToRectangle", void 0);
__decorate([
    primitiveTrait({
        name: "Minimum Level",
        description: "The minimum level-of-detail supported by the imagery provider. Take care when specifying this that the number of tiles at the minimum level is small, such as four or less. A larger number is likely to result in rendering problems",
        type: "number"
    })
], ImageryProviderTraits.prototype, "minimumLevel", void 0);
__decorate([
    primitiveTrait({
        name: "Maximum Level",
        description: "The maximum level-of-detail supported by the imagery provider, or undefined if there is no limit",
        type: "number"
    })
], ImageryProviderTraits.prototype, "maximumLevel", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Tile width (in pixels)",
        description: "Tile width in pixels. Default value is 256 pixels"
    })
], ImageryProviderTraits.prototype, "tileWidth", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Tile height (in pixels)",
        description: "Tile height in pixels. Default value is 256 pixels"
    })
], ImageryProviderTraits.prototype, "tileHeight", void 0);
//# sourceMappingURL=ImageryProviderTraits.js.map
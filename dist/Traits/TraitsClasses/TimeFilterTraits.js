var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import LatLonHeightTraits from "./LatLonHeightTraits";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import DiscretelyTimeVaryingTraits from "./DiscretelyTimeVaryingTraits";
import SplitterTraits from "./SplitterTraits";
export class TileCoordinates extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "x",
        description: "X coordinate of the tile"
    })
], TileCoordinates.prototype, "x", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "y",
        description: "Y coordinate of the tile"
    })
], TileCoordinates.prototype, "y", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "level",
        description: "Zoom level of the tile"
    })
], TileCoordinates.prototype, "level", void 0);
export class TimeFilterCoordinates extends mixTraits(LatLonHeightTraits) {
}
__decorate([
    objectTrait({
        name: "Tile coordinates",
        type: TileCoordinates,
        description: "x, y, level coordinates of the picked tile. Refer: https://cesium.com/docs/cesiumjs-ref-doc/ImageryProvider.html?classFilter=imageryprovider#pickFeatures"
    })
], TimeFilterCoordinates.prototype, "tile", void 0);
export default class TimeFilterTraits extends mixTraits(DiscretelyTimeVaryingTraits, SplitterTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Time filter property",
        description: "The name of a property in a feature returned from this layer's feature query service that indicates the times at which this layer covers this position. For example, historical and near-real-time satellite imagery often comes as daily swaths, with a given area on the globe potentially only covered every number of days."
    })
], TimeFilterTraits.prototype, "timeFilterPropertyName", void 0);
__decorate([
    objectTrait({
        type: TimeFilterCoordinates,
        name: "Time filter coordinates",
        description: "The current position picked by the user for filtering"
    })
], TimeFilterTraits.prototype, "timeFilterCoordinates", void 0);
//# sourceMappingURL=TimeFilterTraits.js.map
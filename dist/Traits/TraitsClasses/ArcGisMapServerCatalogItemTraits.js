var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import DiscretelyTimeVaryingTraits from "./DiscretelyTimeVaryingTraits";
import FeatureInfoTraits from "./FeatureInfoTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import { MinMaxLevelTraits } from "./MinMaxLevelTraits";
import RasterLayerTraits from "./RasterLayerTraits";
import UrlTraits from "./UrlTraits";
export default class ArcGisMapServerCatalogItemTraits extends mixTraits(MappableTraits, FeatureInfoTraits, RasterLayerTraits, LayerOrderingTraits, MappableTraits, UrlTraits, CatalogMemberTraits, LegendOwnerTraits, DiscretelyTimeVaryingTraits, MinMaxLevelTraits) {
    constructor() {
        super(...arguments);
        this.allowFeaturePicking = true;
        this.maxRefreshIntervals = 1000;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Layer(s)",
        description: "The layer or layers to display. This can be a comma seperated string of layer IDs or names."
    })
], ArcGisMapServerCatalogItemTraits.prototype, "layers", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum scale",
        description: "Gets or sets the denominator of the largest scale (smallest denominator) for which tiles should be requested.  For example, if this value is 1000, then tiles representing a scale larger than 1:1000 (i.e. numerically smaller denominator, when zooming in closer) will not be requested.  Instead, tiles of the largest-available scale, as specified by this property, will be used and will simply get blurier as the user zooms in closer."
    })
], ArcGisMapServerCatalogItemTraits.prototype, "maximumScale", void 0);
__decorate([
    anyTrait({
        name: "Parameters",
        description: "Additional parameters to pass to the MapServer when requesting images."
    })
], ArcGisMapServerCatalogItemTraits.prototype, "parameters", void 0);
__decorate([
    primitiveTrait({
        name: "Allow feature picking",
        type: "boolean",
        description: "Indicates whether features in this catalog item can be selected by clicking them on the map."
    })
], ArcGisMapServerCatalogItemTraits.prototype, "allowFeaturePicking", void 0);
__decorate([
    primitiveTrait({
        name: "Token URL",
        description: "URL to use for fetching request tokens",
        type: "string"
    })
], ArcGisMapServerCatalogItemTraits.prototype, "tokenUrl", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum Refresh Intervals",
        description: "The maximum number of discrete times that can be created by a single " +
            "date range when layer in time-enabled."
    })
], ArcGisMapServerCatalogItemTraits.prototype, "maxRefreshIntervals", void 0);
//# sourceMappingURL=ArcGisMapServerCatalogItemTraits.js.map
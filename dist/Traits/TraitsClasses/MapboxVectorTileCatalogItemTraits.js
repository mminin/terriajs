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
import ImageryProviderTraits from "./ImageryProviderTraits";
import LayerOrderingTraits from "./LayerOrderingTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import UrlTraits from "./UrlTraits";
export default class MapboxVectorTileCatalogItemTraits extends mixTraits(LayerOrderingTraits, UrlTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits, ImageryProviderTraits) {
    constructor() {
        super(...arguments);
        this.idProperty = "FID";
        this.maximumNativeZoom = 12;
        this.maximumZoom = 28;
        this.minimumZoom = 0;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "lineColor",
        description: "This property exists for backward compatibility. The outline color of the features, specified as a CSS color string. This will only be used if `layer` trait has been set. For more complex styling - see `style` trait."
    })
], MapboxVectorTileCatalogItemTraits.prototype, "lineColor", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "fillColor",
        description: "This property exists for backward compatibility. The fill color of the features, specified as a CSS color string. This will only be used if `layer` trait has been set. For more complex styling - see `style` trait."
    })
], MapboxVectorTileCatalogItemTraits.prototype, "fillColor", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "layer",
        description: "This property exists for backward compatibility. It can be used to only show a particular layer in the tileset."
    })
], MapboxVectorTileCatalogItemTraits.prototype, "layer", void 0);
__decorate([
    anyTrait({
        name: "style",
        description: `JSON style spec for MVT. This supports subset of Mapbox style spec (https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/).

For supported properties - refer to https://github.com/protomaps/protomaps.js/blob/master/src/compat/json_style.ts.

For example:
\`\`\`json
{
  "layers": [
    {
      "type": "fill",
      "source-layer": "buildings",
      "paint": {
        "fill-color": "black"
      }
    },
    {
      "type": "line",
      "source-layer": "buildings",
      "paint": {
        "line-color": "red",
        "line-width": 1
      }
    },
    {
      "type": "symbol",
      "source-layer": "places",
      "layout": {
        "text-size": 20,
        "text-font": "sans-serif"
      },
      "paint": {
        "text-color": "red"
      }
    }
  ]
}
\`\`\``
    })
], MapboxVectorTileCatalogItemTraits.prototype, "style", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Style URL",
        description: `URL to JSON file for styling. See \`style\` trait for more info.`
    })
], MapboxVectorTileCatalogItemTraits.prototype, "styleUrl", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "idProperty",
        description: "The name of the property that is a unique ID for features."
    })
], MapboxVectorTileCatalogItemTraits.prototype, "idProperty", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "nameProperty",
        description: "The name of the property from which to obtain the name of features."
    })
], MapboxVectorTileCatalogItemTraits.prototype, "nameProperty", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "maximumNativeZoom",
        description: "The maximum zoom level for which tile files exist."
    })
], MapboxVectorTileCatalogItemTraits.prototype, "maximumNativeZoom", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "maximumZoom",
        description: "The maximum zoom level that can be displayed by using the data in the  MapboxVectorTileCatalogItem#maximumNativeZoom tiles."
    })
], MapboxVectorTileCatalogItemTraits.prototype, "maximumZoom", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "minimumZoom",
        description: "The minimum zoom level for which tile files exist."
    })
], MapboxVectorTileCatalogItemTraits.prototype, "minimumZoom", void 0);
//# sourceMappingURL=MapboxVectorTileCatalogItemTraits.js.map
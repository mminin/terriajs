var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import FeatureInfoTraits from "./FeatureInfoTraits";
import StyleTraits from "./StyleTraits";
import TableTraits from "./TableTraits";
import UrlTraits from "./UrlTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
export class PerPropertyGeoJsonStyleTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.caseSensitive = false;
    }
}
__decorate([
    anyTrait({
        name: "Properties",
        description: "If the properties of a feature match these properties, then apply the style to that feature"
    })
], PerPropertyGeoJsonStyleTraits.prototype, "properties", void 0);
__decorate([
    objectTrait({
        name: "Style",
        type: StyleTraits,
        description: "Styling rules to apply, following [simplestyle-spec](https://github.com/mapbox/simplestyle-spec)"
    })
], PerPropertyGeoJsonStyleTraits.prototype, "style", void 0);
__decorate([
    primitiveTrait({
        name: "Case sensitive",
        type: "boolean",
        description: "True if properties should be matched in a case sensitive fashion"
    })
], PerPropertyGeoJsonStyleTraits.prototype, "caseSensitive", void 0);
export class GeoJsonTraits extends mixTraits(LegendOwnerTraits, TableTraits, FeatureInfoTraits, UrlTraits) {
    constructor() {
        super(...arguments);
        /** Override TableTraits which aren't applicable to GeoJsonTraits */
        this.enableManualRegionMapping = false;
        this.disableTableStyle = false;
        this.clampToGround = true;
        this.perPropertyStyles = [];
    }
}
__decorate([
    primitiveTrait({
        name: "Enable manual region mapping (Disabled for GeoJsonTraits)",
        description: "If enabled, there will be controls to set region column and region type.",
        type: "boolean"
    })
], GeoJsonTraits.prototype, "enableManualRegionMapping", void 0);
__decorate([
    objectTrait({
        type: StyleTraits,
        name: "Style",
        description: "Styling rules that follow [simplestyle-spec](https://github.com/mapbox/simplestyle-spec). If using geojson-vt/TableStyleTraits, then this style will be used as the default style (which will be overriden by TableStyleTraits). To disable TableStyleTraits, see `disableTableStyle`."
    })
], GeoJsonTraits.prototype, "style", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Disable table style",
        description: "If true, all table styling will be disabled. This only applies to geojson-vt/protomaps (see `forceCesiumPrimitives`). It disabled, `style` rules will be used instead"
    })
], GeoJsonTraits.prototype, "disableTableStyle", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Clamp to Ground",
        description: "Whether the features in this GeoJSON should be clamped to the terrain surface. If `forceCesiumPrimitives` is false, this will be `true`"
    })
], GeoJsonTraits.prototype, "clampToGround", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Force cesium primitives",
        description: "Force rendering GeoJSON features as Cesium primitives. This will be true if you are using `perPropertyStyles`, `timeProperty`, `heightProperty` or `czmlTemplate`. If undefined, geojson-vt/protomaps will be used"
    })
], GeoJsonTraits.prototype, "forceCesiumPrimitives", void 0);
__decorate([
    objectArrayTrait({
        name: "Per property styles",
        type: PerPropertyGeoJsonStyleTraits,
        description: "Override feature styles according to their properties. This is only supported for cesium primitives (see `forceCesiumPrimitives`)",
        idProperty: "index"
    })
], GeoJsonTraits.prototype, "perPropertyStyles", void 0);
__decorate([
    primitiveTrait({
        name: "Time property",
        type: "string",
        description: "The property of each GeoJSON feature that specifies which point in time that feature is associated with. If not specified, it is assumed that the dataset is constant throughout time. This is only supported for cesium primitives (see `forceCesiumPrimitives`). If using geojson-vt styling, use TableTraits instead (see `TableStyleTraits` and `TableTimeStyleTraits`)"
    })
], GeoJsonTraits.prototype, "timeProperty", void 0);
__decorate([
    primitiveTrait({
        name: "Height property",
        type: "string",
        description: "The property of each GeoJSON feature that specifies the height. If defined, polygons will be extruded to this property (in meters) above terrain. This is only supported for cesium primitives (see `forceCesiumPrimitives`)"
    })
], GeoJsonTraits.prototype, "heightProperty", void 0);
__decorate([
    anyTrait({
        name: "CZML template",
        description: `CZML template to be used to replace each GeoJSON **Point** feature. Feature coordinates and properties will automatically be applied to CZML packet, so they can be used as references. If this is defined, \`clampToGround\`, \`style\`, \`perPropertyStyles\`, \`timeProperty\` and \`heightProperty\` will be ignored.

    For example - this will render a cylinder for every point (and use the length and radius feature properties)
      \`\`\`json
      {
        cylinder: {
          length: {
            reference: "#properties.length"
          },
          topRadius: {
            reference: "#properties.radius"
          },
          bottomRadius: {
            reference: "#properties.radius"
          },
          material: {
            solidColor: {
              color: {
                rgba: [0, 200, 0, 20]
              }
            }
          }
        }
      }
      \`\`\``
    })
], GeoJsonTraits.prototype, "czmlTemplate", void 0);
//# sourceMappingURL=GeoJsonTraits.js.map
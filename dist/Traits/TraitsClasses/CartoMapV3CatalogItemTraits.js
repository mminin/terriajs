var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import { traitClass } from "../Trait";
import { GeoJsonTraits } from "./GeoJsonTraits";
let CartoMapV3TableCatalogItemTraits = class CartoMapV3TableCatalogItemTraits extends mixTraits(GeoJsonTraits) {
    constructor() {
        super(...arguments);
        this.connectionName = "carto_dw";
        this.baseUrl = "https://gcp-australia-southeast1.api.carto.com/";
        this.cartoGeoColumn = "geom";
    }
};
__decorate([
    primitiveTrait({
        type: "string",
        name: "Access token",
        description: "The access token to pass to the Carto Maps API"
    })
], CartoMapV3TableCatalogItemTraits.prototype, "accessToken", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Authorization token",
        description: "The authorization token to pass to the Carto Maps API"
    })
], CartoMapV3TableCatalogItemTraits.prototype, "connectionName", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Base URL",
        description: 'Base URL for Carto API (eg "https://gcp-australia-southeast1.api.carto.com/")'
    })
], CartoMapV3TableCatalogItemTraits.prototype, "baseUrl", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Geo column name",
        description: "Column name of the geom at the table (used for Table and Query API)"
    })
], CartoMapV3TableCatalogItemTraits.prototype, "cartoGeoColumn", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Carto SQL Query",
        description: "Carto SQL Query (used for Query API). If this is defined, then the Query API will be used instead of Table API."
    })
], CartoMapV3TableCatalogItemTraits.prototype, "cartoQuery", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Table name",
        description: 'Table fully qualified name - eg "carto-demo-data.demo_tables.airports". (used for Table API). Note if `cartoQuery` defined, then the Query API will be used instead of Table API.'
    })
], CartoMapV3TableCatalogItemTraits.prototype, "cartoTableName", void 0);
__decorate([
    primitiveArrayTrait({
        type: "string",
        name: "Column",
        description: "Columns to retrieve from the layer, by default all are returned. (used for Table API)"
    })
], CartoMapV3TableCatalogItemTraits.prototype, "cartoColumns", void 0);
CartoMapV3TableCatalogItemTraits = __decorate([
    traitClass({
        description: `Calls Carto V3 API to return GeoJSON. It supports the Query API and the Table API.

To use the Query API - see traits:
- \`cartoQuery\`
- \`cartoGeoColumn\`

To use the Table API - see traits:
- \`cartoTableName\`
- \`cartoColumns\`
- \`cartoGeoColumn\``
    })
], CartoMapV3TableCatalogItemTraits);
export default CartoMapV3TableCatalogItemTraits;
//# sourceMappingURL=CartoMapV3CatalogItemTraits.js.map
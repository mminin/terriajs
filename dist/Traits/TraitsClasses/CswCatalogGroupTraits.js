var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import CatalogMemberTraits from "./CatalogMemberTraits";
import GetCapabilitiesTraits from "./GetCapabilitiesTraits";
import GroupTraits from "./GroupTraits";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import UrlTraits from "./UrlTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
export class DomainSpecTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Domain Property Name",
        description: "Domain Property Name."
    })
], DomainSpecTraits.prototype, "domainPropertyName", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Hierarchy Separator",
        description: "Hierarchy Separator."
    })
], DomainSpecTraits.prototype, "hierarchySeparator", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Query Property Name",
        description: "Query Property Name."
    })
], DomainSpecTraits.prototype, "queryPropertyName", void 0);
export default class CswCatalogGroupTraits extends mixTraits(GetCapabilitiesTraits, GroupTraits, UrlTraits, CatalogMemberTraits, LegendOwnerTraits) {
    constructor() {
        super(...arguments);
        this.flatten = false;
        this.includeWms = true;
        this.includeKml = true;
        this.includeCsv = true;
        this.includeEsriMapServer = true;
        this.includeGeoJson = true;
        this.wmsResourceFormat = "\\bwms\\b";
        this.kmlResourceFormat = "\\bkml\\b";
        this.csvResourceFormat = "\\bcsv-geo-";
        this.esriMapServerResourceFormat = "\\besri rest\\b";
        this.geoJsonResourceFormat = "\\bgeojson\\b";
    }
}
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Flatten",
        description: "True to flatten the layers into a single list; false to use the layer hierarchy."
    })
], CswCatalogGroupTraits.prototype, "flatten", void 0);
__decorate([
    objectTrait({
        type: DomainSpecTraits,
        name: "Domain Specification",
        description: "Domain Specification"
    })
], CswCatalogGroupTraits.prototype, "domainSpecification", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Include WMS",
        description: "True to allow WMS resources to be added to the catalog; otherwise, false."
    })
], CswCatalogGroupTraits.prototype, "includeWms", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Include KML",
        description: "True to allow KML resources to be added to the catalog; otherwise, false."
    })
], CswCatalogGroupTraits.prototype, "includeKml", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Include CSV",
        description: "True to allow CSV resources to be added to the catalog; otherwise, false."
    })
], CswCatalogGroupTraits.prototype, "includeCsv", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Include ESRI Map Server",
        description: "True to allow ESRI Map resources to be added to the catalog; otherwise, false."
    })
], CswCatalogGroupTraits.prototype, "includeEsriMapServer", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Include GeoJSON",
        description: "True to allow GeoJSON resources to be added to the catalog; otherwise, false"
    })
], CswCatalogGroupTraits.prototype, "includeGeoJson", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "WMS Resource Format",
        description: "Gets or sets a regular expression that, when it matches the protocol attribute of a URI element of a record, indicates that the URI is a WMS resource."
    })
], CswCatalogGroupTraits.prototype, "wmsResourceFormat", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "KML Resource Format",
        description: "Gets or sets a regular expression that, when it matches the protocol attribute of a URI element of a record, indicates that the resource is a KML resource."
    })
], CswCatalogGroupTraits.prototype, "kmlResourceFormat", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "CSV Resource Format",
        description: "Gets or sets a regular expression that, when it matches the protocol attribute of a URI element of a record, indicates that the URI is a CSV resource."
    })
], CswCatalogGroupTraits.prototype, "csvResourceFormat", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "ESRI MapServer Resource Format",
        description: "Gets or sets a regular expression that, when it matches the protocol attribute of a URI element of a record, indicates that the URI is a Esri MapServer resource."
    })
], CswCatalogGroupTraits.prototype, "esriMapServerResourceFormat", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "WMS Resource Format",
        description: "Gets or sets a regular expression that, when it matches the protocol attribute of a URI element of a record, indicates that the URI is a GeoJSON resource."
    })
], CswCatalogGroupTraits.prototype, "geoJsonResourceFormat", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "GetRecords Template",
        description: "Gets or sets the template XML string to POST to the CSW server to query for catalog items.  If this property is undefined,`lib/Models/CswGetRecordsTemplate.xml` is used.  The XML string should have a `{startPosition}` placeholder to be replaced with the next start position in order to allow incremental paging of results.."
    })
], CswCatalogGroupTraits.prototype, "getRecordsTemplate", void 0);
//# sourceMappingURL=CswCatalogGroupTraits.js.map
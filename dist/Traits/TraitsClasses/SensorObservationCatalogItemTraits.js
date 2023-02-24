var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveArrayTrait from "../Decorators/primitiveArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import TableTraits from "./Table/TableTraits";
import UrlTraits from "./UrlTraits";
export class ObservablePropertyTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Identifier",
        type: "string",
        description: "A string that identifies the property when communicating with the server."
    })
], ObservablePropertyTraits.prototype, "identifier", void 0);
__decorate([
    primitiveTrait({
        name: "Title",
        type: "string",
        description: "A display title."
    })
], ObservablePropertyTraits.prototype, "title", void 0);
__decorate([
    primitiveTrait({
        name: "Units",
        type: "string",
        description: "The unit of the property value"
    })
], ObservablePropertyTraits.prototype, "units", void 0);
__decorate([
    primitiveTrait({
        name: "Default duration",
        type: "string",
        description: "The intervals between observations. eg: 10d - Final character must be s, h, d or y for seconds, hours, days or years."
    })
], ObservablePropertyTraits.prototype, "defaultDuration", void 0);
export class ProcedureTraits extends mixTraits(ObservablePropertyTraits) {
}
export default class SensorObservationCatalogItemTraits extends mixTraits(TableTraits, UrlTraits) {
    constructor() {
        super(...arguments);
        this.requestSizeLimit = 200;
        this.requestNumberLimit = 3;
        this.observableProperties = [];
        this.filterByProcedures = true;
        this.procedures = [];
        this.proceduresName = i18next.t("models.sensorObservationService.procedure");
        this.observablePropertiesName = i18next.t("models.sensorObservationService.property");
        this.showAsChart = false;
    }
}
__decorate([
    primitiveTrait({
        name: "Request size limit",
        type: "number",
        description: "Gets or sets the maximum number of timeseries to request of the server in a single GetObservation request. Servers may have a Response Size Limit, eg. 250. Note the number of responses may be different to the number requested, eg. the BoM server can return > 1 timeseries/feature identifier, (such as ...stations/41001702), so it can be sensible to set this below the response size limit."
    })
], SensorObservationCatalogItemTraits.prototype, "requestSizeLimit", void 0);
__decorate([
    primitiveTrait({
        name: "Request number limit",
        type: "number",
        description: "Gets or sets the maximum number of GetObservation requests that we can fire off at a time. If the response size limit is 250, and this is 4, then observations for at most 1000 features will load. If there are more than 1000 features, they will be shown without observation data, until they are clicked."
    })
], SensorObservationCatalogItemTraits.prototype, "requestNumberLimit", void 0);
__decorate([
    primitiveTrait({
        name: "Request template",
        type: "string",
        description: "The template XML string to POST to the SOS server to query for GetObservation. If this property is undefined, `SensorObservationServiceCatalogItem.defaultRequestTemplate` is used. This is used as a Mustache template. See SensorObservationServiceRequestTemplate.xml for the default. Be careful with newlines inside tags: Mustache can add an extra space in the front of them, which causes the request to fail on the SOS server."
    })
], SensorObservationCatalogItemTraits.prototype, "requestTemplate", void 0);
__decorate([
    objectArrayTrait({
        name: "Observable properties",
        type: ObservablePropertyTraits,
        idProperty: "identifier",
        description: "The sensor observation service observableProperties that the user can choose from for this catalog item."
    })
], SensorObservationCatalogItemTraits.prototype, "observableProperties", void 0);
__decorate([
    primitiveTrait({
        name: "Filter by procedure",
        type: "boolean",
        description: "Whether to include the list of procedures in GetFeatureOfInterest calls, so that only locations that support those procedures are returned. For some servers (such as BoM's Water Data Online), this causes the request to time out."
    })
], SensorObservationCatalogItemTraits.prototype, "filterByProcedures", void 0);
__decorate([
    objectArrayTrait({
        name: "Procedures",
        type: ProcedureTraits,
        idProperty: "identifier",
        description: "The sensor observation service procedures that the user can choose from for this catalog item."
    })
], SensorObservationCatalogItemTraits.prototype, "procedures", void 0);
__decorate([
    primitiveTrait({
        name: "Procedures name",
        type: "string",
        description: "Gets or sets the name seen by the user for the list of procedures. Defaults to `Procedure`, but eg. for BoM, `Frequency` would be better."
    })
], SensorObservationCatalogItemTraits.prototype, "proceduresName", void 0);
__decorate([
    primitiveTrait({
        name: "Observable properties name",
        type: "string",
        description: "Gets or sets the name seen by the user for the list of observable properties. Defaults to `Property`, but eg. for BoM, `Observation type` would be better."
    })
], SensorObservationCatalogItemTraits.prototype, "observablePropertiesName", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Station ID whitelist",
        type: "string",
        description: "If set, an array of IDs. Only station IDs that match these will be included."
    })
], SensorObservationCatalogItemTraits.prototype, "stationIdWhitelist", void 0);
__decorate([
    primitiveArrayTrait({
        name: "Station ID blacklist",
        type: "string",
        description: "If set, an array of IDs. Only station IDs that match these will be included."
    })
], SensorObservationCatalogItemTraits.prototype, "stationIdBlacklist", void 0);
__decorate([
    primitiveTrait({
        name: "Start date",
        type: "string",
        description: "An start date in ISO8601 format. All requests filter to this start date. Set to undefined for no temporal filter."
    })
], SensorObservationCatalogItemTraits.prototype, "startDate", void 0);
__decorate([
    primitiveTrait({
        name: "End date",
        type: "string",
        description: "An end date in ISO8601 format. All requests filter to this end date. Set to undefined to use the current date."
    })
], SensorObservationCatalogItemTraits.prototype, "endDate", void 0);
__decorate([
    primitiveTrait({
        name: "Show as chart",
        type: "boolean",
        description: "When `true`, loads the observation data for charts instead of feature points data to plot on map"
    })
], SensorObservationCatalogItemTraits.prototype, "showAsChart", void 0);
__decorate([
    primitiveTrait({
        name: "Chart feature of interest identifier",
        type: "string",
        description: "The `identifier` of the feature-of-interest for which we are showing the chart."
    })
], SensorObservationCatalogItemTraits.prototype, "chartFeatureOfInterestIdentifier", void 0);
__decorate([
    primitiveTrait({
        name: "Selected observable id",
        type: "string",
        description: "The identifier of the selected observable property"
    })
], SensorObservationCatalogItemTraits.prototype, "selectedObservableId", void 0);
//# sourceMappingURL=SensorObservationCatalogItemTraits.js.map
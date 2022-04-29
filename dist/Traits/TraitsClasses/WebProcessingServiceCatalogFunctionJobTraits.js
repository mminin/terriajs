var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import FeatureInfoTraits from "./FeatureInfoTraits";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import CatalogFunctionJobTraits from "./CatalogFunctionJobTraits";
import WebProcessingServiceCatalogFunctionTraits from "./WebProcessingServiceCatalogFunctionTraits";
export class WPSParameterTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Input Identifier",
        description: "WPS input parameter identifier"
    })
], WPSParameterTraits.prototype, "inputIdentifier", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Input Value",
        description: "WPS input parameter value"
    })
], WPSParameterTraits.prototype, "inputValue", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Input Type",
        description: "WPS input parameter type"
    })
], WPSParameterTraits.prototype, "inputType", void 0);
export default class WebProcessingServiceCatalogJobTraits extends mixTraits(FeatureInfoTraits, CatalogFunctionJobTraits, WebProcessingServiceCatalogFunctionTraits) {
}
__decorate([
    objectArrayTrait({
        type: WPSParameterTraits,
        idProperty: "inputIdentifier",
        name: "Parameters",
        description: "Parameter names & values for this result item"
    })
], WebProcessingServiceCatalogJobTraits.prototype, "wpsParameters", void 0);
__decorate([
    anyTrait({
        name: "WPS Response",
        description: "The WPS response object"
    })
], WebProcessingServiceCatalogJobTraits.prototype, "wpsResponse", void 0);
__decorate([
    anyTrait({
        name: "Geojson features",
        description: "Geojson feature collection of input features."
    })
], WebProcessingServiceCatalogJobTraits.prototype, "geojsonFeatures", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "WPS response URL",
        description: "WPS response URL"
    })
], WebProcessingServiceCatalogJobTraits.prototype, "wpsResponseUrl", void 0);
//# sourceMappingURL=WebProcessingServiceCatalogFunctionJobTraits.js.map
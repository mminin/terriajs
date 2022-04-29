var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import ModelTraits from "../ModelTraits";
import UrlTraits from "./UrlTraits";
export class QueryParamTraits extends ModelTraits {
}
__decorate([
    primitiveTrait({
        name: "Parameter name",
        type: "string",
        description: "The name of the query parameter."
    })
], QueryParamTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        name: "Parameter value",
        type: "string",
        description: "The value of the query parameter. Parameter values starting with" +
            " `DATE!`, eg. `DATE!HH:MM`, will be replaced wih the current date and" +
            " time, formatted according to the format string following the `!`." +
            " For more information on the format string format, see the " +
            " [dateformat](https://github.com/felixge/node-dateformat) library."
    })
], QueryParamTraits.prototype, "value", void 0);
/** Not all traits here will be supported by all catalog items that use them */
export default class ApiRequestTraits extends mixTraits(UrlTraits) {
    constructor() {
        super(...arguments);
        this.queryParameters = [];
        this.updateQueryParameters = [];
        this.postRequestDataAsFormData = false;
    }
}
__decorate([
    objectArrayTrait({
        name: "Query parameters",
        type: QueryParamTraits,
        description: "Query parameters to supply to the API",
        idProperty: "name"
    })
], ApiRequestTraits.prototype, "queryParameters", void 0);
__decorate([
    objectArrayTrait({
        name: "Query parameters for updates",
        type: QueryParamTraits,
        description: "Query parameters to supply to the API on subsequent calls after the first call.",
        idProperty: "name"
    })
], ApiRequestTraits.prototype, "updateQueryParameters", void 0);
__decorate([
    anyTrait({
        name: "Request body",
        description: "JSON body to be sent with the HTTP request to the server. If provided, the request will be made as POST rather than a GET."
    })
], ApiRequestTraits.prototype, "requestData", void 0);
__decorate([
    primitiveTrait({
        name: "POST as form data",
        type: "boolean",
        description: "Send the request data as form data instead of a JSON body."
    })
], ApiRequestTraits.prototype, "postRequestDataAsFormData", void 0);
__decorate([
    primitiveTrait({
        name: "Response data path",
        type: "string",
        description: "Path to relevent data in JSON response."
    })
], ApiRequestTraits.prototype, "responseDataPath", void 0);
//# sourceMappingURL=ApiRequestTraits.js.map
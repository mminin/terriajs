var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import anyTrait from "../Decorators/anyTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import ModelTraits from "../ModelTraits";
export class FeatureInfoTemplateTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.showFeatureInfoDownloadWithTemplate = false;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Name template",
        description: "A mustache template string for formatting name"
    })
], FeatureInfoTemplateTraits.prototype, "name", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Template",
        description: "A Mustache template string for formatting description",
        isNullable: false
    })
], FeatureInfoTemplateTraits.prototype, "template", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Show feature info download",
        description: "Show feature info download **if** a `template` has been provided. If no `template` is provided, then download will always show.",
        isNullable: false
    })
], FeatureInfoTemplateTraits.prototype, "showFeatureInfoDownloadWithTemplate", void 0);
__decorate([
    anyTrait({
        name: "Partials",
        description: "An object, mapping partial names to a template string. Defines the partials used in Template."
    })
], FeatureInfoTemplateTraits.prototype, "partials", void 0);
__decorate([
    anyTrait({
        name: "Formats",
        description: "An object, mapping field names to formatting options."
    })
], FeatureInfoTemplateTraits.prototype, "formats", void 0);
/** Note: MappableTraits has the following:
 * - featureInfoTemplate
 * - showStringIfPropertyValueIsNull
 *
 * FeatureInfoUrlTemplateTraits is used by FeatureInfoUrlTemplateMixin
 */
export default class FeatureInfoUrlTemplateTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.maxRequests = 10;
    }
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Feature Info Url template",
        description: "A template URL string for fetching feature info. Template values of the form {x} will be replaced with corresponding property values from the picked feature."
    })
], FeatureInfoUrlTemplateTraits.prototype, "featureInfoUrlTemplate", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Max feature request",
        description: "Max number of feature info requests to send to API url. Keep this number small to avoid sending to many requests to server (default 10)."
    })
], FeatureInfoUrlTemplateTraits.prototype, "maxRequests", void 0);
//# sourceMappingURL=FeatureInfoTraits.js.map
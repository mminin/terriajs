var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import ModelTraits from "../ModelTraits";
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import anyTrait from "../Decorators/anyTrait";
class FeatureInfoFormatTraits extends ModelTraits {
    constructor() {
        super(...arguments);
        this.maximumFractionDigits = 20;
        this.minimumFractionDigits = 0;
        this.useGrouping = true;
    }
}
__decorate([
    primitiveTrait({
        type: "number",
        name: "Maximum Fraction Digits",
        description: "To reduce the number of decimal places to a maximum of X digits."
    })
], FeatureInfoFormatTraits.prototype, "maximumFractionDigits", void 0);
__decorate([
    primitiveTrait({
        type: "number",
        name: "Minimum Fraction Digits",
        description: "To increase the number of decimal places to a minimum of X digits."
    })
], FeatureInfoFormatTraits.prototype, "minimumFractionDigits", void 0);
__decorate([
    primitiveTrait({
        type: "boolean",
        name: "Use grouping",
        description: "To show thousands separators"
    })
], FeatureInfoFormatTraits.prototype, "useGrouping", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Type",
        description: "Set to 'datetime' if you want to format as a date time"
    })
], FeatureInfoFormatTraits.prototype, "type", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Datetime format",
        description: "A date format style using the npm dateformat package, e.g. 'dd-mm-yyyy HH:MM:ss' or 'isoDateTime'"
    })
], FeatureInfoFormatTraits.prototype, "format", void 0);
export class FeatureInfoTemplateTraits extends ModelTraits {
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
export default class FeatureInfoTraits extends ModelTraits {
}
__decorate([
    objectTrait({
        type: FeatureInfoTemplateTraits,
        name: "Feature info template",
        description: "A template object for formatting content in feature info panel"
    })
], FeatureInfoTraits.prototype, "featureInfoTemplate", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Feature Info Url template",
        description: "A template URL string for fetching feature info. Template values of the form {x} will be replaced with corresponding property values from the picked feature."
    })
], FeatureInfoTraits.prototype, "featureInfoUrlTemplate", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Show string if property value is null",
        description: "If the value of a property is null or undefined, show the specified string as the value of the property. Otherwise, the property name will not be listed at all."
    })
], FeatureInfoTraits.prototype, "showStringIfPropertyValueIsNull", void 0);
//# sourceMappingURL=FeatureInfoTraits.js.map
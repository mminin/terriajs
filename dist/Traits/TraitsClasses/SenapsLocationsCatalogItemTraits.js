var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import MappableTraits from "./MappableTraits";
import SplitterTraits from "./SplitterTraits";
import StyleTraits from "./StyleTraits";
import UrlTraits from "./UrlTraits";
export default class SenapsLocationsCatalogItemTraits extends mixTraits(SplitterTraits, MappableTraits, CatalogMemberTraits, LegendOwnerTraits, UrlTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Location ID Filter",
        description: `
    A string to filter locations using the id field, locations matching the filter will be included,
    multiple filters can be seperated using a comma, eg "*boorowa*,*environdata*"
    `
    })
], SenapsLocationsCatalogItemTraits.prototype, "locationIdFilter", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Stream ID Filter",
        description: `
    A string to filter streams using the id field, streams matching the filter will be included,
    multiple filters can be seperated using a comma, eg "*SHT31DIS_ALL*,*environdata*"
    `
    })
], SenapsLocationsCatalogItemTraits.prototype, "streamIdFilter", void 0);
__decorate([
    objectTrait({
        type: StyleTraits,
        name: "Style",
        description: "Styling rules that follow [simplestyle-spec](https://github.com/mapbox/simplestyle-spec)"
    })
], SenapsLocationsCatalogItemTraits.prototype, "style", void 0);
//# sourceMappingURL=SenapsLocationsCatalogItemTraits.js.map
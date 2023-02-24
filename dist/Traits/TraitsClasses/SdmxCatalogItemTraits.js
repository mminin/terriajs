var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import EnumDimensionTraits from "./DimensionTraits";
import LegendOwnerTraits from "./FeatureInfoTraits";
import SdmxCommonTraits from "./SdmxCommonTraits";
import TableTraits from "./Table/TableTraits";
import UrlTraits from "./UrlTraits";
export class SdmxDimensionTraits extends mixTraits(EnumDimensionTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Position",
        description: "The position attribute specifies the position of the dimension in the data structure definition, starting at 0. This is important for making sdmx-csv requests"
    })
], SdmxDimensionTraits.prototype, "position", void 0);
export default class SdmxCatalogItemTraits extends mixTraits(SdmxCommonTraits, UrlTraits, TableTraits, LegendOwnerTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Dataflow ID",
        description: "SDMX Dataflow ID"
    })
], SdmxCatalogItemTraits.prototype, "dataflowId", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Agency ID",
        description: "SDMX Agency ID"
    })
], SdmxCatalogItemTraits.prototype, "agencyId", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Unit Measure",
        description: "This string is essentially 'units' for the dataset. If a UNIT_MEASURE SDMX attribute exists in this dataflow, the default `unitMeasure` will be determined from it."
    })
], SdmxCatalogItemTraits.prototype, "unitMeasure", void 0);
__decorate([
    objectArrayTrait({
        type: SdmxDimensionTraits,
        name: "Dimensions",
        description: "Dimensions",
        idProperty: "id"
    })
], SdmxCatalogItemTraits.prototype, "dimensions", void 0);
//# sourceMappingURL=SdmxCatalogItemTraits.js.map
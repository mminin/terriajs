var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import objectTrait from "../Decorators/objectTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import mixTraits from "../mixTraits";
import AutoRefreshingTraits from "./AutoRefreshingTraits";
import CatalogMemberTraits from "./CatalogMemberTraits";
import EnumDimensionTraits from "./DimensionTraits";
import FeatureInfoUrlTemplateTraits from "./FeatureInfoTraits";
import LegendOwnerTraits from "./LegendOwnerTraits";
import TableTraits from "./Table/TableTraits";
import UrlTraits from "./UrlTraits";
export default class OpenDataSoftCatalogItemTraits extends mixTraits(AutoRefreshingTraits, TableTraits, FeatureInfoUrlTemplateTraits, UrlTraits, CatalogMemberTraits, LegendOwnerTraits) {
}
__decorate([
    primitiveTrait({
        type: "string",
        name: "Dataset ID",
        description: "OpenDataSoft Dataset id (`dataset_id`)."
    })
], OpenDataSoftCatalogItemTraits.prototype, "datasetId", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Geo point 2d field name",
        description: "Field to use as geo point 2d (i.e. lat long)."
    })
], OpenDataSoftCatalogItemTraits.prototype, "geoPoint2dFieldName", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Datetime field name",
        description: "Field to use as datetime."
    })
], OpenDataSoftCatalogItemTraits.prototype, "timeFieldName", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Color field name",
        description: "Field to use as color."
    })
], OpenDataSoftCatalogItemTraits.prototype, "colorFieldName", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Region field name",
        description: "Field to use as region mapping."
    })
], OpenDataSoftCatalogItemTraits.prototype, "regionFieldName", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Select field",
        description: "Names of fields to 'select' when downloading data"
    })
], OpenDataSoftCatalogItemTraits.prototype, "selectFields", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Group by field",
        description: "Names of fields to 'groupBy' when downloading data"
    })
], OpenDataSoftCatalogItemTraits.prototype, "groupByFields", void 0);
__decorate([
    objectTrait({
        type: EnumDimensionTraits,
        name: "Available fields",
        description: "Names of fields which can be 'selected'"
    })
], OpenDataSoftCatalogItemTraits.prototype, "availableFields", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Aggregate time values",
        description: "Aggregate time values (eg 1 day). See https://help.opendatasoft.com/apis/ods-search-v2/#group-by-clause"
    })
], OpenDataSoftCatalogItemTraits.prototype, "aggregateTime", void 0);
__decorate([
    primitiveTrait({
        type: "string",
        name: "Refresh interval template",
        description: 'Template used to calculate refresh interval based on Opendatasoft dataset object. This template is rendered using dataset JSON object as view. For example `"{{metas.custom.update-frequency}}"` will use `"update-frequency"` custom metadata property. This supports "human readable" time strings - for example "15 minutes" and "60 sec".'
    })
], OpenDataSoftCatalogItemTraits.prototype, "refreshIntervalTemplate", void 0);
//# sourceMappingURL=OpenDataSoftCatalogItemTraits.js.map
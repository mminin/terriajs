import { ApiTableCatalogItem } from "../../Models/Catalog/CatalogItems/ApiTableCatalogItem";
import CommonStrata from "../../Models/Definition/CommonStrata";
import updateModelFromJson from "../../Models/Definition/updateModelFromJson";
import ChartCustomComponent from "./ChartCustomComponent";
export default class ApiTableChartCustomComponent extends ChartCustomComponent {
    get name() {
        return "api-chart";
    }
    get attributes() {
        return ["api-table-catalog-item-json"];
    }
    constructCatalogItem(id, context, sourceReference) {
        var _a;
        const terria = context.terria;
        // This differs from other custom in that if a catalog item with the same id has already been created, it'll return that rather than a new one
        // This is required for the `updateModelFromJson` call in `setTraitsFromAttrs` to work
        const existingModel = id
            ? (_a = context.terria) === null || _a === void 0 ? void 0 : _a.getModelById(ApiTableCatalogItem, id) : undefined;
        if (terria && existingModel === undefined) {
            return new ApiTableCatalogItem(id, terria);
        }
        return existingModel;
    }
    setTraitsFromAttrs(item, attrs, sourceIndex) {
        const json = attrs.apiTableCatalogItemJson;
        if (json === undefined) {
            return;
        }
        json.id = item.uniqueId;
        updateModelFromJson(item, CommonStrata.definition, json, true).logError("Error ocurred while updating ApiTableChartCustomComponent model from JSON");
    }
    parseNodeAttrs(nodeAttrs) {
        const parsed = super.parseNodeAttrs(nodeAttrs);
        const jsonAttr = nodeAttrs["api-table-catalog-item-json"];
        if (jsonAttr === undefined) {
            return parsed;
        }
        try {
            parsed.apiTableCatalogItemJson = JSON.parse(jsonAttr);
        }
        catch (e) {
            console.error("Couldn't parse json for ApiTableChartCustomComponent");
        }
        return parsed;
    }
}
//# sourceMappingURL=ApiTableCustomComponent.js.map
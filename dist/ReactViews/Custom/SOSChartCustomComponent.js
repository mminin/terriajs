import createGuid from "terriajs-cesium/Source/Core/createGuid";
import CommonStrata from "../../Models/Definition/CommonStrata";
import ChartCustomComponent from "./ChartCustomComponent";
export default class SOSChartCustomComponent extends ChartCustomComponent {
    constructor() {
        super(...arguments);
        this.constructShareableCatalogItem = async (id, context, sourceReference) => this.createItemReference(context.catalogItem);
    }
    get name() {
        return "sos-chart";
    }
    get attributes() {
        let attributes = super.attributes;
        attributes.push("name");
        return attributes;
    }
    constructCatalogItem(id, context, sourceReference) {
        var _a;
        return (_a = context.catalogItem) === null || _a === void 0 ? void 0 : _a.duplicateModel(createGuid());
    }
    setTraitsFromAttrs(item, attrs, sourceIndex) {
        var _a, _b;
        const featureOfInterestId = attrs.identifier;
        const featureName = attrs.name;
        const units = (_a = item.selectedObservable) === null || _a === void 0 ? void 0 : _a.units;
        item.setTrait(CommonStrata.user, "showAsChart", true);
        item.setTrait(CommonStrata.user, "name", featureName || item.name);
        item.setTrait(CommonStrata.user, "chartFeatureOfInterestIdentifier", featureOfInterestId);
        (_b = item
            .addObject(CommonStrata.user, "columns", "values")) === null || _b === void 0 ? void 0 : _b.setTrait(CommonStrata.user, "units", units);
    }
    parseNodeAttrs(nodeAttrs) {
        const parsed = super.parseNodeAttrs(nodeAttrs);
        parsed.name = nodeAttrs["name"];
        return parsed;
    }
}
//# sourceMappingURL=SOSChartCustomComponent.js.map
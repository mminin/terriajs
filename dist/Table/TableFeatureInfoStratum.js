var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import LoadableStratum from "../Models/Definition/LoadableStratum";
import TableTraits from "../Traits/TraitsClasses/Table/TableTraits";
import { computed } from "mobx";
import createStratumInstance from "../Models/Definition/createStratumInstance";
import { FeatureInfoTemplateTraits } from "../Traits/TraitsClasses/FeatureInfoTraits";
import StratumOrder from "../Models/Definition/StratumOrder";
export default class TableFeatureInfoStratum extends LoadableStratum(TableTraits) {
    constructor(catalogItem) {
        super();
        this.catalogItem = catalogItem;
    }
    static load(item) {
        return new TableFeatureInfoStratum(item);
    }
    duplicateLoadableStratum(newModel) {
        return new TableFeatureInfoStratum(newModel);
    }
    get featureInfoTemplate() {
        var _a;
        let template = '<table class="cesium-infoBox-defaultTable">';
        template += (_a = this.catalogItem.tableColumns) === null || _a === void 0 ? void 0 : _a.map((col) => `<tr><td style="vertical-align: middle"><b>${col.title}</b></td><td>{{${col.name}}}</td></tr>`).join("");
        // See tableFeatureInfoContext for how timeSeries chart is generated
        template += `</table>{{terria.timeSeries.chart}}`;
        return createStratumInstance(FeatureInfoTemplateTraits, {
            template,
            showFeatureInfoDownloadWithTemplate: true
        });
    }
}
TableFeatureInfoStratum.stratumName = "tableFeatureInfo";
__decorate([
    computed
], TableFeatureInfoStratum.prototype, "featureInfoTemplate", null);
StratumOrder.addLoadStratum(TableFeatureInfoStratum.stratumName);
//# sourceMappingURL=TableFeatureInfoStratum.js.map
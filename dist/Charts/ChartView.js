var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import ChartableMixin, { axesMatch } from "../ModelMixins/ChartableMixin";
/**
 * Derives a consistent view of chart data from all the chartable items in the
 * workbench.
 */
export default class ChartView {
    constructor(terria) {
        this.terria = terria;
    }
    get chartableItems() {
        return (this.terria.workbench.items.filter(item => ChartableMixin.isMixedInto(item) && item.chartItems.length > 0));
    }
    /**
     * Returns the common x-axis for the chart.
     */
    get xAxis() {
        // We just return the xAxis of the first chartItem selected in the workbench.
        for (let i = 0; i < this.chartableItems.length; i++) {
            for (let j = 0; j < this.chartableItems[i].chartItems.length; j++) {
                const chartItem = this.chartableItems[i].chartItems[j];
                if (chartItem.isSelectedInWorkbench && chartItem.showInChartPanel) {
                    return chartItem.xAxis;
                }
            }
        }
        return undefined;
    }
    /**
     * Returns chartItems for all chartable items in the workbench.
     *
     * Sets flags for how the chart items are displayed in the workbench and
     * in the chart panel.
     */
    get chartItems() {
        return this.chartableItems.reduce((acc, item) => {
            return acc.concat(item.chartItems.map(chartItem => {
                if (this.xAxis && !axesMatch(this.xAxis, chartItem.xAxis)) {
                    chartItem = {
                        ...chartItem,
                        isSelectedInWorkbench: false,
                        showInChartPanel: false
                    };
                }
                return chartItem;
            }));
        }, []);
    }
}
__decorate([
    computed
], ChartView.prototype, "chartableItems", null);
__decorate([
    computed
], ChartView.prototype, "xAxis", null);
__decorate([
    computed
], ChartView.prototype, "chartItems", null);
//# sourceMappingURL=ChartView.js.map
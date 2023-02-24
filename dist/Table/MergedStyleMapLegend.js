var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed } from "mobx";
import isDefined from "../Core/isDefined";
import createStratumInstance from "../Models/Definition/createStratumInstance";
import LoadableStratum from "../Models/Definition/LoadableStratum";
import LegendTraits, { LegendItemTraits } from "../Traits/TraitsClasses/LegendTraits";
/** Merge all legend items in legends - by legend.title */
export class MergedStyleMapLegend extends LoadableStratum(LegendTraits) {
    constructor(legends, legendItemOverrides = {}) {
        super();
        this.legends = legends;
        this.legendItemOverrides = legendItemOverrides;
    }
    duplicateLoadableStratum(newModel) {
        return new MergedStyleMapLegend(this.legends);
    }
    get title() {
        var _a;
        return (_a = this.legends.find((l) => l.title)) === null || _a === void 0 ? void 0 : _a.title;
    }
    get items() {
        let items = [];
        // Merge all Legend items by title
        this.legends.forEach((legend) => {
            var _a;
            (_a = legend.items) === null || _a === void 0 ? void 0 : _a.forEach((currentItem) => {
                const existingItemIndex = items.findIndex((item) => item.title && item.title === currentItem.title);
                const existingItem = items[existingItemIndex];
                if (!existingItem) {
                    items.push(createStratumInstance(LegendItemTraits, {
                        ...this.legendItemOverrides,
                        ...currentItem
                    }));
                }
                else {
                    items[existingItemIndex] = {
                        ...this.legendItemOverrides,
                        ...existingItem,
                        ...Object.entries(currentItem).reduce((acc, [key, value]) => {
                            if (isDefined(value)) {
                                acc[key] = value;
                            }
                            return acc;
                        }, {})
                    };
                }
            });
        });
        return items;
    }
}
__decorate([
    computed
], MergedStyleMapLegend.prototype, "title", null);
__decorate([
    computed
], MergedStyleMapLegend.prototype, "items", null);
//# sourceMappingURL=MergedStyleMapLegend.js.map
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import ChartView from "../../../Charts/ChartView";
import ChartableMixin, { axesMatch } from "../../../ModelMixins/ChartableMixin";
import Icon from "../../../Styled/Icon";
import Styles from "./chart-item-selector.scss";
export const ChartItem = observer(({ item, chartItem }) => {
    const lineColor = chartItem.isSelectedInWorkbench
        ? chartItem.getColor()
        : "#fff";
    const colorStyle = lineColor && { color: lineColor };
    const fillStyle = lineColor && { fill: lineColor };
    const toggleActive = () => {
        const catalogItem = chartItem.item;
        runInAction(() => {
            const shouldSelect = !chartItem.isSelectedInWorkbench;
            chartItem.updateIsSelectedInWorkbench(shouldSelect);
            if (shouldSelect) {
                unselectChartItemsWithXAxisNotMatching(catalogItem.terria.workbench.items, chartItem.xAxis);
            }
        });
    };
    return (React.createElement("div", null,
        React.createElement("button", { type: "button", onClick: toggleActive, style: colorStyle, className: Styles.button, title: "select variable" },
            chartItem.isSelectedInWorkbench && (React.createElement(Icon, { style: fillStyle, glyph: Icon.GLYPHS.checkboxOn })),
            !chartItem.isSelectedInWorkbench && (React.createElement(Icon, { style: fillStyle, glyph: Icon.GLYPHS.checkboxOff }))),
        React.createElement("span", null, chartItem.name)));
});
const ChartItemSelector = observer(function ({ item }) {
    const chartView = new ChartView(item.terria);
    // We don't need to show selectors for moment datasets. They are part of
    // discretelytimevarying items and have a separate chart button to enable/disable.
    const chartItems = chartView.chartItems
        .filter(c => c.item === item)
        .filter(c => c.type !== "momentPoints" && c.type !== "momentLines")
        .sort((a, b) => (a.name >= b.name ? 1 : -1));
    return (React.createElement("ul", { className: Styles.root },
        React.createElement(For, { each: "chartItem", index: "i", of: chartItems },
            React.createElement("li", { key: `li-${chartItem.key}`, className: Styles.item },
                React.createElement(ChartItem, { chartItem: chartItem })))));
});
ChartItemSelector.propTypes = {
    item: PropTypes.object.isRequired
};
function unselectChartItemsWithXAxisNotMatching(items, requiredAxis) {
    items.forEach(item => {
        if (ChartableMixin.isMixedInto(item)) {
            item.chartItems.forEach(chartItem => {
                if (!axesMatch(chartItem.xAxis, requiredAxis)) {
                    chartItem.updateIsSelectedInWorkbench(false);
                }
            });
        }
    });
}
export default ChartItemSelector;
//# sourceMappingURL=ChartItemSelector.js.map
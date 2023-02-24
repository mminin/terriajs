import { observer } from "mobx-react";
import React from "react";
import ChartView from "../../Charts/ChartView";
import filterOutUndefined from "../../Core/filterOutUndefined";
import hasTraits from "../../Models/Definition/hasTraits";
import DiscretelyTimeVaryingTraits from "../../Traits/TraitsClasses/DiscretelyTimeVaryingTraits";
import parseCustomHtmlToReact from "../Custom/parseCustomHtmlToReact";
import Box from "../../Styled/Box";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
const ChartDisclaimer = ({ terria }) => {
    const chartView = new ChartView(terria);
    const uniqueChartDisclaimers = [
        ...new Set(filterOutUndefined(chartView.chartItems.map((chartItem) => chartItem.showInChartPanel &&
            hasTraits(chartItem.item, DiscretelyTimeVaryingTraits, "chartDisclaimer")
            ? chartItem.item.chartDisclaimer
            : undefined)))
    ];
    if (uniqueChartDisclaimers.length === 0)
        return null;
    return (React.createElement(Box, { backgroundColor: "#9a4b4b", column: true, paddedHorizontally: 2, css: `
        a,
        a:visited {
          color: white;
        }
      ` },
        React.createElement(Spacing, { bottom: 2 }),
        uniqueChartDisclaimers.map((chartDisclaimer) => (React.createElement(React.Fragment, { key: chartDisclaimer },
            React.createElement(Text, { textLight: true }, parseCustomHtmlToReact(chartDisclaimer)),
            React.createElement(Spacing, { bottom: 2 }))))));
};
export default observer(ChartDisclaimer);
//# sourceMappingURL=ChartDisclaimer.js.map
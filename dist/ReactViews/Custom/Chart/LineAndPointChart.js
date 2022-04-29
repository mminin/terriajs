import PropTypes from "prop-types";
import React from "react";
import LineChart from "./LineChart";
import MomentPointsChart from "./MomentPointsChart";
/**
 * A line chart, where each data point is represented by a circle, and a line is
 * drawn between each point.
 */
export default class LineAndPointChart extends React.PureComponent {
    constructor() {
        super();
        this.lineRef = React.createRef();
        this.pointRef = React.createRef();
    }
    doZoom(scales) {
        this.lineRef.current.doZoom(scales);
        this.pointRef.current.doZoom(scales);
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(LineChart, { ref: this.lineRef, chartItem: this.props.chartItem, scales: this.props.scales, color: this.props.color, id: this.props.id + "-line" }),
            React.createElement(MomentPointsChart, { ref: this.pointRef, id: this.props.id + "-point", chartItem: this.props.chartItem, scales: this.props.scales, glyph: this.props.glyph })));
    }
}
LineAndPointChart.propTypes = {
    id: PropTypes.string.isRequired,
    chartItem: PropTypes.object.isRequired,
    scales: PropTypes.object.isRequired,
    color: PropTypes.string,
    glyph: PropTypes.string
};
//# sourceMappingURL=LineAndPointChart.js.map
import { LinePath } from "@visx/shape";
import { line } from "d3-shape";
import PropTypes from "prop-types";
import React from "react";
export default class LineChart extends React.PureComponent {
    doZoom(scales) {
        const el = document.querySelector(`#${this.props.id} path`);
        if (!el)
            return;
        const { chartItem } = this.props;
        const path = line()
            .x(p => scales.x(p.x))
            .y(p => scales.y(p.y));
        el.setAttribute("d", path(chartItem.points));
    }
    render() {
        const { chartItem, scales, color } = this.props;
        const stroke = color || chartItem.getColor();
        return (React.createElement("g", { id: this.props.id },
            React.createElement(LinePath, { data: chartItem.points, x: p => scales.x(p.x), y: p => scales.y(p.y), stroke: stroke, strokeWidth: 2 })));
    }
}
LineChart.propTypes = {
    id: PropTypes.string.isRequired,
    chartItem: PropTypes.object.isRequired,
    scales: PropTypes.object.isRequired,
    color: PropTypes.string
};
//# sourceMappingURL=LineChart.js.map
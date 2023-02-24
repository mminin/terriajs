var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LinePath } from "@visx/shape";
import { line } from "d3-shape";
import PropTypes from "prop-types";
import React from "react";
import { observer } from "mobx-react";
let LineChart = class LineChart extends React.PureComponent {
    doZoom(scales) {
        const el = document.querySelector(`#${this.props.id} path`);
        if (!el)
            return;
        const { chartItem } = this.props;
        const path = line()
            .x((p) => scales.x(p.x))
            .y((p) => scales.y(p.y));
        el.setAttribute("d", path(chartItem.points));
    }
    render() {
        const { chartItem, scales, color } = this.props;
        const stroke = color || chartItem.getColor();
        return (React.createElement("g", { id: this.props.id },
            React.createElement(LinePath, { data: chartItem.points, x: (p) => scales.x(p.x), y: (p) => scales.y(p.y), stroke: stroke, strokeWidth: 2 })));
    }
};
LineChart.propTypes = {
    id: PropTypes.string.isRequired,
    chartItem: PropTypes.object.isRequired,
    scales: PropTypes.object.isRequired,
    color: PropTypes.string
};
LineChart = __decorate([
    observer
], LineChart);
export default LineChart;
//# sourceMappingURL=LineChart.js.map
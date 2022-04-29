var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observer } from "mobx-react";
import { Line } from "@visx/shape";
import PropTypes from "prop-types";
import React from "react";
let MomentLines = class MomentLines extends React.Component {
    doZoom(scales) {
        const lines = document.querySelectorAll(`g#${this.props.id} line`);
        lines.forEach((line, i) => {
            const point = this.props.chartItem.points[i];
            if (point) {
                const x = scales.x(point.x);
                line.setAttribute("x1", x);
                line.setAttribute("x2", x);
            }
        });
    }
    render() {
        const { id, chartItem, scales } = this.props;
        const baseKey = `moment-line-${chartItem.categoryName}-${chartItem.name}`;
        return (React.createElement("g", { id: id }, chartItem.points.map((p, i) => {
            const x = scales.x(p.x);
            const y = scales.y(0);
            return (React.createElement(Line, { key: `${baseKey}-${i}`, from: { x, y: 0 }, to: { x, y }, stroke: chartItem.getColor(), strokeWidth: 3, opacity: p.isSelected ? 1.0 : 0.3, pointerEvents: "all", cursor: "pointer", onClick: () => chartItem.onClick(p) }));
        })));
    }
};
MomentLines.propTypes = {
    id: PropTypes.string.isRequired,
    chartItem: PropTypes.object.isRequired,
    scales: PropTypes.object.isRequired
};
MomentLines = __decorate([
    observer
], MomentLines);
export default MomentLines;
//# sourceMappingURL=MomentLinesChart.js.map
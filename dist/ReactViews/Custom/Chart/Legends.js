var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import PropTypes from "prop-types";
import React from "react";
import { scaleOrdinal } from "@visx/scale";
import { LegendOrdinal } from "@visx/legend";
import Glyphs from "./Glyphs";
import { GlyphCircle } from "@visx/glyph";
import { TextSpan } from "../../../Styled/Text";
import styled from "styled-components";
import { observer } from "mobx-react";
let Legends = class Legends extends React.PureComponent {
    render() {
        const chartItems = this.props.chartItems;
        const colorScale = scaleOrdinal({
            domain: chartItems.map((c) => `${c.categoryName} ${c.name}`),
            range: chartItems.map((c) => c.getColor())
        });
        return (React.createElement(LegendsContainer, { style: { maxWidth: this.props.width } },
            React.createElement(LegendOrdinal, { scale: colorScale }, (labels) => labels.map((label, i) => {
                var _a, _b;
                return (React.createElement(Legend, { key: `legend-${label.text}`, label: label, glyph: (_b = (_a = chartItems[i]) === null || _a === void 0 ? void 0 : _a.glyphStyle) !== null && _b !== void 0 ? _b : "circle" }));
            }))));
    }
};
Legends.propTypes = {
    chartItems: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired
};
Legends.maxHeightPx = 33;
Legends = __decorate([
    observer
], Legends);
export default Legends;
class Legend extends React.PureComponent {
    render() {
        var _a;
        const label = this.props.label;
        const squareSize = 20;
        const Glyph = (_a = Glyphs[this.props.glyph]) !== null && _a !== void 0 ? _a : GlyphCircle;
        return (React.createElement(LegendWrapper, { title: label.text, ariaLabel: label.text },
            React.createElement("svg", { width: `${squareSize}px`, height: `${squareSize}px`, style: { flexShrink: 0 } },
                React.createElement(Glyph, { top: 10, left: 10, fill: label.value, size: 100 })),
            React.createElement(LegendText, null, label.text)));
    }
}
Legend.propTypes = {
    label: PropTypes.object.isRequired,
    glyph: PropTypes.string
};
const LegendsContainer = styled.div `
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto;
  padding: 7px;
  font-size: 0.8em;
`;
const LegendWrapper = styled.div `
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-width: 0px;
`;
const LegendText = styled(TextSpan).attrs({
    noWrap: true,
    overflowEllipsis: true,
    overflowHide: true,
    medium: true
}) `
  margin-left: 4px;
`;
//# sourceMappingURL=Legends.js.map
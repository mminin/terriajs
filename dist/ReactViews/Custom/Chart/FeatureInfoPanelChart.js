var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { withParentSize } from "@vx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { computed } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import ChartableMixin from "../../../ModelMixins/ChartableMixin";
import Styles from "./chart-preview.scss";
import LineChart from "./LineChart";
import styled from "styled-components";
import i18next from "i18next";
let FeatureInfoPanelChart = class FeatureInfoPanelChart extends React.Component {
    get chartItem() {
        return this.props.item.chartItems.find(chartItem => chartItem.type === "line" || chartItem.type === "lineAndPoint");
    }
    async componentDidUpdate() {
        (await this.props.item.loadMapItems()).raiseError(this.props.item.terria, {
            message: `Failed to load chart for ${this.props.item.name}`,
            importance: -1
        });
    }
    async componentDidMount() {
        (await this.props.item.loadMapItems()).raiseError(this.props.item.terria, {
            message: `Failed to load chart for ${this.props.item.name}`,
            importance: -1
        });
    }
    render() {
        const catalogItem = this.props.item;
        const height = this.props.height || this.props.parentHeight;
        const width = this.props.width || this.props.parentWidth;
        if (!ChartableMixin.isMixedInto(catalogItem)) {
            return (React.createElement(ChartStatusText, { width: width, height: height }, i18next.t("chart.noData")));
        }
        else if (!this.chartItem && catalogItem.isLoadingMapItems) {
            return (React.createElement(ChartStatusText, { width: width, height: height }, i18next.t("chart.loading")));
        }
        else if (!this.chartItem || this.chartItem.points.length === 0) {
            return (React.createElement(ChartStatusText, { width: width, height: height }, i18next.t("chart.noData")));
        }
        return (React.createElement("div", { className: Styles.previewChart },
            React.createElement(Chart, { width: width, height: height, margin: this.props.margin, chartItem: this.chartItem, baseColor: this.props.baseColor, xAxisLabel: this.props.xAxisLabel })));
    }
};
FeatureInfoPanelChart.propTypes = {
    parentWidth: PropTypes.number,
    parentHeight: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number.isRequired,
    margin: PropTypes.object,
    item: PropTypes.object.isRequired,
    xAxisLabel: PropTypes.string,
    baseColor: PropTypes.string
};
FeatureInfoPanelChart.defaultProps = {
    parentWidth: 0,
    parentHeight: 0,
    baseColor: "#efefef",
    margin: { top: 5, left: 5, right: 5, bottom: 5 }
};
__decorate([
    computed
], FeatureInfoPanelChart.prototype, "chartItem", null);
FeatureInfoPanelChart = __decorate([
    withParentSize,
    observer
], FeatureInfoPanelChart);
let Chart = class Chart extends React.Component {
    constructor() {
        super(...arguments);
        this.xAxisHeight = 30;
        this.yAxisWidth = 10;
    }
    get plot() {
        const { width, height, margin } = this.props;
        return {
            width: width - margin.left - margin.right,
            height: height - margin.top - margin.bottom - this.xAxisHeight
        };
    }
    get scales() {
        const chartItem = this.props.chartItem;
        const xScaleParams = {
            domain: chartItem.domain.x,
            range: [this.props.margin.left + this.yAxisWidth, this.plot.width]
        };
        const yScaleParams = {
            domain: chartItem.domain.y,
            range: [this.plot.height, 0]
        };
        return {
            x: chartItem.xAxis.scale === "linear"
                ? scaleLinear(xScaleParams)
                : scaleTime(xScaleParams),
            y: scaleLinear(yScaleParams)
        };
    }
    render() {
        const { height, margin, chartItem, baseColor } = this.props;
        // Make sure points are asc sorted by x value
        chartItem.points = chartItem.points.sort((a, b) => this.scales.x(a.x) - this.scales.x(b.x));
        const id = `featureInfoPanelChart-${chartItem.name}`;
        const textStyle = {
            fill: baseColor,
            fontSize: 10,
            textAnchor: "middle",
            fontFamily: "Arial"
        };
        return (React.createElement("svg", { width: "100%", height: height },
            React.createElement(Group, { top: margin.top, left: margin.left },
                React.createElement(AxisBottom, { top: this.plot.height, 
                    // .nice() rounds the scale so that the aprox beginning and
                    // aprox end labels are shown
                    // See: https://stackoverflow.com/questions/21753126/d3-js-starting-and-ending-tick
                    scale: this.scales.x.nice(), numTicks: 4, stroke: "#a0a0a0", tickStroke: "#a0a0a0", tickLabelProps: (value, i, ticks) => {
                        // To prevent the first and last values from getting clipped,
                        // we position the first label text to start at the tick position
                        // and the last label text to finish at the tick position. For all
                        // others, middle of the text will coincide with the tick position.
                        const textAnchor = i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle";
                        return {
                            ...textStyle,
                            textAnchor
                        };
                    }, label: this.props.xAxisLabel, labelOffset: 3, labelProps: textStyle }),
                React.createElement(AxisLeft, { scale: this.scales.y, numTicks: 4, stroke: "none", tickStroke: "none", label: chartItem.units, labelOffset: 24, labelProps: textStyle, tickLabelProps: () => ({
                        ...textStyle,
                        textAnchor: "start",
                        dx: "0.5em",
                        dy: "0.25em"
                    }) }),
                React.createElement(LineChart, { id: id, chartItem: chartItem, scales: this.scales, color: baseColor }))));
    }
};
Chart.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    margin: PropTypes.object.isRequired,
    chartItem: PropTypes.object.isRequired,
    baseColor: PropTypes.string.isRequired,
    xAxisLabel: PropTypes.string
};
__decorate([
    computed
], Chart.prototype, "plot", null);
__decorate([
    computed
], Chart.prototype, "scales", null);
Chart = __decorate([
    observer
], Chart);
const ChartStatusText = styled.div `
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${p => p.width}px;
  height: ${p => p.height}px;
`;
export default FeatureInfoPanelChart;
//# sourceMappingURL=FeatureInfoPanelChart.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observer } from "mobx-react";
import { computed } from "mobx";
import { Tooltip as VisxTooltip } from "@visx/tooltip";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";
import React from "react";
import dateformat from "dateformat";
import groupBy from "lodash-es/groupBy";
import Styles from "./tooltip.scss";
let Tooltip = class Tooltip extends React.Component {
    constructor() {
        super(...arguments);
        this.prevItems = [];
    }
    get items() {
        // When items` is unset, hold on to its last value. We do this because we
        // want to keep showing the tooltip. We then fade it out using the
        // CSSTransition below.
        const items = this.props.items;
        if (items && items.length > 0) {
            this.prevItems = items;
            return items;
        }
        else {
            return this.prevItems;
        }
    }
    get title() {
        const items = this.items;
        if (items.length > 0) {
            // derive title from first item x
            const x = items[0].point.x;
            return x instanceof Date ? dateformat(x, "dd/mm/yyyy, HH:MMTT") : x;
        }
        else
            return undefined;
    }
    get groups() {
        // momentLines and momentPoints are not shown in the tooltip body
        const tooltipItems = this.items.filter(({ chartItem }) => chartItem.type !== "momentLines" && chartItem.type !== "momentPoints");
        return Object.entries(groupBy(tooltipItems, "chartItem.categoryName")).map((o) => ({
            name: o[0],
            items: o[1]
        }));
    }
    get style() {
        const { left, right, top, bottom } = this.props;
        return {
            left: left === undefined ? "" : `${left}px`,
            right: right === undefined ? "" : `${right}px`,
            top: top === undefined ? "" : `${top}px`,
            bottom: bottom === undefined ? "" : `${bottom}px`,
            position: "absolute",
            boxShadow: "0 1px 2px rgba(33,33,33,0.2)"
        };
    }
    render() {
        const { items } = this.props;
        const show = items.length > 0;
        return (React.createElement(CSSTransition, { in: show, classNames: "transition", timeout: 1000, unmountOnExit: true },
            React.createElement(VisxTooltip, { className: Styles.tooltip, key: Math.random(), style: this.style },
                React.createElement("div", { className: Styles.title }, this.title),
                React.createElement("div", null,
                    React.createElement(For, { each: "group", of: this.groups },
                        React.createElement(TooltipGroup, { key: `tooltip-group-${group.name}`, name: this.groups.length > 1 ? group.name : undefined, items: group.items }))))));
    }
};
Tooltip.propTypes = {
    items: PropTypes.array.isRequired,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    bottom: PropTypes.number
};
__decorate([
    computed
], Tooltip.prototype, "items", null);
__decorate([
    computed
], Tooltip.prototype, "title", null);
__decorate([
    computed
], Tooltip.prototype, "groups", null);
__decorate([
    computed
], Tooltip.prototype, "style", null);
Tooltip = __decorate([
    observer
], Tooltip);
class TooltipGroup extends React.PureComponent {
    render() {
        const { name, items } = this.props;
        return (React.createElement("div", { className: Styles.group },
            name && React.createElement("div", { className: Styles.groupName }, name),
            React.createElement(For, { each: "item", of: items },
                React.createElement(TooltipItem, { key: `tooltipitem-${item.chartItem.key}`, item: item }))));
    }
}
TooltipGroup.propTypes = {
    name: PropTypes.string,
    items: PropTypes.array.isRequired
};
let TooltipItem = class TooltipItem extends React.Component {
    render() {
        const chartItem = this.props.item.chartItem;
        const value = this.props.item.point.y;
        const formattedValue = isNaN(value) ? value : value.toFixed(2);
        return (React.createElement("div", { className: Styles.item },
            React.createElement("div", { className: Styles.itemSymbol, style: { backgroundColor: chartItem.getColor() } }),
            React.createElement("div", { className: Styles.itemName }, chartItem.name),
            React.createElement("div", { className: Styles.itemValue }, formattedValue),
            React.createElement("div", { className: Styles.itemUnits }, chartItem.units)));
    }
};
TooltipItem.propTypes = {
    item: PropTypes.object.isRequired
};
TooltipItem = __decorate([
    observer
], TooltipItem);
export default Tooltip;
//# sourceMappingURL=Tooltip.js.map
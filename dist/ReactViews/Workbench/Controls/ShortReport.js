"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import isDefined from "../../../Core/isDefined";
import CommonStrata from "../../../Models/Definition/CommonStrata";
import Box from "../../../Styled/Box";
import Spacing from "../../../Styled/Spacing";
import Text from "../../../Styled/Text";
import Collapsible from "../../Custom/Collapsible/Collapsible";
import parseCustomMarkdownToReact from "../../Custom/parseCustomMarkdownToReact";
let ShortReport = class ShortReport extends React.Component {
    clickShortReport(reportName, isOpen) {
        const shortReportSections = this.props.item.shortReportSections;
        const clickedReport = shortReportSections.find(report => report.name === reportName);
        if (isDefined(clickedReport)) {
            runInAction(() => {
                /**
                 * Ensure short report order is reflected by all strata up to this point
                 * & replicate all onto user stratum so that toggling doesn't re-order
                 * reports - a stopgap for the lack of consistent behaviour surrounding
                 * removals / re-ordering of objectArrayTraits
                 */
                shortReportSections.forEach(report => report.setTrait(CommonStrata.user, "show", report.show));
                clickedReport.setTrait(CommonStrata.user, "show", isOpen);
            });
        }
        return false;
    }
    render() {
        var _a, _b;
        const shortReportSections = (_b = (_a = this.props.item) === null || _a === void 0 ? void 0 : _a.shortReportSections) === null || _b === void 0 ? void 0 : _b.filter(r => isDefined(r.name));
        if ((!isDefined(this.props.item.shortReport) ||
            this.props.item.shortReport === "") &&
            (!isDefined(shortReportSections) || shortReportSections.length === 0)) {
            return null;
        }
        return (React.createElement(Box, { fullWidth: true, displayInlineBlock: true, padded: true },
            isDefined(this.props.item.shortReport) && (React.createElement(Text, { textLight: true, medium: true }, parseCustomMarkdownToReact(this.props.item.shortReport, {
                catalogItem: this.props.item
            }))),
            shortReportSections
                .filter(r => r.content && r.name)
                .map((r, i) => (React.createElement(React.Fragment, { key: r.name },
                React.createElement(Collapsible, { title: r.name, isOpen: r.show, onToggle: show => this.clickShortReport.bind(this, r.name, show)() }, parseCustomMarkdownToReact(r.content, {
                    catalogItem: this.props.item
                })),
                i < shortReportSections.length - 1 && React.createElement(Spacing, { bottom: 2 }))))));
    }
};
ShortReport = __decorate([
    observer
], ShortReport);
export default ShortReport;
module.exports = ShortReport;
//# sourceMappingURL=ShortReport.js.map
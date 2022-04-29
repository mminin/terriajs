"use strict";
import classNames from "classnames";
import createReactClass from "create-react-class";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { sortable } from "react-anything-sortable";
import { withTranslation } from "react-i18next";
import getPath from "../../Core/getPath";
import CatalogMemberMixin from "../../ModelMixins/CatalogMemberMixin";
import ReferenceMixin from "../../ModelMixins/ReferenceMixin";
import CommonStrata from "../../Models/Definition/CommonStrata";
import { DEFAULT_PLACEMENT } from "../../Models/SelectableDimensions";
import Box from "../../Styled/Box";
import Icon from "../../Styled/Icon";
import Loader from "../Loader";
import PrivateIndicator from "../PrivateIndicator/PrivateIndicator";
import ChartItemSelector from "./Controls/ChartItemSelector";
import ColorScaleRangeSection from "./Controls/ColorScaleRangeSection";
import DateTimeSelectorSection from "./Controls/DateTimeSelectorSection";
import DimensionSelectorSection from "./Controls/DimensionSelectorSection";
import FilterSection from "./Controls/FilterSection";
import LeftRightSection from "./Controls/LeftRightSection";
import Legend from "./Controls/Legend";
import OpacitySection from "./Controls/OpacitySection";
import SatelliteImageryTimeFilterSection from "./Controls/SatelliteImageryTimeFilterSection";
import { ScaleWorkbenchInfo } from "./Controls/ScaleWorkbenchInfo";
import ShortReport from "./Controls/ShortReport";
import TimerSection from "./Controls/TimerSection";
import ViewingControls from "./Controls/ViewingControls";
import Styles from "./workbench-item.scss";
export const WorkbenchItemRaw = observer(createReactClass({
    displayName: "WorkbenchItem",
    propTypes: {
        style: PropTypes.object,
        className: PropTypes.string,
        onMouseDown: PropTypes.func.isRequired,
        onTouchStart: PropTypes.func.isRequired,
        item: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        setWrapperState: PropTypes.func,
        t: PropTypes.func.isRequired
    },
    toggleDisplay() {
        runInAction(() => {
            this.props.item.setTrait(CommonStrata.user, "isOpenInWorkbench", !this.props.item.isOpenInWorkbench);
        });
    },
    openModal() {
        this.props.setWrapperState({
            modalWindowIsOpen: true,
            activeTab: 1,
            previewed: this.props.item
        });
    },
    toggleVisibility() {
        runInAction(() => {
            this.props.item.setTrait(CommonStrata.user, "show", !this.props.item.show);
        });
    },
    render() {
        const workbenchItem = this.props.item;
        const { t } = this.props;
        const isLoading = (CatalogMemberMixin.isMixedInto(this.props.item) &&
            this.props.item.isLoading) ||
            (ReferenceMixin.isMixedInto(this.props.item) &&
                this.props.item.isLoadingReference);
        return (React.createElement("li", { style: this.props.style, className: classNames(this.props.className, Styles.workbenchItem, {
                [Styles.isOpen]: workbenchItem.isOpenInWorkbench
            }), css: `
            color: ${p => p.theme.textLight};
            background: ${p => p.theme.darkWithOverlay};
          ` },
            React.createElement(Box, { fullWidth: true, justifySpaceBetween: true, padded: true },
                React.createElement(Box, null,
                    React.createElement(If, { condition: true || workbenchItem.supportsToggleShown },
                        React.createElement(Box, { leftSelf: true, className: Styles.visibilityColumn, css: `
                    padding: 3px 5px;
                  ` },
                            React.createElement("button", { type: "button", onClick: this.toggleVisibility, title: t("workbench.toggleVisibility"), className: Styles.btnVisibility }, workbenchItem.show ? (React.createElement(Icon, { glyph: Icon.GLYPHS.checkboxOn })) : (React.createElement(Icon, { glyph: Icon.GLYPHS.checkboxOff })))))),
                React.createElement(Box, { className: Styles.nameColumn },
                    React.createElement(Box, { fullWidth: true, paddedHorizontally: true },
                        React.createElement("div", { onMouseDown: this.props.onMouseDown, onTouchStart: this.props.onTouchStart, className: Styles.draggable, title: getPath(workbenchItem, " → ") },
                            React.createElement(If, { condition: !workbenchItem.isMappable && !isLoading },
                                React.createElement("span", { className: Styles.iconLineChart },
                                    React.createElement(Icon, { glyph: Icon.GLYPHS.lineChart }))),
                            workbenchItem.name))),
                React.createElement(Box, null,
                    React.createElement(Box, { className: Styles.toggleColumn, alignItemsFlexStart: true },
                        React.createElement("button", { type: "button", className: Styles.btnToggle, onClick: this.toggleDisplay, css: `
                    display: flex;
                    min-height: 24px;
                    align-items: center;
                    padding: 5px;
                  ` },
                            workbenchItem.isPrivate && (React.createElement(Box, { paddedHorizontally: true },
                                React.createElement(PrivateIndicator, { inWorkbench: true }))),
                            workbenchItem.isOpenInWorkbench ? (React.createElement(Icon, { glyph: Icon.GLYPHS.opened })) : (React.createElement(Icon, { glyph: Icon.GLYPHS.closed })))),
                    React.createElement("div", { className: Styles.headerClearfix }))),
            React.createElement(If, { condition: workbenchItem.isOpenInWorkbench },
                React.createElement("div", { className: Styles.inner },
                    React.createElement(ViewingControls, { item: workbenchItem, viewState: this.props.viewState }),
                    React.createElement(OpacitySection, { item: workbenchItem }),
                    React.createElement(ScaleWorkbenchInfo, { item: workbenchItem }),
                    React.createElement(LeftRightSection, { item: workbenchItem }),
                    React.createElement(TimerSection, { item: workbenchItem }),
                    React.createElement(ChartItemSelector, { item: workbenchItem }),
                    React.createElement(FilterSection, { item: workbenchItem }),
                    React.createElement(DateTimeSelectorSection, { item: workbenchItem }),
                    React.createElement(SatelliteImageryTimeFilterSection, { item: workbenchItem }),
                    React.createElement(DimensionSelectorSection, { item: workbenchItem, placement: DEFAULT_PLACEMENT }),
                    React.createElement(ColorScaleRangeSection, { item: workbenchItem, minValue: workbenchItem.colorScaleMinimum, maxValue: workbenchItem.colorScaleMaximum }),
                    React.createElement(If, { condition: workbenchItem.shortReport ||
                            (workbenchItem.shortReportSections &&
                                workbenchItem.shortReportSections.length) },
                        React.createElement(ShortReport, { item: workbenchItem })),
                    React.createElement(Legend, { item: workbenchItem }),
                    React.createElement(DimensionSelectorSection, { item: workbenchItem, placement: "belowLegend" }),
                    isLoading ? (React.createElement(Box, { paddedVertically: true },
                        React.createElement(Loader, { light: true }))) : null))));
    }
}));
export default sortable(withTranslation()(WorkbenchItemRaw));
//# sourceMappingURL=WorkbenchItem.js.map
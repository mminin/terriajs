var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import JulianDate from "terriajs-cesium/Source/Core/JulianDate";
import CommonStrata from "../../../Models/Definition/CommonStrata";
import { formatDateTime } from "../../BottomDock/Timeline/DateFormats";
import Icon, { StyledIcon } from "../../../Styled/Icon";
import DateTimePicker from "../../BottomDock/Timeline/DateTimePicker";
import Text, { TextSpan } from "../../../Styled/Text";
import Box from "../../../Styled/Box";
import Button from "../../../Styled/Button";
import Spacing from "../../../Styled/Spacing";
const dateFormat = require("dateformat");
let DatePicker = class DatePicker extends React.Component {
    constructor() {
        super(...arguments);
        this.isOpen = false;
    }
    get currentDate() {
        const date = this.props.item.currentDiscreteJulianDate;
        return date && JulianDate.toDate(date);
    }
    get formattedCurrentDate() {
        if (this.currentDate === undefined) {
            return;
        }
        const dateFormatting = undefined; // TODO
        const formattedDate = dateFormatting !== undefined
            ? dateFormat(this.currentDate, dateFormatting)
            : formatDateTime(this.currentDate);
        return formattedDate;
    }
    toggleOpen(e) {
        this.isOpen = !this.isOpen;
        // stopPropagation is required to prevent the datetime picker popup from closing when
        // the date button is clicked
        e.stopPropagation();
    }
    setIsOpen(isOpen) {
        this.isOpen = isOpen;
    }
    changeCurrentDate(date) {
        this.props.item.setTrait(CommonStrata.user, "currentTime", date.toISOString());
        this.props.onDateSet();
    }
    moveToPreviousDate() {
        this.props.item.moveToPreviousDiscreteTime(CommonStrata.user);
        this.props.onDateSet();
    }
    moveToNextDate() {
        this.props.item.moveToNextDiscreteTime(CommonStrata.user);
        this.props.onDateSet();
    }
    onClickExternalButton(event) {
        this.setIsOpen(true);
        // stopPropagation is required to prevent the datetime picker popup from closing when
        // the external button is clicked
        event.stopPropagation();
    }
    registerExternalButtonClick() {
        var _a;
        (_a = this.props.externalOpenButton.current) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onClickExternalButton);
    }
    unregisterExternalButtonClick(externalOpenButton) {
        var _a;
        (_a = externalOpenButton.current) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onClickExternalButton);
    }
    componentDidMount() {
        this.registerExternalButtonClick();
    }
    componentDidUpdate(prevProps) {
        this.unregisterExternalButtonClick(prevProps.externalOpenButton);
        this.registerExternalButtonClick();
    }
    componentWillUnmount() {
        this.unregisterExternalButtonClick(this.props.externalOpenButton);
    }
    render() {
        const { heading, item, t } = this.props;
        return (React.createElement(Box, { column: true, centered: true, flex: 1 },
            React.createElement(Spacing, { bottom: 4 }),
            React.createElement(Box, { centered: true },
                React.createElement(StyledIcon, { light: true, styledWidth: "21px", glyph: Icon.GLYPHS.calendar2, css: "margin-top:-2px;" }),
                React.createElement(Spacing, { right: 2 }),
                React.createElement(Text, { textLight: true, extraLarge: true }, heading)),
            React.createElement(Spacing, { bottom: 2 }),
            React.createElement(Box, null,
                React.createElement(PrevButton, { disabled: item.isPreviousDiscreteTimeAvailable === false, title: t("diffTool.datePicker.previousDateTitle"), onClick: this.moveToPreviousDate }),
                React.createElement(DateButton, { primary: true, isOpen: this.isOpen, onClick: this.toggleOpen, title: t("diffTool.datePicker.dateButtonTitle") },
                    React.createElement(TextSpan, { extraLarge: true }, this.formattedCurrentDate || "-")),
                React.createElement(NextButton, { disabled: item.isNextDiscreteTimeAvailable === false, title: t("diffTool.datePicker.nextDateTitle"), onClick: this.moveToNextDate })),
            React.createElement("div", { style: {
                    display: this.isOpen ? "block" : "none",
                    position: "absolute"
                } },
                React.createElement(DateTimePicker, { currentDate: this.currentDate, dates: this.props.item.objectifiedDates, onChange: this.changeCurrentDate, openDirection: "none", isOpen: this.isOpen, onOpen: () => this.setIsOpen(true), onClose: () => this.setIsOpen(false) })),
            React.createElement(Spacing, { bottom: 4 })));
    }
};
__decorate([
    observable
], DatePicker.prototype, "isOpen", void 0);
__decorate([
    computed
], DatePicker.prototype, "currentDate", null);
__decorate([
    computed
], DatePicker.prototype, "formattedCurrentDate", null);
__decorate([
    action.bound
], DatePicker.prototype, "toggleOpen", null);
__decorate([
    action.bound
], DatePicker.prototype, "setIsOpen", null);
__decorate([
    action.bound
], DatePicker.prototype, "changeCurrentDate", null);
__decorate([
    action.bound
], DatePicker.prototype, "moveToPreviousDate", null);
__decorate([
    action.bound
], DatePicker.prototype, "moveToNextDate", null);
__decorate([
    action.bound
], DatePicker.prototype, "onClickExternalButton", null);
DatePicker = __decorate([
    observer
], DatePicker);
const PagerButton = styled(Button).attrs({
    iconProps: {
        css: "margin-right:0;"
    }
}) `
  cursor: pointer;
  background-color: ${props => props.theme.colorPrimary};
  width: 40px;
  border: 1px solid transparent;

  ${({ theme }) => theme.centerWithFlex()}
  flex-direction: column;
`;
const PrevButton = styled(PagerButton).attrs({
    renderIcon: () => (React.createElement(StyledIcon, { css: "transform:rotate(90deg);", light: true, styledWidth: "15px", glyph: Icon.GLYPHS.arrowDown }))
}) `
  ${({ theme }) => theme.borderRadiusLeft(theme.radius40Button)}
  margin-right: 1px;
`;
const NextButton = styled(PagerButton).attrs({
    renderIcon: () => (React.createElement(StyledIcon, { css: "transform:rotate(270deg);", light: true, styledWidth: "15px", glyph: Icon.GLYPHS.arrowDown }))
}) `
  ${({ theme }) => theme.borderRadiusRight(theme.radius40Button)}
  margin-left: 1px;
`;
const DateButton = styled(Button) `
  // z-index: 1000; // (Nanda): So that we don't loose the button clicks to the date picker popup
  z-index: 0;
  ${props => props.isOpen && `z-index: 1000;`};

  border-radius: 0px;
  border: 1px solid ${props => props.theme.colorPrimary};

  min-width: 235px;
  @media (max-width: ${(props) => props.theme.lg}px) {
    min-width: 150px;
  }
`;
export default withTranslation()(DatePicker);
//# sourceMappingURL=DatePicker.js.map
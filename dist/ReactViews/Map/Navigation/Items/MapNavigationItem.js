var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { useTranslationIfExists } from "../../../../Language/languageHelpers";
import Box from "../../../../Styled/Box";
import Icon, { GLYPHS } from "../../../../Styled/Icon";
import MapIconButton from "../../../MapIconButton/MapIconButton";
let MapNavigationItem = class MapNavigationItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { closeTool = true, item, expandInPlace } = this.props;
        if (item.render)
            return (React.createElement(Control, { key: item.id, ref: item.controller.itemRef }, item.render));
        return (React.createElement(Control, { ref: item.controller.itemRef },
            React.createElement(MapIconButton, { expandInPlace: expandInPlace === undefined ? true : expandInPlace, noExpand: item.noExpand, iconElement: () => React.createElement(Icon, { glyph: item.controller.glyph }), title: useTranslationIfExists(item.title || item.name), onClick: () => {
                    item.controller.handleClick();
                }, disabled: item.controller.disabled, primary: item.controller.active, closeIconElement: closeTool ? () => React.createElement(Icon, { glyph: GLYPHS.closeTool }) : undefined }, useTranslationIfExists(item.name))));
    }
};
MapNavigationItem = __decorate([
    observer
], MapNavigationItem);
export { MapNavigationItem };
export const Control = styled(Box).attrs({
    centered: true,
    column: true
}) `
  pointer-events: auto;
  @media (min-width: ${props => props.theme.sm}px) {
    margin: 0;
    padding-top: 10px;
    height: auto;
  }
  @media (max-width: ${props => props.theme.mobile}px) {
    padding-right: 10px;
    margin-bottom: 5px;
  }
  text-align: center;
`;
//# sourceMappingURL=MapNavigationItem.js.map
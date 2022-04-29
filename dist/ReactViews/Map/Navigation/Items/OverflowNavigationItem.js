import { autorun } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import { useTranslationIfExists } from "../../../../Language/languageHelpers";
import Box, { BoxSpan } from "../../../../Styled/Box";
import { StyledIcon } from "../../../../Styled/Icon";
import Spacing from "../../../../Styled/Spacing";
import Text from "../../../../Styled/Text";
import CloseButton from "../../../Generic/CloseButton";
import { PrefaceBox } from "../../../Generic/PrefaceBox";
import { filterViewerAndScreenSize } from "../MapNavigation";
const CollapsedNavigationBox = styled(Box).attrs({
    position: "absolute",
    styledWidth: "500px",
    styledMaxHeight: "320px",
    backgroundColor: "white",
    rounded: true,
    paddedRatio: 4,
    overflowY: "auto",
    scroll: true
}) `
  z-index: 1000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.12), 0 10px 20px 0 rgba(0, 0, 0, 0.05);
  @media (max-width: ${props => props.theme.mobile}px) {
    width: 100%;
  }
`;
const ButtonsBox = styled(Box).attrs({}) `
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  position: relative;
  margin-bottom: 10px;
  gap: 20px;
`;
const NavigationButton = styled(BoxSpan).attrs({
    boxShadow: true,
    centered: true,
    rounded: true
}) `
  cursor: pointer;
  &:hover {
    border: 2px solid ${p => p.theme.darkWithOverlay};
    svg {
      opacity: 0.9;
    }
  }
  :before {
    content: "";
    display: block;
    height: 0;
    width: 0;
    padding-bottom: 100%;
  }
  ${props => props.disabled &&
    `
    background-color: ${props.theme.grey};
    color: ${props.theme.grey};
    opacity: 0.7;
    svg {
      fill: ${props.theme.textLightDimmed};
    }
    &[disabled] {
      cursor: not-allowed;
    }
  `}
`;
const CollapsedNavigationPanel = observer((props) => {
    const { viewState } = props;
    const theme = useTheme();
    const { t } = useTranslation();
    let items = props.items;
    return (React.createElement(CollapsedNavigationBox, { column: true },
        React.createElement(CloseButton, { color: theme.darkWithOverlay, topRight: true, onClick: () => viewState.closeCollapsedNavigation() }),
        React.createElement(Text, { extraExtraLarge: true, bold: true, textDarker: true }, t("mapNavigation.additionalTools")),
        React.createElement(Spacing, { bottom: 5 }),
        React.createElement(ButtonsBox, null, items.map(item => (React.createElement(NavigationButton, { key: item.id, title: useTranslationIfExists(item.name), onClick: () => {
                if (!item.controller.disabled) {
                    viewState.closeCollapsedNavigation();
                    item.controller.handleClick();
                }
            }, css: `
                ${item.controller.active &&
                `border: 2px solid ${theme.colorPrimary};`}
              `, disabled: item.controller.disabled },
            React.createElement(StyledIcon, { glyph: item.controller.glyph, styledWidth: "22px", dark: true })))))));
});
const CollapsedNavigationDisplayName = "CollapsedNavigation";
const CollapsedNavigation = observer(({ viewState }) => {
    useEffect(() => autorun(() => {
        if (viewState.showCollapsedNavigation &&
            viewState.topElement !== CollapsedNavigationDisplayName) {
            viewState.setTopElement(CollapsedNavigationDisplayName);
        }
    }));
    let items = viewState.terria.mapNavigationModel.items.filter(item => item.controller.collapsed);
    items = items.filter(item => filterViewerAndScreenSize(item, viewState));
    if (!viewState.showCollapsedNavigation || items.length === 0) {
        viewState.closeCollapsedNavigation();
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(PrefaceBox, { onClick: () => viewState.closeCollapsedNavigation(), role: "presentation", "aria-hidden": "true", pseudoBg: true }),
        React.createElement(CollapsedNavigationPanel, { viewState: viewState, items: items })));
});
export default CollapsedNavigation;
//# sourceMappingURL=OverflowNavigationItem.js.map
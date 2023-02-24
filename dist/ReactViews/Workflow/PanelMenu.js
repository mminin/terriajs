import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GLYPHS, StyledIcon } from "../../Styled/Icon";
import Text from "../../Styled/Text";
/**
 * A popup overflow menu for the panel
 */
export const PanelMenu = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hideMenu = () => setIsOpen(false);
    useEffect(function clickAnywhereToCloseMenu() {
        if (isOpen) {
            window.addEventListener("click", hideMenu);
            return () => window.removeEventListener("click", hideMenu);
        }
    }, [isOpen]);
    const handleClick = (onSelect, event) => {
        // If onSelect decides to stop event propagation,
        // clickAnywhereToCloseMenu() will not work. So we close the menu before
        // calling onSelect.
        setIsOpen(false);
        onSelect(event);
    };
    return (React.createElement(PanelMenuContainer, null,
        React.createElement(PanelMenuButton, { isOpen: isOpen, onClick: () => setIsOpen(true) },
            React.createElement(StyledIcon, { glyph: GLYPHS.menuDotted })),
        isOpen && (React.createElement("ul", null, options.map(({ text, onSelect, disabled }) => (React.createElement("li", { key: text },
            React.createElement(PanelMenuItem, { onClick: (e) => handleClick(onSelect, e), disabled: disabled },
                React.createElement(Text, { noWrap: true, medium: true, textLight: true }, text)))))))));
};
const PanelMenuContainer = styled.div `
  position: relative;

  ul {
    position: absolute;
    right: 2px;
    z-index: 1;
    margin: 2px 1px 0 0;
    padding: 0;
    list-style: none;
    border-radius: 3px;
    border: 1px solid ${(p) => p.theme.grey};
    background-color: ${(p) => p.theme.dark};
  }

  ul > li {
    border: 0px;
    border-bottom: 1px solid ${(p) => p.theme.grey};
  }

  ul > li:last-child {
    border-bottom: 0;
  }
`;
const PanelMenuItem = styled.button `
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border: 0;
  border-radius: 2px;
  background-color: ${(p) => p.theme.dark};

  :disabled > ${Text} {
    color: ${(p) => p.theme.textLightDimmed};
  }

  :hover {
    cursor: pointer;
    background-color: ${(p) => p.theme.colorPrimary};
  }
`;
const PanelMenuButton = styled.button `
  outline: 0 !important;
  padding: 8px;
  margin: 0 3px;
  background: none;
  border: 0px;
  border-radius: 2px;

  svg {
    fill: ${(props) => props.theme.greyLighter};
    width: 16px;
    height: 16px;
  }

  ${(p) => p.isOpen && `background-color: ${p.theme.dark}`};

  :hover {
    cursor: pointer;
  }
`;
//# sourceMappingURL=PanelMenu.js.map
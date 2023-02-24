import React, { useEffect, useState } from "react";
import styled from "styled-components";
import isDefined from "../../Core/isDefined";
import { RawButton } from "../../Styled/Button";
import { StyledIcon } from "../../Styled/Icon";
import Text from "../../Styled/Text";
import { CollapseIcon } from "../Custom/Collapsible/Collapsible";
/**
 * A generic panel component for left, right, context items etc.
 */
export const Panel = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        isDefined(props.isOpen) ? setIsOpen(props.isOpen) : null;
    }, [props.isOpen]);
    const toggleOpen = () => {
        const newIsOpen = !isOpen;
        // Only update isOpen state if onToggle doesn't consume the event
        if (!props.onToggle || !props.onToggle(newIsOpen))
            setIsOpen(newIsOpen);
    };
    return props.title && props.collapsible ? (React.createElement(Wrapper, { className: props.className },
        React.createElement(CollapsibleTitleBar, { onClick: toggleOpen, fullWidth: true, isOpen: isOpen },
            props.icon !== undefined ? (React.createElement(Icon, { glyph: props.icon, styledWidth: "16px", styledHeight: "16px" })) : null,
            React.createElement(Title, null, props.title),
            React.createElement(CollapseIcon, { isOpen: isOpen })),
        isOpen ? React.createElement(Content, null, props.children) : null)) : (React.createElement(Wrapper, { className: props.className },
        props.title !== undefined && (React.createElement(TitleBar, null,
            props.icon !== undefined ? (React.createElement(Icon, { glyph: props.icon, styledWidth: "16px", styledHeight: "16px" })) : null,
            React.createElement(Title, null, props.title),
            props.menuComponent)),
        React.createElement(Content, null, props.children)));
};
/** Simple PanelButton - this mimics style of CollapsibleTitleBar */
export const PanelButton = ({ onClick, title }) => (React.createElement(Wrapper, null,
    React.createElement(CollapsibleTitleBar, { onClick: onClick, fullWidth: true, isOpen: false, activeStyles: true },
        React.createElement(Title, { css: { textAlign: "center" } }, title))));
const Wrapper = styled.div `
  background-color: ${(p) => p.theme.darkWithOverlay};
  margin: 10px 5px 0px 5px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;
const TitleBar = styled.div `
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(p) => p.theme.darkLighter};
  padding-left: 0.4em;
`;
const CollapsibleTitleBar = styled(RawButton) `
  text-align: left;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${(p) => (p.isOpen ? `border-bottom: 1px solid ${p.theme.darkLighter}` : "")};
  padding-left: 0.4em;
  padding-right: 0.4em;
`;
const Title = styled(Text).attrs({
    textLight: true,
    bold: true
}) `
  flex-grow: 1;
  padding: 1em 0.4em;
`;
const Icon = styled(StyledIcon).attrs({
    styledWidth: "18px",
    styledHeight: "18px",
    light: true
}) ``;
const Content = styled.div `
  padding: 0.4em;
  color: ${(p) => p.theme.textLight};
`;
//# sourceMappingURL=Panel.js.map
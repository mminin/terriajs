import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Box from "../../../Styled/Box";
import Button from "../../../Styled/Button";
import Spacing from "../../../Styled/Spacing";
import Text from "../../../Styled/Text";
import Icon, { StyledIcon } from "../../../Styled/Icon";
import MovementsController from "./MovementsController";
const mouseControlsImage = require("../../../../wwwroot/images/mouse-control.svg");
const wasdControlsImage = require("../../../../wwwroot/images/wasd.svg");
const heightControlsImage = require("../../../../wwwroot/images/height-controls.svg");
const MovementControls = props => {
    const [isMaximized, setIsMaximized] = useState(true);
    const [t] = useTranslation();
    const toggleMaximized = () => setIsMaximized(!isMaximized);
    useEffect(() => {
        const movementsController = new MovementsController(props.cesium, props.onMove, props.pedestrianHeight, props.maxVerticalLookAngle);
        const detach = movementsController.activate();
        return detach;
    }, [props.cesium]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Container, null,
            React.createElement(Title, null,
                React.createElement(Text, { medium: true }, t("pedestrianMode.controls.title")),
                React.createElement(MinimizeMaximizeButton, { onClick: toggleMaximized, maximized: isMaximized })),
            isMaximized && (React.createElement(Body, null,
                React.createElement("img", { alt: "Mouse controls", src: mouseControlsImage }),
                React.createElement("img", { alt: "Direction controls", src: wasdControlsImage }),
                React.createElement(Spacing, { bottom: 1 }),
                React.createElement("img", { alt: "Height controls", src: heightControlsImage }))))));
};
const backgroundColor = "#ffffff";
const Container = styled.div `
  background-color: ${backgroundColor};
  box-shadow: 0 4px 8px 4px rgb(0 0 0 / 5%);
  border-radius: 3px;
`;
const Title = styled(Box).attrs({
    medium: true
}) `
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5em;
  border-bottom: 1px solid #c0c0c0;
`;
const MinimizeMaximizeButton = styled(Button).attrs(props => ({
    renderIcon: () => (React.createElement(ButtonIcon, { glyph: props.maximized ? Icon.GLYPHS.minimize : Icon.GLYPHS.maximize }))
})) `
  padding: 0;
  margin: 0;
  border: 0;
  background-color: ${backgroundColor};
`;
const ButtonIcon = styled(StyledIcon) `
  height: 20px;
`;
const Body = styled(Box).attrs({ column: true, centered: true }) `
  align-items: center;
  margin-top: 1em;
  & img {
    padding-bottom: 1em;
  }
`;
export default MovementControls;
//# sourceMappingURL=MovementControls.js.map
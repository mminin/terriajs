import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import Box from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import Icon from "../../Styled/Icon";
import Text from "../../Styled/Text";
import PrivateIndicator from "../PrivateIndicator/PrivateIndicator";
export var ButtonState;
(function (ButtonState) {
    ButtonState[ButtonState["Loading"] = 0] = "Loading";
    ButtonState[ButtonState["Remove"] = 1] = "Remove";
    ButtonState[ButtonState["Add"] = 2] = "Add";
    ButtonState[ButtonState["Trash"] = 3] = "Trash";
    ButtonState[ButtonState["Stats"] = 4] = "Stats";
    ButtonState[ButtonState["Preview"] = 5] = "Preview";
})(ButtonState || (ButtonState = {}));
const STATE_TO_ICONS = {
    [ButtonState.Loading]: React.createElement(Icon, { glyph: Icon.GLYPHS.loader }),
    [ButtonState.Remove]: React.createElement(Icon, { glyph: Icon.GLYPHS.remove }),
    [ButtonState.Add]: React.createElement(Icon, { glyph: Icon.GLYPHS.add }),
    [ButtonState.Trash]: React.createElement(Icon, { glyph: Icon.GLYPHS.trashcan }),
    [ButtonState.Stats]: React.createElement(Icon, { glyph: Icon.GLYPHS.barChart }),
    [ButtonState.Preview]: React.createElement(Icon, { glyph: Icon.GLYPHS.right })
};
/** Dumb catalog item */
function CatalogItem(props) {
    const { t } = useTranslation();
    const STATE_TO_TITLE = {
        [ButtonState.Loading]: t("catalogItem.loading"),
        [ButtonState.Remove]: t("catalogItem.remove"),
        [ButtonState.Add]: t("catalogItem.add"),
        [ButtonState.Trash]: t("catalogItem.trash"),
        [ButtonState.Preview]: t("catalogItem.preview")
    };
    const stateToTitle = defaultValue(props.titleOverrides, STATE_TO_TITLE);
    return (React.createElement(Root, null,
        React.createElement(Text, { fullWidth: true, primary: props.isPrivate, bold: props.selected, breakWord: true },
            React.createElement(ItemTitleButton, { selected: props.selected, trashable: props.trashable, type: "button", onClick: props.onTextClick, title: props.title }, props.text)),
        React.createElement(Box, null,
            props.isPrivate && React.createElement(PrivateIndicator, null),
            React.createElement(ActionButton, { type: "button", onClick: props.onBtnClick, title: stateToTitle[props.btnState] || "" }, STATE_TO_ICONS[props.btnState]),
            props.trashable && (React.createElement(ActionButton, { type: "button", onClick: props.onTrashClick, title: stateToTitle[ButtonState.Trash] }, STATE_TO_ICONS[ButtonState.Trash])))));
}
const Root = styled.li `
  display: flex;
  width: 100%;
`;
const ItemTitleButton = styled(RawButton) `
  text-align: left;
  word-break: normal;
  overflow-wrap: anywhere;
  padding: 8px;
  width: 100%;

  &:focus,
  &:hover {
    color: ${(p) => p.theme.modalHighlight};
  }

  ${(p) => p.selected && `color: ${p.theme.modalHighlight};`}

  @media (max-width: ${(p) => p.theme.sm}px) {
    font-size: 0.9rem;
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid ${(p) => p.theme.greyLighter};
  }
`;
const ActionButton = styled(RawButton) `
  svg {
    height: 20px;
    width: 20px;
    margin: 5px;
    fill: ${(p) => p.theme.charcoalGrey};
  }

  &:hover,
  &:focus {
    svg {
      fill: ${(p) => p.theme.modalHighlight};
    }
  }
`;
CatalogItem.propTypes = {
    onTextClick: PropTypes.func,
    isPrivate: PropTypes.bool,
    selected: PropTypes.bool,
    text: PropTypes.string,
    title: PropTypes.string,
    trashable: PropTypes.bool,
    onTrashClick: PropTypes.func,
    onBtnClick: PropTypes.func,
    btnState: PropTypes.oneOf([
        ButtonState.Add,
        ButtonState.Loading,
        ButtonState.Preview,
        ButtonState.Remove,
        ButtonState.Stats,
        ButtonState.Trash
    ]),
    titleOverrides: PropTypes.object
};
export default CatalogItem;
//# sourceMappingURL=CatalogItem.js.map
import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Icon from "../../Styled/Icon";
import Box from "../../Styled/Box";
import { TextSpan } from "../../Styled/Text";
import { RawButton } from "../../Styled/Button";
import Spacing from "../../Styled/Spacing";
import MapIconButton from "../MapIconButton/MapIconButton";
// import MenuPanel from "../StandardUserInterface/customizable/MenuPanel";
import CleanDropdownPanel from "../CleanDropdownPanel/CleanDropdownPanel";
import { COMPASS_LOCAL_PROPERTY_KEY } from "../Map/Navigation/Items/Compass";
GyroscopeGuidance.propTypes = {
    viewState: PropTypes.object.isRequired,
    handleHelp: PropTypes.func,
    onClose: PropTypes.func.isRequired
};
const Text = styled(TextSpan).attrs({
    textAlignLeft: true,
    noFontSize: true
}) ``;
const CompassWrapper = styled(Box).attrs({
    centered: true,
    styledWidth: "64px",
    styledHeight: "64px"
}) `
  flex-shrink: 0;

  svg {
    fill: ${props => props.theme.textDarker};
  }
`;
const CompassPositioning = `

`;
const CompassIcon = styled(Icon) `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${props => props.inner
    ? `
      fill: ${props.theme.textDarker};
      width: 26px;
      height: 26px;
    `
    : `
      fill: ${props.theme.textLight};
      width: 64px;
      height: 64px;
    `}
  ${props => props.darken &&
    `
      opacity: 0.2;
    `}
`;
function GyroscopeGuidancePanel(props) {
    const { t } = useTranslation();
    return (React.createElement(Box, { column: true, paddedRatio: 4, css: `
        direction: ltr;
        min-width: 295px;
      ` },
        React.createElement(Text, { large: true }, t("compass.guidance.title")),
        React.createElement(Spacing, { bottom: 4 }),
        React.createElement(Text, { medium: true },
            React.createElement(Box, null,
                React.createElement(CompassWrapper, null,
                    React.createElement(CompassIcon, { glyph: Icon.GLYPHS.compassOuterEnlarged }),
                    React.createElement(CompassIcon, { glyph: Icon.GLYPHS.compassInnerArrows, inner: true, darken: true })),
                React.createElement(Spacing, { right: 2 }),
                React.createElement(Box, { column: true },
                    React.createElement(Text, { bold: true, uppercase: true }, t("compass.guidance.outerRingTitle")),
                    React.createElement(Spacing, { bottom: 1 }),
                    React.createElement(Text, null, t("compass.guidance.outerRingDescription")))),
            React.createElement(Spacing, { bottom: 4 }),
            React.createElement(Box, null,
                React.createElement(CompassWrapper, null,
                    React.createElement(CompassIcon, { glyph: Icon.GLYPHS.compassOuterEnlarged, css: CompassPositioning, darken: true }),
                    React.createElement(CompassIcon, { glyph: Icon.GLYPHS.compassInnerArrows, inner: true }),
                    React.createElement(Spacing, { right: 2 })),
                React.createElement(Spacing, { right: 2 }),
                React.createElement(Box, { column: true },
                    React.createElement(Text, { bold: true, uppercase: true }, t("compass.guidance.innerCircleTitle")),
                    React.createElement(Spacing, { bottom: 1 }),
                    React.createElement(Text, null, t("compass.guidance.innerCircleDescription1")),
                    React.createElement(Spacing, { bottom: 2 }),
                    React.createElement(Text, null, t("compass.guidance.innerCircleDescription2")))),
            React.createElement(Spacing, { bottom: 4 }),
            React.createElement(Text, null, t("compass.guidance.ctrlDragDescription")),
            React.createElement(Spacing, { bottom: 4 }),
            React.createElement(RawButton, { onClick: props.onClose },
                React.createElement(Text, { displayBlock: true, primary: true, isLink: true }, t("compass.guidance.dismissText"))))));
}
GyroscopeGuidancePanel.propTypes = {
    onClose: PropTypes.func.isRequired
};
export default function GyroscopeGuidance(props) {
    const [controlPanelOpen, setControlPanelOpen] = useState(false);
    const controlsMapIcon = useRef();
    const { t } = useTranslation();
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { css: `
          position: relative;
        ` },
            React.createElement(MapIconButton, { roundLeft: true, buttonRef: controlsMapIcon, neverCollapse: true, iconElement: () => React.createElement(Icon, { glyph: Icon.GLYPHS.questionMark }), onClick: () => setControlPanelOpen(!controlPanelOpen), inverted: true, css: `
            svg {
              margin: 0px;
              width: 25px;
              height: 25px;
            }
          ` }),
            React.createElement("div", { onClick: e => e.preventDefault(), css: `
            position: relative;
          ` },
                React.createElement(CleanDropdownPanel
                // theme={dropdownTheme}
                // While opacity at this level is not ideal, it's the only way
                // to get the background to be transparent - another step up
                // is setting the opacity layer underneath, and a
                // pseudo-panel on top of it to keep the opacity on top.
                // but that's a lot to do right now
                //   - for a component that is still using sass
                //   - for 0.85 where the contrast is still great.
                , { 
                    // theme={dropdownTheme}
                    // While opacity at this level is not ideal, it's the only way
                    // to get the background to be transparent - another step up
                    // is setting the opacity layer underneath, and a
                    // pseudo-panel on top of it to keep the opacity on top.
                    // but that's a lot to do right now
                    //   - for a component that is still using sass
                    //   - for 0.85 where the contrast is still great.
                    cleanDropdownPanelStyles: css `
              opacity: 0.85;
              .tjs-sc-InnerPanel,
              .tjs-sc-InnerPanel__caret {
                background: ${p => p.theme.textBlack};
              }
            `, refForCaret: controlsMapIcon, isOpen: controlPanelOpen, onOpenChanged: () => controlPanelOpen, 
                    // onDismissed={() => setControlPanelOpen(false)}
                    btnTitle: t("compass.guidanceBtnTitle"), btnText: t("compass.guidanceBtnText"), viewState: props.viewState, smallScreen: props.viewState.useSmallScreenInterface },
                    React.createElement(GyroscopeGuidancePanel, { onClose: () => {
                            setControlPanelOpen(false);
                            props.onClose();
                            props.viewState.terria.setLocalProperty(COMPASS_LOCAL_PROPERTY_KEY, true);
                        } }))))));
}
//# sourceMappingURL=GyroscopeGuidance.js.map
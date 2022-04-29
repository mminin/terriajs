import createReactClass from "create-react-class";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import Icon, { StyledIcon } from "../../Styled/Icon";
import SearchBoxAndResults from "../Search/SearchBoxAndResults";
import Workbench from "../Workbench/Workbench";
import FullScreenButton from "./FullScreenButton";
import { useRefForTerria } from "../Hooks/useRefForTerria";
import Box from "../../Styled/Box";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import Button from "../../Styled/Button";
const BoxHelpfulHints = styled(Box) ``;
const ResponsiveSpacing = styled(Box) `
  height: 110px;
  // Hardcoded px value, TODO: make it not hardcoded
  @media (max-height: 700px) {
    height: 3vh;
  }
`;
function EmptyWorkbench(props) {
    const t = props.t;
    const HelpfulHintsIcon = () => {
        return (React.createElement(StyledIcon, { glyph: Icon.GLYPHS.bulb, styledWidth: "14px", styledHeight: "14px", light: true, css: `
          padding: 2px 1px;
        ` }));
    };
    return (React.createElement(Text, { large: true, textLight: true },
        React.createElement(Box, { column: true, fullWidth: true, justifySpaceBetween: true, styledHeight: "calc(100vh - 150px)" },
            React.createElement(Box, { centered: true, column: true },
                React.createElement(ResponsiveSpacing, null),
                React.createElement(Text, { large: true, color: props.theme.textLightDimmed }, t("emptyWorkbench.emptyArea")),
                React.createElement(ResponsiveSpacing, null)),
            React.createElement(BoxHelpfulHints, { column: true, paddedRatio: 3, overflowY: "auto", scroll: true },
                React.createElement(Box, { left: true },
                    React.createElement(Text, { extraLarge: true, bold: true }, t("emptyWorkbench.helpfulHints"))),
                React.createElement(Spacing, { bottom: 4 }),
                React.createElement(Box, null,
                    React.createElement(HelpfulHintsIcon, null),
                    React.createElement(Spacing, { right: 1 }),
                    React.createElement(Text, { medium: true, light: true }, t("emptyWorkbench.helpfulHintsOne"))),
                React.createElement(Spacing, { bottom: 3 }),
                React.createElement(Box, null,
                    React.createElement(HelpfulHintsIcon, null),
                    React.createElement(Spacing, { right: 1 }),
                    React.createElement(Text, { medium: true, light: true }, t("emptyWorkbench.helpfulHintsTwo"))),
                React.createElement(Spacing, { bottom: 3 }),
                React.createElement(Box, null,
                    React.createElement(HelpfulHintsIcon, null),
                    React.createElement(Spacing, { right: 1 }),
                    React.createElement(Text, { medium: true, light: true }, t("emptyWorkbench.helpfulHintsThree"))),
                React.createElement(ResponsiveSpacing, null)))));
}
EmptyWorkbench.propTypes = {
    t: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
};
const SidePanelButton = React.forwardRef((props, ref) => {
    const { btnText, ...rest } = props;
    return (React.createElement(Button, Object.assign({ primary: true, ref: ref, renderIcon: props.children && (() => props.children), textProps: {
            large: true
        } }, rest), btnText ? btnText : ""));
});
SidePanelButton.displayName = "SidePanelButton"; // for some reasons lint doesn't like not having this
SidePanelButton.propTypes = {
    btnText: PropTypes.string,
    children: PropTypes.node
};
export const EXPLORE_MAP_DATA_NAME = "ExploreMapDataButton";
export const SIDE_PANEL_UPLOAD_BUTTON_NAME = "SidePanelUploadButton";
const SidePanel = observer(createReactClass({
    displayName: "SidePanel",
    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        refForExploreMapData: PropTypes.object.isRequired,
        refForUploadData: PropTypes.object.isRequired,
        t: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired
    },
    onAddDataClicked(e) {
        e.stopPropagation();
        this.props.viewState.setTopElement("AddData");
        this.props.viewState.openAddData();
    },
    onAddLocalDataClicked(e) {
        e.stopPropagation();
        this.props.viewState.setTopElement("AddData");
        this.props.viewState.openUserData();
    },
    render() {
        const { t, theme } = this.props;
        const addData = t("addData.addDataBtnText");
        const uploadText = t("models.catalog.upload");
        return (React.createElement("div", null,
            React.createElement("div", { css: `
              padding: 0 5px;
              background: ${this.props.theme.dark};
            ` },
                React.createElement(FullScreenButton, { terria: this.props.terria, viewState: this.props.viewState, minified: true, animationDuration: 250, btnText: t("addData.btnHide") }),
                React.createElement(SearchBoxAndResults, { viewState: this.props.viewState, terria: this.props.terria, placeholder: t("search.placeholder") }),
                React.createElement(Spacing, { bottom: 2 }),
                React.createElement(Box, { justifySpaceBetween: true },
                    React.createElement(SidePanelButton, { ref: this.props.refForExploreMapData, onClick: e => this.onAddDataClicked(e), title: addData, btnText: addData, styledWidth: "200px" },
                        React.createElement(StyledIcon, { glyph: Icon.GLYPHS.add, light: true, styledWidth: "20px" })),
                    React.createElement(SidePanelButton, { ref: this.props.refForUploadData, onClick: e => this.onAddLocalDataClicked(e), title: t("addData.load"), btnText: uploadText, styledWidth: "130px" },
                        React.createElement(StyledIcon, { glyph: Icon.GLYPHS.uploadThin, light: true, styledWidth: "20px" }))),
                React.createElement(Spacing, { bottom: 1 })),
            React.createElement("div", { css: `
              overflow: hidden;
            ` },
                React.createElement(Choose, null,
                    React.createElement(When, { condition: this.props.terria.workbench.items &&
                            this.props.terria.workbench.items.length > 0 },
                        React.createElement(Workbench, { viewState: this.props.viewState, terria: this.props.terria })),
                    React.createElement(Otherwise, null,
                        React.createElement(EmptyWorkbench, { t: t, theme: theme }))))));
    }
}));
// Used to create two refs for <SidePanel /> to consume, rather than
// using the withTerriaRef() HOC twice, designed for a single ref
const SidePanelWithRefs = props => {
    const refForExploreMapData = useRefForTerria(EXPLORE_MAP_DATA_NAME, props.viewState);
    const refForUploadData = useRefForTerria(SIDE_PANEL_UPLOAD_BUTTON_NAME, props.viewState);
    return (React.createElement(SidePanel, Object.assign({}, props, { refForExploreMapData: refForExploreMapData, refForUploadData: refForUploadData })));
};
SidePanelWithRefs.propTypes = {
    viewState: PropTypes.object.isRequired
};
module.exports = withTranslation()(withTheme(SidePanelWithRefs));
//# sourceMappingURL=SidePanel.js.map
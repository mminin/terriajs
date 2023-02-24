import { observer } from "mobx-react";
import React from "react";
import { useTranslation, withTranslation } from "react-i18next";
import styled, { withTheme } from "styled-components";
import Box from "../../Styled/Box";
import Button from "../../Styled/Button";
import Icon, { StyledIcon } from "../../Styled/Icon";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import { ExplorerWindowElementName } from "../ExplorerWindow/ExplorerWindow";
import { useRefForTerria } from "../Hooks/useRefForTerria";
import SearchBoxAndResults from "../Search/SearchBoxAndResults";
import { withViewState } from "../StandardUserInterface/ViewStateContext";
import Workbench from "../Workbench/Workbench";
const BoxHelpfulHints = styled(Box) ``;
const ResponsiveSpacing = styled(Box) `
  height: 110px;
  // Hardcoded px value, TODO: make it not hardcoded
  @media (max-height: 700px) {
    height: 3vh;
  }
`;
const HelpfulHintsIcon = () => {
    return (React.createElement(StyledIcon, { glyph: Icon.GLYPHS.bulb, styledWidth: "14px", styledHeight: "14px", light: true, css: `
        padding: 2px 1px;
      ` }));
};
const EmptyWorkbench = (props) => {
    const { t } = useTranslation();
    return (React.createElement(Text, { large: true, textLight: true },
        React.createElement(Box, { column: true, fullWidth: true, justifySpaceBetween: true },
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
};
const SidePanelButton = React.forwardRef((props, ref) => {
    const { btnText, ...rest } = props;
    return (React.createElement(Button, Object.assign({ primary: true, ref: ref, renderIcon: props.children && (() => props.children), textProps: {
            large: true
        } }, rest), btnText ? btnText : ""));
});
export const EXPLORE_MAP_DATA_NAME = "ExploreMapDataButton";
export const SIDE_PANEL_UPLOAD_BUTTON_NAME = "SidePanelUploadButton";
const SidePanel = observer(({ viewState, theme, refForExploreMapData, refForUploadData }) => {
    const terria = viewState.terria;
    const { t } = useTranslation();
    const onAddDataClicked = (e) => {
        e.stopPropagation();
        viewState.setTopElement(ExplorerWindowElementName);
        viewState.openAddData();
    };
    const onAddLocalDataClicked = (e) => {
        e.stopPropagation();
        viewState.setTopElement(ExplorerWindowElementName);
        viewState.openUserData();
    };
    const addData = t("addData.addDataBtnText");
    const uploadText = t("models.catalog.upload");
    return (React.createElement(Box, { column: true, styledMinHeight: "0", flex: 1 },
        React.createElement("div", { css: `
            padding: 0 5px;
            background: ${theme.dark};
          ` },
            React.createElement(SearchBoxAndResults, { viewState: viewState, terria: terria, placeholder: t("search.placeholder") }),
            React.createElement(Spacing, { bottom: 2 }),
            React.createElement(Box, { justifySpaceBetween: true },
                React.createElement(SidePanelButton, { ref: refForExploreMapData, onClick: onAddDataClicked, title: addData, btnText: addData, styledWidth: "200px" },
                    React.createElement(StyledIcon, { glyph: Icon.GLYPHS.add, light: true, styledWidth: "20px" })),
                React.createElement(SidePanelButton, { ref: refForUploadData, onClick: onAddLocalDataClicked, title: t("addData.load"), btnText: uploadText, styledWidth: "130px" },
                    React.createElement(StyledIcon, { glyph: Icon.GLYPHS.uploadThin, light: true, styledWidth: "20px" }))),
            React.createElement(Spacing, { bottom: 1 })),
        React.createElement(Box, { styledMinHeight: "0", flex: 1, css: `
            overflow: hidden;
          ` }, terria.workbench.items && terria.workbench.items.length > 0 ? (React.createElement(Workbench, { viewState: viewState, terria: terria })) : (React.createElement(EmptyWorkbench, { theme: theme })))));
});
// Used to create two refs for <SidePanel /> to consume, rather than
// using the withTerriaRef() HOC twice, designed for a single ref
const SidePanelWithRefs = (props) => {
    const refForExploreMapData = useRefForTerria(EXPLORE_MAP_DATA_NAME, props.viewState);
    const refForUploadData = useRefForTerria(SIDE_PANEL_UPLOAD_BUTTON_NAME, props.viewState);
    return (React.createElement(SidePanel, Object.assign({}, props, { refForExploreMapData: refForExploreMapData, refForUploadData: refForUploadData })));
};
export default withTranslation()(withViewState(withTheme(SidePanelWithRefs)));
//# sourceMappingURL=SidePanel.js.map
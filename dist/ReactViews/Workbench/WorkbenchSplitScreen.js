// import React, { useState } from "react";
// import styled from "styled-components";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import ViewerMode from "../../Models/ViewerMode";
import Box from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import { GLYPHS, StyledIcon } from "../../Styled/Icon";
import Spacing from "../../Styled/Spacing";
import TerrainSide from "../Map/Panels/TerrainSide";
const WorkbenchSplitScreen = observer((props) => {
    var _a, _b;
    const { t } = useTranslation();
    const theme = useTheme();
    const { terria } = props;
    const isCesiumWithTerrain = terria.mainViewer.viewerMode === ViewerMode.Cesium &&
        terria.mainViewer.viewerOptions.useTerrain && ((_b = (_a = terria.currentViewer) === null || _a === void 0 ? void 0 : _a.scene) === null || _b === void 0 ? void 0 : _b.globe);
    if (!isCesiumWithTerrain)
        return null;
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { fullWidth: true, column: true, css: `
            background: ${theme.darkWithOverlay};
            color: ${theme.textLight};
            border-radius: 2px;
          ` },
            React.createElement(Box, { fullWidth: true, centered: true, justifySpaceBetween: true, css: `
              background: ${theme.colorSecondary};
              border-radius: 2px 2px 0 0;
              padding: 0 10px;
              font-weight: bold;
              font-size: 14px;
              color: ${theme.textLight};
              line-height: 34px;
            ` },
                React.createElement(Box, null, t("workbench.splitScreenMode")),
                React.createElement(RawButton, { onClick: () => {
                        runInAction(() => (terria.showSplitter = !terria.showSplitter));
                    }, css: `
                display: flex;
                align-items: center;
              ` },
                    React.createElement(StyledIcon, { glyph: GLYPHS.close, light: true, styledWidth: "1em" }))),
            React.createElement(Box, { fullWidth: true, paddedHorizontally: true },
                React.createElement(TerrainSide, { terria: terria, spaced: false, buttonProps: {
                        css: `border: 0;
                padding: 8px 0;
              `
                    }, activeColor: theme.colorSecondary }))),
        React.createElement(Spacing, { bottom: 1 })));
});
export default WorkbenchSplitScreen;
//# sourceMappingURL=WorkbenchSplitScreen.js.map
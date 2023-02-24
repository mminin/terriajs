import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "styled-components";
import SplitDirection from "terriajs-cesium/Source/Scene/SplitDirection";
import ViewerMode from "../../../Models/ViewerMode";
import Box from "../../../Styled/Box";
import Checkbox from "../../../Styled/Checkbox/Checkbox";
import { TextSpan } from "../../../Styled/Text";
import { RawButton } from "./../../../Styled/Button";
import { Spacing } from "./../../../Styled/Spacing";
const sides = {
    left: "settingPanel.terrain.left",
    both: "settingPanel.terrain.both",
    right: "settingPanel.terrain.right"
};
const TerrainSide = observer((props) => {
    var _a, _b;
    const { t } = useTranslation();
    const theme = useTheme();
    const { terria } = props;
    const showTerrainOnSide = (side, event) => {
        event && event.stopPropagation();
        runInAction(() => {
            switch (side) {
                case sides.left:
                    terria.terrainSplitDirection = SplitDirection.LEFT;
                    terria.showSplitter = true;
                    break;
                case sides.right:
                    terria.terrainSplitDirection = SplitDirection.RIGHT;
                    terria.showSplitter = true;
                    break;
                case sides.both:
                    terria.terrainSplitDirection = SplitDirection.NONE;
                    break;
            }
            terria.currentViewer.notifyRepaintRequired();
        });
    };
    const toggleDepthTestAgainstTerrainEnabled = (event) => {
        event.stopPropagation();
        runInAction(() => {
            terria.depthTestAgainstTerrainEnabled =
                !terria.depthTestAgainstTerrainEnabled;
        });
        terria.currentViewer.notifyRepaintRequired();
    };
    const isCesiumWithTerrain = terria.mainViewer.viewerMode === ViewerMode.Cesium &&
        terria.mainViewer.viewerOptions.useTerrain && ((_b = (_a = terria.currentViewer) === null || _a === void 0 ? void 0 : _a.scene) === null || _b === void 0 ? void 0 : _b.globe);
    const supportsDepthTestAgainstTerrain = isCesiumWithTerrain;
    const depthTestAgainstTerrainEnabled = supportsDepthTestAgainstTerrain && terria.depthTestAgainstTerrainEnabled;
    const depthTestAgainstTerrainLabel = depthTestAgainstTerrainEnabled
        ? t("settingPanel.terrain.showUndergroundFeatures")
        : t("settingPanel.terrain.hideUndergroundFeatures");
    let currentSide = sides.both;
    if (isCesiumWithTerrain) {
        switch (terria.terrainSplitDirection) {
            case SplitDirection.LEFT:
                currentSide = sides.left;
                break;
            case SplitDirection.RIGHT:
                currentSide = sides.right;
                break;
        }
    }
    if (!isCesiumWithTerrain)
        return null;
    return (React.createElement(Box, { padded: true, column: true, fullWidth: true },
        React.createElement(TextSpan, null, t("settingPanel.terrain.sideLabel")),
        React.createElement(Spacing, { bottom: 1 }),
        React.createElement(Box, { css: `
            ${props.spaced && `gap: 6px;`}
          ` }, Object.values(sides).map((side) => (React.createElement(RawButton, Object.assign({ key: side, onClick: (evt) => showTerrainOnSide(side, evt), css: `
                background: ${theme.overlay};
                padding: 14px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                border: 1px solid
                  ${side === currentSide
                ? `rgba(255, 255, 255, 0.5)`
                : `transparent`};
                ${props.buttonProps && props.buttonProps.css}
                ${props.activeColor &&
                side === currentSide &&
                `background-color: ${props.activeColor}`}
              ` }, props.buttonProps),
            React.createElement(TextSpan, { textLight: true, small: true }, t(side)))))),
        React.createElement(Spacing, { bottom: 1 }),
        supportsDepthTestAgainstTerrain && (React.createElement(Checkbox, { id: "depthTestAgainstTerrain", isChecked: depthTestAgainstTerrainEnabled, title: depthTestAgainstTerrainLabel, onChange: toggleDepthTestAgainstTerrainEnabled },
            React.createElement(TextSpan, null, t("settingPanel.terrain.hideUnderground"))))));
});
TerrainSide.defaultProps = {
    spaced: true
};
export default TerrainSide;
//# sourceMappingURL=TerrainSide.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import ImagerySplitDirection from "terriajs-cesium/Source/Scene/ImagerySplitDirection";
import Cesium from "../../Models/Cesium";
import ViewerMode from "../../Models/ViewerMode";
import Box from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import Checkbox from "../../Styled/Checkbox";
import Icon from "../../Styled/Icon";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
var Side;
(function (Side) {
    Side["Left"] = "Left";
    Side["Both"] = "Both";
    Side["Right"] = "Right";
})(Side || (Side = {}));
const sideValues = Object.keys(Side);
// mangled from SettingPanel.jsx
let WorkbenchSplitScreen = class WorkbenchSplitScreen extends React.Component {
    render() {
        const props = this.props;
        const terria = props.terria;
        const showTerrainOnSide = (side) => {
            runInAction(() => {
                switch (side) {
                    case "Left":
                        terria.terrainSplitDirection = ImagerySplitDirection.LEFT;
                        terria.showSplitter = true;
                        break;
                    case "Right":
                        terria.terrainSplitDirection = ImagerySplitDirection.RIGHT;
                        terria.showSplitter = true;
                        break;
                    case "Both":
                        terria.terrainSplitDirection = ImagerySplitDirection.NONE;
                        break;
                }
                terria.currentViewer.notifyRepaintRequired();
            });
        };
        const toggleDepthTestAgainstTerrainEnabled = () => {
            runInAction(() => {
                this.props.terria.depthTestAgainstTerrainEnabled = !this.props.terria
                    .depthTestAgainstTerrainEnabled;
            });
            terria.currentViewer.notifyRepaintRequired();
        };
        const isCesiumWithTerrain = terria.mainViewer.viewerMode === ViewerMode.Cesium &&
            terria.mainViewer.viewerOptions.useTerrain &&
            terria.currentViewer instanceof Cesium &&
            terria.currentViewer.scene &&
            terria.currentViewer.scene.globe;
        const supportsDepthTestAgainstTerrain = isCesiumWithTerrain;
        const supportsSide = isCesiumWithTerrain;
        let currentSide = "Both";
        if (supportsSide) {
            switch (terria.terrainSplitDirection) {
                case ImagerySplitDirection.LEFT:
                    currentSide = "Left";
                    break;
                case ImagerySplitDirection.RIGHT:
                    currentSide = "Right";
                    break;
            }
        }
        const depthTestAgainstTerrainEnabled = supportsDepthTestAgainstTerrain && terria.depthTestAgainstTerrainEnabled;
        // const depthTestAgainstTerrainFlag =
        //   terria.currentViewer &&
        //   terria.currentViewer.scene &&
        //   terria.currentViewer.scene.globe &&
        //   terria.currentViewer.scene.globe.depthTestAgainstTerrain;
        const depthTestAgainstTerrainLabel = `Press to start ${depthTestAgainstTerrainEnabled ? "showing" : "hiding"} features that are underneath the terrain surface`;
        // const { t } = useTranslation();
        if (!supportsSide) {
            return null;
        }
        return (React.createElement(Panel, null,
            React.createElement(PanelTitle, null,
                React.createElement(Box, null, "SPLIT SCREEN MODE"),
                React.createElement(RawButton, { onClick: () => {
                        runInAction(() => (terria.showSplitter = !terria.showSplitter));
                    } },
                    React.createElement(Icon, { glyph: Icon.GLYPHS.close }))),
            React.createElement(PanelBody, null,
                React.createElement(Spacing, { bottom: 1 }),
                React.createElement(Box, null,
                    React.createElement(Text, { medium: true, css: `
                padding-bottom: 6px;
              ` }, "Terrain position")),
                React.createElement(Box, null,
                    React.createElement(SidesList, null, sideValues.map(side => (React.createElement("li", { key: side },
                        React.createElement(SideButton, { isActive: side === currentSide, onClick: () => showTerrainOnSide(side) }, side)))))),
                supportsDepthTestAgainstTerrain && (React.createElement(React.Fragment, null,
                    React.createElement(Spacing, { bottom: 2 }),
                    React.createElement(Checkbox, { isChecked: depthTestAgainstTerrainEnabled, onChange: () => toggleDepthTestAgainstTerrainEnabled(), title: depthTestAgainstTerrainLabel }, "Terrain hides underground features"))),
                React.createElement(Spacing, { bottom: 1 }))));
    }
};
WorkbenchSplitScreen = __decorate([
    observer
], WorkbenchSplitScreen);
const Panel = styled(Box).attrs({ fullWidth: true, column: true }) `
  background: ${p => p.theme.darkWithOverlay};
  color: ${p => p.theme.textLight};
  svg {
    fill: ${p => p.theme.textLight};
    width: 14px;
    height: 14px;
  }
  margin: 5px 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;
const PanelTitle = styled(Box).attrs({
    fullWidth: true,
    centered: true,
    justifySpaceBetween: true
}) `
  background: ${p => p.theme.colorSecondary};
  padding: 0 10px;
  font-weight: bold;
  font-size: 14px;
  color: ${p => p.theme.textLight};
  letter-spacing: 0;
  line-height: 34px;
`;
const PanelBody = styled(Box).attrs({ column: true }) `
  background: ${p => p.theme.darkWithOverlay};
  padding: 5px 10px;
`;
const SidesList = styled.ul `
  display: flex;
  width: 100%;
  margin: 0;
  list-style: none;
  padding-left: 0;
  margin: 0;
  li {
    padding: 0;
    flex: 1;
  }
`;
const SideButton = styled.button `
  width: 100%;
  height: 30px;
  border: none !important;

  font-size: 0.85rem;
  font-weight: 400;
  line-height: 20px;
  text-align: center;

  color: ${p => p.theme.textLight};
  background-color: ${p => p.theme.dark};
  ${p => p.isActive &&
    `
    background-color: ${p.theme.colorSecondary};
  `}
  &:hover,
  &:focus {
    background-color: ${p => p.theme.colorSecondary};
  }
`;
export default WorkbenchSplitScreen;
//# sourceMappingURL=WorkbenchSplitScreen.js.map
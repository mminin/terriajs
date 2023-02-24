import classNames from "classnames";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import withControlledVisibility from "../../ReactViews/HOCs/withControlledVisibility";
import { useViewState } from "../StandardUserInterface/ViewStateContext";
import HelpButton from "./HelpButton/HelpButton";
import LangPanel from "./Panels/LangPanel/LangPanel";
import SettingPanel from "./Panels/SettingPanel";
import SharePanel from "./Panels/SharePanel/SharePanel";
import ToolsPanel from "./Panels/ToolsPanel/ToolsPanel";
import StoryButton from "./StoryButton/StoryButton";
import Styles from "./menu-bar.scss";
const StyledMenuBar = styled.div `
  pointer-events: none;
  ${(p) => p.trainerBarVisible &&
    `
    top: ${Number(p.theme.trainerHeight) + Number(p.theme.mapButtonTop)}px;
  `}
`;
// The map navigation region
const MenuBar = observer((props) => {
    var _a, _b;
    const viewState = useViewState();
    const terria = viewState.terria;
    const menuItems = props.menuItems || [];
    const handleClick = () => {
        runInAction(() => {
            viewState.topElement = "MenuBar";
        });
    };
    const storyEnabled = terria.configParameters.storyEnabled;
    const enableTools = terria.userProperties.get("tools") === "1";
    return (React.createElement(StyledMenuBar, { className: classNames(viewState.topElement === "MenuBar" ? "top-element" : "", Styles.menuBar, {
            [Styles.menuBarWorkbenchClosed]: viewState.isMapFullScreen
        }), onClick: handleClick, trainerBarVisible: viewState.trainerBarVisible },
        React.createElement("section", null,
            React.createElement("ul", { className: classNames(Styles.menu) },
                enableTools && (React.createElement("li", { className: Styles.menuItem },
                    React.createElement(ToolsPanel, null))),
                React.createElement(If, { condition: !viewState.useSmallScreenInterface },
                    React.createElement(For, { each: "element", of: props.menuLeftItems, index: "i" },
                        React.createElement("li", { className: Styles.menuItem, key: i }, element))))),
        React.createElement("section", { className: classNames(Styles.flex) },
            React.createElement("ul", { className: classNames(Styles.menu) },
                React.createElement("li", { className: Styles.menuItem },
                    React.createElement(SettingPanel, { terria: terria, viewState: viewState })),
                React.createElement("li", { className: Styles.menuItem },
                    React.createElement(HelpButton, { viewState: viewState })),
                ((_b = (_a = terria.configParameters) === null || _a === void 0 ? void 0 : _a.languageConfiguration) === null || _b === void 0 ? void 0 : _b.enabled) ? (React.createElement("li", { className: Styles.menuItem },
                    React.createElement(LangPanel, { terria: terria, smallScreen: viewState.useSmallScreenInterface }))) : null),
            React.createElement(If, { condition: storyEnabled },
                React.createElement("ul", { className: classNames(Styles.menu) },
                    React.createElement("li", { className: Styles.menuItem },
                        React.createElement(StoryButton, { terria: terria, viewState: viewState, theme: props.theme })))),
            React.createElement("ul", { className: classNames(Styles.menu) },
                React.createElement("li", { className: Styles.menuItem },
                    React.createElement(SharePanel, { terria: terria, viewState: viewState, animationDuration: props.animationDuration }))),
            React.createElement(If, { condition: !viewState.useSmallScreenInterface },
                React.createElement(For, { each: "element", of: menuItems, index: "i" },
                    React.createElement("li", { className: Styles.menuItem, key: i }, element))))));
});
MenuBar.displayName = "MenuBar";
MenuBar.propTypes = {
    animationDuration: PropTypes.number,
    menuItems: PropTypes.arrayOf(PropTypes.element),
    menuLeftItems: PropTypes.arrayOf(PropTypes.element)
};
export default withControlledVisibility(MenuBar);
//# sourceMappingURL=MenuBar.js.map
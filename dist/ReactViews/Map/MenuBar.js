import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import classNames from "classnames";
import SettingPanel from "./Panels/SettingPanel";
import SharePanel from "./Panels/SharePanel/SharePanel";
import ToolsPanel from "./Panels/ToolsPanel/ToolsPanel";
import StoryButton from "./StoryButton/StoryButton";
import LangPanel from "./Panels/LangPanel/LangPanel";
import Styles from "./menu-bar.scss";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import withControlledVisibility from "../../ReactViews/HOCs/withControlledVisibility";
import HelpButton from "./HelpButton/HelpButton";
const StyledMenuBar = styled.div `
  pointer-events: none;
  ${p => p.trainerBarVisible &&
    `
    top: ${Number(p.theme.trainerHeight) + Number(p.theme.mapButtonTop)}px;
  `}
`;
// The map navigation region
const MenuBar = observer(props => {
    var _a, _b;
    const menuItems = props.menuItems || [];
    const handleClick = () => {
        runInAction(() => {
            props.viewState.topElement = "MenuBar";
        });
    };
    const storyEnabled = props.terria.configParameters.storyEnabled;
    const enableTools = props.terria.getUserProperty("tools") === "1";
    return (React.createElement(StyledMenuBar, { className: classNames(props.viewState.topElement === "MenuBar" ? "top-element" : "", Styles.menuBar, {
            [Styles.menuBarWorkbenchClosed]: props.viewState.isMapFullScreen
        }), onClick: handleClick, trainerBarVisible: props.viewState.trainerBarVisible },
        React.createElement("section", null,
            React.createElement("ul", { className: classNames(Styles.menu) },
                enableTools && (React.createElement("li", { className: Styles.menuItem },
                    React.createElement(ToolsPanel, { terria: props.terria, viewState: props.viewState }))),
                React.createElement(If, { condition: !props.viewState.useSmallScreenInterface },
                    React.createElement(For, { each: "element", of: props.menuLeftItems, index: "i" },
                        React.createElement("li", { className: Styles.menuItem, key: i }, element))))),
        React.createElement("section", { className: classNames(Styles.flex) },
            React.createElement("ul", { className: classNames(Styles.menu) },
                React.createElement("li", { className: Styles.menuItem },
                    React.createElement(SettingPanel, { terria: props.terria, viewState: props.viewState })),
                React.createElement("li", { className: Styles.menuItem },
                    React.createElement(HelpButton, { viewState: props.viewState })),
                ((_b = (_a = props.terria.configParameters) === null || _a === void 0 ? void 0 : _a.languageConfiguration) === null || _b === void 0 ? void 0 : _b.enabled) ? (React.createElement("li", { className: Styles.menuItem },
                    React.createElement(LangPanel, { terria: props.terria, smallScreen: props.viewState.useSmallScreenInterface }))) : null),
            React.createElement(If, { condition: storyEnabled },
                React.createElement("ul", { className: classNames(Styles.menu) },
                    React.createElement("li", { className: Styles.menuItem },
                        React.createElement(StoryButton, { terria: props.terria, viewState: props.viewState, theme: props.theme })))),
            React.createElement("ul", { className: classNames(Styles.menu) },
                React.createElement("li", { className: Styles.menuItem },
                    React.createElement(SharePanel, { terria: props.terria, viewState: props.viewState, animationDuration: props.animationDuration }))),
            React.createElement(If, { condition: !props.viewState.useSmallScreenInterface },
                React.createElement(For, { each: "element", of: menuItems, index: "i" },
                    React.createElement("li", { className: Styles.menuItem, key: i }, element))))));
});
MenuBar.displayName = "MenuBar";
MenuBar.propTypes = {
    terria: PropTypes.object,
    viewState: PropTypes.object.isRequired,
    allBaseMaps: PropTypes.array,
    animationDuration: PropTypes.number,
    menuItems: PropTypes.arrayOf(PropTypes.element),
    menuLeftItems: PropTypes.arrayOf(PropTypes.element)
};
export default withControlledVisibility(MenuBar);
//# sourceMappingURL=MenuBar.js.map
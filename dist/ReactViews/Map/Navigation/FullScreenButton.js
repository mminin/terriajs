"use strict";
const React = require("react");
const createReactClass = require("create-react-class");
const PropTypes = require("prop-types");
import Styles from "./full_screen_button.scss";
import classNames from "classnames";
import Icon from "../../../Styled/Icon";
// The button to make the map full screen and hide the workbench.
const FullScreenButton = createReactClass({
    displayName: "FullScreenButton",
    propTypes: {
        terria: PropTypes.object,
        viewState: PropTypes.object.isRequired,
        animationDuration: PropTypes.number // Defaults to 1 millisecond.
    },
    getInitialState() {
        return {
            isActive: false
        };
    },
    toggleFullScreen() {
        this.props.viewState.setIsMapFullScreen(!this.props.viewState.isMapFullScreen);
    },
    renderButtonText() {
        if (this.props.viewState.isMapFullScreen) {
            return React.createElement("span", { className: Styles.exit }, "Show Workbench");
        }
        else {
            return React.createElement(Icon, { glyph: Icon.GLYPHS.expand });
        }
    },
    render() {
        const btnClassName = classNames(Styles.btn, {
            [Styles.isActive]: this.props.viewState.isMapFullScreen
        });
        const btnTitle = this.props.viewState.isMapFullScreen
            ? "Show workbench"
            : "Hide workbench";
        return (React.createElement("div", { className: Styles.fullScreen },
            React.createElement("button", { type: "button", onClick: this.toggleFullScreen, title: btnTitle, className: btnClassName },
                React.createElement("span", null, this.renderButtonText()))));
    }
});
module.exports = FullScreenButton;
//# sourceMappingURL=FullScreenButton.js.map
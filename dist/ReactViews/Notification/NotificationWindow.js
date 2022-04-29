"use strict";
import classNames from "classnames";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import React from "react";
import defined from "terriajs-cesium/Source/Core/defined";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import Styles from "./notification-window.scss";
const NotificationWindow = createReactClass({
    displayName: "NotificationWindow",
    propTypes: {
        viewState: PropTypes.object,
        title: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.func.isRequired
        ]),
        message: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.func.isRequired
        ]),
        confirmText: PropTypes.string,
        denyText: PropTypes.string,
        onConfirm: PropTypes.func.isRequired,
        onDeny: PropTypes.func.isRequired,
        type: PropTypes.string,
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },
    confirm(e) {
        e.stopPropagation();
        if (this.props.onConfirm) {
            this.props.onConfirm();
        }
    },
    deny(e) {
        e.stopPropagation();
        if (this.props.onDeny) {
            this.props.onDeny();
        }
    },
    render() {
        var _a;
        const title = typeof this.props.title === "function"
            ? this.props.title(this.props.viewState)
            : (_a = this.props.title) !== null && _a !== void 0 ? _a : "";
        let message = typeof this.props.message === "function"
            ? this.props.message(this.props.viewState)
            : this.props.message;
        if (typeof message === "string") {
            message = parseCustomMarkdownToReact(message);
        }
        const confirmText = this.props.confirmText || "OK";
        const denyText = this.props.denyText;
        const type = this.props.type;
        const divStyle = {
            height: defined(this.props.height) ? this.props.height : "auto",
            width: defined(this.props.width) ? this.props.width : "500px"
        };
        const isStory = type === "story";
        return (React.createElement("div", { className: classNames(Styles.wrapper, `${type}`) },
            React.createElement("div", { className: Styles.notification, isStory: isStory, css: `
            background: ${p => p.isStory ? p.theme.colorPrimary : p.theme.dark};
            a,
            a:visited {
              color: ${p => p.theme.primary};
            }
          ` },
                React.createElement("div", { className: Styles.inner, style: divStyle },
                    React.createElement("h3", { className: "title" }, title),
                    window.location.host === "localhost:3001" &&
                        title.toLowerCase().indexOf("error") >= 0 && (React.createElement("div", null,
                        React.createElement("img", { src: "./build/TerriaJS/images/feature.gif" }))),
                    React.createElement("div", { className: Styles.body }, message)),
                React.createElement("div", { className: Styles.footer },
                    React.createElement(If, { condition: denyText },
                        React.createElement("button", { type: "button", className: Styles.btn, onClick: this.deny }, denyText)),
                    React.createElement("button", { type: "button", className: Styles.btn, onClick: this.confirm }, confirmText)))));
    }
});
module.exports.default = NotificationWindow;
//# sourceMappingURL=NotificationWindow.js.map
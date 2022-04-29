"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Icon from "../Styled/Icon";
import Styles from "./drag-drop-notification.scss";
import { observer } from "mobx-react";
import { reaction } from "mobx";
let DragDropNotification = class DragDropNotification extends React.Component {
    constructor(props) {
        super(props);
        this.notificationTimeout = null;
        this.lastUploadedFilesReaction = null;
        this.state = {
            showNotification: false
        };
    }
    componentDidMount() {
        this.lastUploadedFilesReaction = reaction(() => this.props.viewState.lastUploadedFiles, () => {
            clearTimeout(this.notificationTimeout);
            // show notification, restart timer
            this.setState({
                showNotification: true
            });
            // initialise new time out
            this.notificationTimeout = setTimeout(() => {
                this.setState({
                    showNotification: false
                });
            }, 5000);
        });
    }
    componentWillUnmount() {
        clearTimeout(this.notificationTimeout);
        this.lastUploadedFilesReaction();
    }
    handleHover() {
        // reset timer on hover
        clearTimeout(this.notificationTimeout);
    }
    handleMouseLeave() {
        this.notificationTimeout = setTimeout(() => {
            this.setState({
                showNotification: false
            });
        }, 4000);
    }
    handleClick() {
        this.props.viewState.openUserData();
    }
    render() {
        const fileNames = this.props.viewState.lastUploadedFiles.join(",");
        return (React.createElement("button", { className: classNames(Styles.notification, {
                [Styles.isActive]: this.state.showNotification && fileNames.length > 0
            }), onMouseEnter: this.handleHover.bind(this), onMouseLeave: this.handleMouseLeave.bind(this), onClick: this.handleClick.bind(this) },
            React.createElement("div", { className: Styles.icon },
                React.createElement(Icon, { glyph: Icon.GLYPHS.upload })),
            React.createElement("div", { className: Styles.info },
                React.createElement("span", { className: Styles.filename },
                    '"',
                    fileNames,
                    '"'),
                " ",
                this.props.viewState.lastUploadedFiles.length > 1 ? "have" : "has",
                " ",
                "been added to ",
                React.createElement("span", { className: Styles.action }, "My data"))));
    }
};
DragDropNotification.propTypes = {
    viewState: PropTypes.object
};
DragDropNotification = __decorate([
    observer
], DragDropNotification);
module.exports = DragDropNotification;
//# sourceMappingURL=DragDropNotification.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observer } from "mobx-react";
import React from "react";
import Box from "../../../Styled/Box";
import { RawButton } from "../../../Styled/Button";
import { SpacingSpan } from "../../../Styled/Spacing";
import Text, { TextSpan } from "../../../Styled/Text";
import { GLYPHS, StyledIcon } from "../../../Styled/Icon";
export const CollapseIcon = props => {
    var _a;
    return (React.createElement(StyledIcon, { displayInline: true, styledWidth: "8px", light: (_a = props.light) !== null && _a !== void 0 ? _a : true, glyph: props.btnStyle === "plus"
            ? props.isOpen
                ? GLYPHS.minus
                : GLYPHS.plus
            : GLYPHS.opened, opacity: props.isOpen ? 1 : 0.4, rotation: props.isOpen ? 0 : -90 }));
};
let Collapsible = class Collapsible extends React.Component {
    constructor(props) {
        var _a;
        super(props);
        this.state = { isOpen: (_a = props.isOpen) !== null && _a !== void 0 ? _a : false };
    }
    toggleOpen() {
        this.setState({ isOpen: !this.state.isOpen });
        if (this.props.onToggle)
            this.props.onToggle(!this.state.isOpen);
    }
    render() {
        var _a, _b;
        return (React.createElement(React.Fragment, null,
            React.createElement(RawButton, { fullWidth: true, onClick: this.toggleOpen.bind(this), css: `
            text-align: left;
            display: flex;
            align-items: center;
          `, "aria-expanded": this.state.isOpen, "aria-controls": `${this.props.title}` },
                !this.props.btnRight && (React.createElement(CollapseIcon, Object.assign({}, this.props, { isOpen: this.state.isOpen }))),
                !this.props.btnRight && React.createElement(SpacingSpan, { right: 2 }),
                React.createElement(TextSpan, Object.assign({ textLight: (_a = this.props.light) !== null && _a !== void 0 ? _a : true, bold: true, medium: true }, this.props.titleTextProps), this.props.title),
                this.props.btnRight && React.createElement(SpacingSpan, { right: 2 }),
                this.props.btnRight && (React.createElement(CollapseIcon, Object.assign({}, this.props, { isOpen: this.state.isOpen })))),
            React.createElement(Box, Object.assign({}, this.props.bodyBoxProps), this.state.isOpen && (React.createElement(Text, Object.assign({ textLight: (_b = this.props.light) !== null && _b !== void 0 ? _b : true, small: true, id: `${this.props.title}` }, this.props.bodyTextProps), this.props.children)))));
    }
};
Collapsible = __decorate([
    observer
], Collapsible);
export default Collapsible;
//# sourceMappingURL=Collapsible.js.map
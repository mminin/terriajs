import PropTypes from "prop-types";
import React from "react";
const MediaQuery = require("react-responsive").default;
// This should come from some config some where
const small = 768;
const medium = 992;
const large = 1300;
// Use PropTypes and Typescript because this is widely used from JSX and TSX files
const BreakpointPropTypes = {
    children: PropTypes.node
};
export function ExtraSmall(props) {
    return React.createElement(MediaQuery, { maxWidth: small }, props.children);
}
export function Small(props) {
    return React.createElement(MediaQuery, { maxWidth: small - 1 }, props.children);
}
export function Medium(props) {
    return React.createElement(MediaQuery, { minWidth: small }, props.children);
}
export function Large(props) {
    return React.createElement(MediaQuery, { minWidth: medium }, props.children);
}
export function ExtraLarge(props) {
    return React.createElement(MediaQuery, { minWidth: large }, props.children);
}
ExtraSmall.propTypes = BreakpointPropTypes;
Small.propTypes = BreakpointPropTypes;
Medium.propTypes = BreakpointPropTypes;
Large.propTypes = BreakpointPropTypes;
ExtraLarge.propTypes = BreakpointPropTypes;
//# sourceMappingURL=Responsive.js.map
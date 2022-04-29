import React from "react";
import MediaQuery from "react-responsive";
import PropTypes from "prop-types";
// This should come from some config some where
const small = 768;
const medium = 992;
const large = 1300;
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
ExtraSmall.propTypes = {
    children: PropTypes.element
};
Small.propTypes = {
    children: PropTypes.element
};
Medium.propTypes = {
    children: PropTypes.element
};
Large.propTypes = {
    children: PropTypes.element
};
ExtraLarge.propTypes = {
    children: PropTypes.element
};
//# sourceMappingURL=Responsive.js.map
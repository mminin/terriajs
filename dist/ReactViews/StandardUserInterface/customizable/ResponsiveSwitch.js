import React from "react";
import PropTypes from "prop-types";
/**
 * Higher-order component that either shows a one element or the other, depending on whether the "smallScreen" prop
 * passed to it is true or false.
 */
export default (LargeScreenComponent, SmallScreenComponent) => {
    // eslint-disable-next-line require-jsdoc
    function ResponsiveSwitch(props) {
        return (React.createElement(Choose, null,
            React.createElement(When, { condition: props.smallScreen },
                React.createElement(SmallScreenComponent, Object.assign({}, props))),
            React.createElement(Otherwise, null,
                React.createElement(LargeScreenComponent, Object.assign({}, props)))));
    }
    ResponsiveSwitch.propTypes = {
        smallScreen: PropTypes.bool
    };
    return ResponsiveSwitch;
};
//# sourceMappingURL=ResponsiveSwitch.js.map
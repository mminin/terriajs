import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import Styles from "./experimental-features.scss";
// The experimental features
const ExperimentalFeatures = createReactClass({
    displayName: "ExperimentalFeatures",
    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        experimentalItems: PropTypes.arrayOf(PropTypes.element)
    },
    getDefaultProps() {
        return {
            experimentalItems: []
        };
    },
    render() {
        return (React.createElement("div", { className: Styles.experimentalFeatures },
            React.createElement(For, { each: "item", of: this.props.experimentalItems, index: "i" },
                React.createElement("div", { className: Styles.control, key: i }, item))));
    }
});
export default ExperimentalFeatures;
//# sourceMappingURL=ExperimentalFeatures.js.map
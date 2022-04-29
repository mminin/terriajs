import React from "react";
import PropTypes from "prop-types";
import Styles from "./guidance-dot.scss";
export const GuidanceDot = ({ onClick }) => {
    return (React.createElement("button", { className: Styles.oval, onClick: onClick },
        React.createElement("div", { className: Styles.innerClone }),
        React.createElement("div", { className: Styles.inner })));
};
GuidanceDot.propTypes = {
    onClick: PropTypes.func.isRequired
};
export default GuidanceDot;
//# sourceMappingURL=GuidanceDot.js.map
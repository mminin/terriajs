/**
 * <Guidance /> is the (currently unused) "in app tour" where we have the dots,
 * whereas <Guide /> is the generic "slider/static tour"
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Styles from "./guidance.scss";
import Text from "../../Styled/Text";
import GuidanceDot from "./GuidanceDot.jsx";
const GuidanceProgress = (props) => {
    const countArray = Array.from(Array(props.max).keys()).map((e) => e++);
    const countStep = props.step;
    return (React.createElement("div", { className: Styles.indicatorWrapper }, countArray.map((count) => {
        return (React.createElement("div", { key: count, className: classNames(Styles.indicator, {
                [Styles.indicatorEnabled]: count < countStep
            }) }));
    })));
};
GuidanceProgress.propTypes = {
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired
};
const GuidanceContextModal = ({ children }) => {
    const { t } = useTranslation();
    return (React.createElement("div", { className: Styles.context },
        React.createElement(Text, { tallerHeight: true }, children),
        React.createElement("button", { className: Styles.btn }, t("general.next")),
        t("general.skip"),
        React.createElement(GuidanceProgress, { step: 2, max: 4 })));
};
GuidanceContextModal.propTypes = {
    children: PropTypes.node.isRequired
};
export const Guidance = ({ children }) => {
    const [showGuidance, setShowGuidance] = useState(false);
    return (React.createElement("div", { className: Styles.guidance },
        React.createElement(GuidanceDot, { onClick: () => setShowGuidance(!showGuidance) }),
        showGuidance && React.createElement(GuidanceContextModal, null, children)));
};
Guidance.propTypes = {
    children: PropTypes.node.isRequired
};
export default Guidance;
//# sourceMappingURL=Guidance.js.map
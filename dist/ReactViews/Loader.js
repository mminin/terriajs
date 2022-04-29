import React from "react";
import { withTranslation } from "react-i18next";
import Box from "../Styled/Box";
import { TextSpan } from "../Styled/Text";
import AnimatedSpinnerIcon from "../Styled/AnimatedSpinnerIcon";
const Loader = (props) => {
    const { message, t, boxProps, textProps, ...rest } = props;
    return (React.createElement(Box, Object.assign({ fullWidth: true, centered: true }, boxProps),
        React.createElement(AnimatedSpinnerIcon, Object.assign({ styledWidth: "15px", css: "margin: 5px" }, rest)),
        React.createElement(TextSpan, Object.assign({}, textProps), message || t("loader.loadingMessage"))));
};
export default withTranslation()(Loader);
//# sourceMappingURL=Loader.js.map
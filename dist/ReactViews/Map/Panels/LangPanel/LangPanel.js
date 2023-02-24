import React from "react";
import { useTranslation } from "react-i18next";
import Box from "../../../../Styled/Box";
import { RawButton } from "../../../../Styled/Button";
import Icon from "../../../../Styled/Icon";
import Ul, { Li } from "../../../../Styled/List";
import MenuPanel from "../../../StandardUserInterface/customizable/MenuPanel";
import Styles from "../../menu-bar.scss";
const stripLangLocale = (lang = "") => lang.split("-")[0];
export default (props) => {
    var _a;
    const { t, i18n } = useTranslation();
    if (!((_a = props.terria.configParameters.languageConfiguration) === null || _a === void 0 ? void 0 : _a.languages)) {
        return null;
    }
    return (
    //@ts-ignore - not yet ready to tackle tsfying MenuPanel
    React.createElement(MenuPanel, { theme: {
            btn: Styles.langBtn,
            icon: Icon.GLYPHS.globe
        }, btnText: props.smallScreen
            ? t("languagePanel.changeLanguage")
            : stripLangLocale(i18n.language), mobileIcon: Icon.GLYPHS.globe, smallScreen: props.smallScreen },
        React.createElement(Box, { styledPadding: "20px 10px 10px 10px" },
            React.createElement(Ul, { spaced: true, lined: true, fullWidth: true, column: true, css: `
            padding-left: 0;
          ` }, Object.entries(props.terria.configParameters.languageConfiguration.languages).map(([key, value]) => (React.createElement(Li, { key: key },
                React.createElement(RawButton, { onClick: () => i18n.changeLanguage(key) }, value))))))));
};
//# sourceMappingURL=LangPanel.js.map
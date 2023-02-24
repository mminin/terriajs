import React from "react";
import { useTranslation } from "react-i18next";
import Text from "../../../../../Styled/Text";
const bookMarkHelpItemName = "bookmarkHelp";
export const ShareUrlBookmark = ({ viewState }) => {
    var _a;
    const { t } = useTranslation();
    return ((_a = viewState.terria.configParameters.helpContent) === null || _a === void 0 ? void 0 : _a.some((e) => e.itemName === bookMarkHelpItemName)) ? (React.createElement(Text, { medium: true, textLight: true, isLink: true, onClick: (evt) => viewState.openHelpPanelItemFromSharePanel(evt, bookMarkHelpItemName) }, t("share.getShareSaveHelpMessage"))) : null;
};
//# sourceMappingURL=ShareUrlBookmark.js.map
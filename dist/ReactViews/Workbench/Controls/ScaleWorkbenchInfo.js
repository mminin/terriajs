import { observer } from "mobx-react";
import React from "react";
import Text from "../../../Styled/Text";
import { applyTranslationIfExists } from "../../../Language/languageHelpers";
import MinMaxLevelMixin from "../../../ModelMixins/MinMaxLevelMixin";
import { Spacing } from "../../../Styled/Spacing";
import { useTranslation } from "react-i18next";
export const ScaleWorkbenchInfo = observer(({ item }) => {
    const { i18n } = useTranslation();
    if (!MinMaxLevelMixin.isMixedInto(item) || !item.scaleWorkbenchInfo) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Spacing, { bottom: 2 }),
        React.createElement(Text, null, applyTranslationIfExists(item.scaleWorkbenchInfo, i18n))));
});
//# sourceMappingURL=ScaleWorkbenchInfo.js.map
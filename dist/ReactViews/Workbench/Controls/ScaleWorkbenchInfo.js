import { observer } from "mobx-react";
import React from "react";
import Text from "../../../Styled/Text";
import { useTranslationIfExists } from "../../../Language/languageHelpers";
import MinMaxLevelMixin from "../../../ModelMixins/MinMaxLevelMixin";
import { Spacing } from "../../../Styled/Spacing";
export const ScaleWorkbenchInfo = observer(({ item }) => {
    if (!MinMaxLevelMixin.isMixedInto(item) || !item.scaleWorkbenchInfo) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Spacing, { bottom: 2 }),
        React.createElement(Text, null, useTranslationIfExists(item.scaleWorkbenchInfo))));
});
//# sourceMappingURL=ScaleWorkbenchInfo.js.map
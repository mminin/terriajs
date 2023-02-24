import React from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "styled-components";
import { observer } from "mobx-react";
import { getName } from "../../../../../ModelMixins/CatalogMemberMixin";
import Box from "../../../../../Styled/Box";
import Ul, { Li } from "../../../../../Styled/List";
import Text from "../../../../../Styled/Text";
import { isShareable } from "../BuildShareLink";
const WarningBox = styled(Box).attrs({
    paddedRatio: 2,
    rounded: true,
    column: true
}) `
  background: #feb938;
  color: #552800;
`;
const WarningLink = styled.a `
  color: #552800;
  text-decoration: underline;
  cursor: pointer;
`;
export const ShareUrlWarning = observer(({ terria, viewState, callback }) => {
    const { t } = useTranslation();
    const unshareableItems = terria.catalog.userAddedDataGroup.memberModels.filter((model) => !isShareable(terria)(model.uniqueId || ""));
    if (unshareableItems.length === 0) {
        return null;
    }
    const addWebData = () => {
        viewState.openUserData();
        callback();
    };
    return (React.createElement(WarningBox, null,
        React.createElement(Trans, { t: t, i18nKey: "share.localDataNote" },
            React.createElement(Text, { bold: true },
                React.createElement("strong", null, "Note:")),
            React.createElement(Text, null,
                "The following data sources will NOT be shared because they include data from this local system. To share these data sources, publish their data on a web server and",
                " ",
                React.createElement(WarningLink, { onClick: addWebData }, "add them using a url"),
                ".")),
        React.createElement(Ul, { css: `
            padding: 0;
          ` }, unshareableItems.map((item, i) => {
            return (React.createElement(Li, { key: i },
                React.createElement("strong", null, getName(item))));
        }))));
});
//# sourceMappingURL=ShareUrlWarning.js.map
import React from "react";
import { observer } from "mobx-react";
import Icon, { StyledIcon } from "../../Styled/Icon";
import ButtonAsLabel from "../../Styled/ButtonAsLabel";
import Box from "../../Styled/Box";
import Text from "../../Styled/Text";
import Spacing from "../../Styled/Spacing";
import { useTranslation } from "react-i18next";
import withControlledVisibility from "../HOCs/withControlledVisibility";
import MappableMixin from "../../ModelMixins/MappableMixin";
const MapDataCount = observer(function (props) {
    const { t } = useTranslation();
    const { terria, viewState } = props;
    if (viewState.useSmallScreenInterface) {
        return null;
    }
    // Can't simply use number of items given they can exist in workbench
    // without being shown on map
    const numberOfDatasets = terria.workbench.items.filter((item) => {
        if (MappableMixin.isMixedInto(item)) {
            return item.show;
        }
    }).length;
    const hasMapData = numberOfDatasets !== 0;
    const mapDataText = hasMapData
        ? t("countDatasets.mapDataState", {
            count: numberOfDatasets
        })
        : t("countDatasets.noMapDataEnabled");
    return (
    // Should we even provide a wrapper Box? makes sense not to, but most of the
    // components as they stand come with their own "wrapper" via scss
    // <Box styledMinHeight="72px">
    React.createElement(Box, null,
        React.createElement(ButtonAsLabel, { light: hasMapData },
            React.createElement(Spacing, { right: 1 }),
            React.createElement(StyledIcon, { glyph: hasMapData ? Icon.GLYPHS.mapDataActive : Icon.GLYPHS.mapDataInactive, light: !hasMapData, dark: hasMapData, styledWidth: "20px" }),
            React.createElement(Spacing, { right: 2 }),
            React.createElement(Text, { semiBold: true }, mapDataText),
            React.createElement(Spacing, { right: 3 }))));
});
export default withControlledVisibility(MapDataCount);
//# sourceMappingURL=MapDataCount.js.map
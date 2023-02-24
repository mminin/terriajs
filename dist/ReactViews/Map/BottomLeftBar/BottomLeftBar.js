import React from "react";
import { useTranslation } from "react-i18next";
import Icon from "../../../Styled/Icon";
import styled, { useTheme } from "styled-components";
import Box from "../../../Styled/Box";
import MapDataCount from "../../BottomDock/MapDataCount";
import MapIconButton from "../../MapIconButton/MapIconButton";
import defined from "terriajs-cesium/Source/Core/defined";
const BottomLeftContainer = styled(Box) `
  position: absolute;
  bottom: 40px;

  @media (max-width: ${(props) => props.theme.mobile}px) {
    bottom: 35px;
  }
`;
const shouldShowPlayStoryButton = (props) => props.terria.configParameters.storyEnabled &&
    defined(props.terria.stories) &&
    props.terria.stories.length > 0 &&
    props.viewState.useSmallScreenInterface;
const BottomLeftBar = (props) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isNotificationActive = props.terria.notificationState.currentNotification;
    return (React.createElement(BottomLeftContainer, { theme: theme },
        React.createElement(MapDataCount, { terria: props.terria, viewState: props.viewState, elementConfig: props.terria.elements.get("map-data-count") }),
        shouldShowPlayStoryButton(props) ? (React.createElement(Box, { paddedHorizontally: 2 },
            React.createElement(MapIconButton, { title: t("story.playStory"), neverCollapse: true, iconElement: () => React.createElement(Icon, { glyph: Icon.GLYPHS.playStory }), onClick: () => props.viewState.runStories(), primary: !isNotificationActive }, t("story.playStory")))) : null));
};
export default BottomLeftBar;
//# sourceMappingURL=BottomLeftBar.js.map
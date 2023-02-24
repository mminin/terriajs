import React from "react";
import { Trans, useTranslation } from "react-i18next";
import triggerResize from "../../../Core/triggerResize";
import Icon from "../../../Styled/Icon";
import Text from "../../../Styled/Text";
import Prompt from "../../Generic/Prompt";
import { useRefForTerria } from "../../Hooks/useRefForTerria";
import Styles from "./story-button.scss";
const STORY_BUTTON_NAME = "MenuBarStoryButton";
export const onStoryButtonClick = (props) => () => {
    props.viewState.toggleStoryBuilder();
    props.terria.currentViewer.notifyRepaintRequired();
    // Allow any animations to finish, then trigger a resize.
    setTimeout(function () {
        triggerResize();
    }, props.animationDuration || 1);
    props.viewState.toggleFeaturePrompt("story", false, true);
};
const promptHtml = (hasStories) => (React.createElement(Text, { textLight: true, textAlignCenter: true }, hasStories ? (React.createElement(Trans, { i18nKey: "story.promptHtml1" },
    React.createElement(Text, { extraLarge: true }, "You can view and create stories at any time by clicking here."))) : (React.createElement(Trans, { i18nKey: "story.promptHtml2" },
    React.createElement("div", null,
        React.createElement(Text, null, "INTRODUCING"),
        React.createElement(Text, { bold: true, extraExtraLarge: true, styledLineHeight: "32px" }, "Data Stories"),
        React.createElement(Text, { medium: true }, "Create and share interactive stories directly from your map."))))));
export default (props) => {
    const storyButtonRef = useRefForTerria(STORY_BUTTON_NAME, props.viewState);
    const storyEnabled = props.terria.configParameters.storyEnabled;
    const dismissAction = () => {
        props.viewState.toggleFeaturePrompt("story", false, true);
    };
    const delayTime = storyEnabled && props.terria.stories.length > 0 ? 1000 : 2000;
    const { t } = useTranslation();
    return (React.createElement("div", null,
        React.createElement("button", { ref: storyButtonRef, className: Styles.storyBtn, type: "button", onClick: onStoryButtonClick(props), "aria-expanded": props.viewState.storyBuilderShown, css: `
          ${(p) => p["aria-expanded"] &&
                `&:not(.foo) {
                      background: ${p.theme.colorPrimary};
                      svg {
                        fill: ${p.theme.textLight};
                      }
                    }`}
        ` },
            React.createElement(Icon, { glyph: Icon.GLYPHS.story }),
            React.createElement("span", null, t("story.story"))),
        React.createElement(Prompt, { centered: true, isVisible: storyEnabled && props.viewState.featurePrompts.indexOf("story") >= 0, content: promptHtml(props.terria.stories.length > 0), displayDelay: delayTime, dismissText: t("story.dismissText"), dismissAction: dismissAction })));
};
//# sourceMappingURL=StoryButton.js.map
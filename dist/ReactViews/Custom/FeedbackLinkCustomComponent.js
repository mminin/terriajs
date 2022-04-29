import i18next from "i18next";
import { runInAction } from "mobx";
import React from "react";
import { RawButton } from "../../Styled/Button";
import Text from "../../Styled/Text";
import CustomComponent from "./CustomComponent";
import parseCustomMarkdownToReact from "./parseCustomMarkdownToReact";
function showFeedback(viewState) {
    runInAction(() => {
        viewState.feedbackFormIsVisible = true;
        viewState.terria.notificationState.dismissCurrentNotification();
    });
}
export const FeedbackLink = (props) => 
// If we have feedbackUrl = show button to open feedback dialog
props.viewState.terria.configParameters.feedbackUrl ? (React.createElement(RawButton, { fullWidth: true, onClick: () => showFeedback(props.viewState), css: `
        text-align: left;
      ` },
    React.createElement(Text, { bold: true }, parseCustomMarkdownToReact(props.feedbackMessage
        ? props.feedbackMessage
        : i18next.t("models.raiseError.notificationFeedback"))))) : (
// If we only have supportEmail - show message and the email address
React.createElement(React.Fragment, null, parseCustomMarkdownToReact(props.emailMessage
    ? `${props.emailMessage} ${props.viewState.terria.supportEmail}`
    : i18next.t("models.raiseError.notificationFeedbackEmail", {
        email: props.viewState.terria.supportEmail
    }))));
/**
 * A `<feedbacklink>` custom component, which displays a feedback button (if the feature is enabled), or an email address.
 */
export default class FeedbackLinkCustomComponent extends CustomComponent {
    get name() {
        return FeedbackLinkCustomComponent.componentName;
    }
    get attributes() {
        return ["email-message", "feedback-message"];
    }
    processNode(context, node, children) {
        var _a, _b;
        if (!context.viewState)
            return React.createElement(React.Fragment, null);
        return (React.createElement(FeedbackLink, { viewState: context.viewState, emailMessage: (_a = node.attribs) === null || _a === void 0 ? void 0 : _a["email-message"], feedbackMessage: (_b = node.attribs) === null || _b === void 0 ? void 0 : _b["feedback-message"] }));
    }
}
FeedbackLinkCustomComponent.componentName = "feedbacklink";
//# sourceMappingURL=FeedbackLinkCustomComponent.js.map
import i18next from "i18next";
import { runInAction } from "mobx";
import React from "react";
import isDefined from "../../Core/isDefined";
import Collapsible from "../Custom/Collapsible/Collapsible";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
import Text, { TextSpan } from "../../Styled/Text";
import { RawButton } from "../../Styled/Button";
import Spacing from "../../Styled/Spacing";
export const shareConvertNotification = (messages) => (viewState) => {
    const messagesForPath = {};
    messages === null || messages === void 0 ? void 0 : messages.forEach((message) => {
        var _a;
        let pathString = (_a = message.path) === null || _a === void 0 ? void 0 : _a.join(": ");
        if (!pathString || pathString === null || pathString === "")
            pathString = "root";
        isDefined(messagesForPath[pathString])
            ? messagesForPath[pathString].push(message.message)
            : (messagesForPath[pathString] = [message.message]);
    });
    const rootMessages = messagesForPath["root"];
    delete messagesForPath["root"];
    const showHelp = () => {
        viewState.showHelpPanel();
        viewState.selectHelpMenuItem("storymigration");
        viewState.terria.notificationState.dismissCurrentNotification();
    };
    const showFeedback = () => {
        runInAction(() => {
            viewState.feedbackFormIsVisible = true;
        });
        viewState.terria.notificationState.dismissCurrentNotification();
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Text, null, parseCustomMarkdownToReact(i18next.t("share.convertNotificationMessage"))),
        React.createElement(RawButton, { fullWidth: true, onClick: showHelp, css: `
          text-align: left;
        ` },
            React.createElement(TextSpan, { textLight: true, bold: true, medium: true }, parseCustomMarkdownToReact(i18next.t("share.convertNotificationHelp")))),
        React.createElement(RawButton, { fullWidth: true, onClick: showFeedback, css: `
          text-align: left;
        ` },
            React.createElement(TextSpan, { textLight: true, bold: true, medium: true }, parseCustomMarkdownToReact(i18next.t("share.convertNotificationFeedback")))),
        React.createElement(Spacing, { bottom: 2 }),
        React.createElement(Collapsible, { btnRight: true, title: i18next.t("share.convertNotificationWarningsTitle"), titleTextProps: { large: true }, bodyBoxProps: { padded: true } },
            rootMessages && (React.createElement(React.Fragment, null,
                React.createElement("ul", null, rootMessages.map(message => (React.createElement("li", null, message)))),
                React.createElement(Spacing, { bottom: 1 }))),
            Object.entries(messagesForPath).map(([path, messages]) => (React.createElement(React.Fragment, null,
                React.createElement(Spacing, { bottom: 1 }),
                React.createElement(Collapsible, { btnRight: true, title: path && path !== ""
                        ? path
                        : i18next.t("share.convertNotificationWarningsTitle") },
                    React.createElement("ul", null, messages.map(message => (React.createElement("li", null, message)))))))))));
};
//# sourceMappingURL=shareConvertNotification.js.map
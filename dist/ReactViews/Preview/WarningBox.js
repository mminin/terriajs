import { runInAction } from "mobx";
import React from "react";
import Box from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import Spacing from "../../Styled/Spacing";
import { TextSpan } from "../../Styled/Text";
import FeedbackLinkCustomComponent, { FeedbackLink } from "../Custom/FeedbackLinkCustomComponent";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
// Hard code colour for now
const warningColor = "#f69900";
const showErrorNotification = (viewState, error) => {
    runInAction(() => {
        error.showDetails = true;
    });
    viewState.terria.raiseErrorToUser(error, undefined, true);
};
const WarningBox = (props) => {
    var _a, _b, _c, _d, _e, _f;
    // We only show FeedbankLink if the error message doesn't include the <feedbacklink> custom component (so we don't get duplicates)
    const includesFeedbackLink = (_a = props.error) === null || _a === void 0 ? void 0 : _a.highestImportanceError.message.includes(`<${FeedbackLinkCustomComponent.componentName}`);
    return (React.createElement(Box, { backgroundColor: warningColor, rounded: true, padded: true },
        React.createElement(Spacing, { right: 1 }),
        React.createElement(WarningIcon, null),
        React.createElement(Spacing, { right: 2 }),
        React.createElement(Box, { backgroundColor: "#ffffff", rounded: true, fullWidth: true, paddedRatio: 3 }, props.error ? (React.createElement("div", null,
            parseCustomMarkdownToReact(`### ${(_c = (_b = props.error) === null || _b === void 0 ? void 0 : _b.highestImportanceError) === null || _c === void 0 ? void 0 : _c.title}`),
            parseCustomMarkdownToReact((_e = (_d = props.error) === null || _d === void 0 ? void 0 : _d.highestImportanceError) === null || _e === void 0 ? void 0 : _e.message, { viewState: props.viewState, terria: (_f = props.viewState) === null || _f === void 0 ? void 0 : _f.terria }),
            props.viewState && !includesFeedbackLink ? (React.createElement(FeedbackLink, { viewState: props.viewState })) : null,
            props.viewState &&
                Array.isArray(props.error.originalError) &&
                props.error.originalError.length > 0 ? (React.createElement("div", null,
                React.createElement(RawButton, { activeStyles: true, onClick: () => showErrorNotification(props.viewState, props.error) },
                    React.createElement(TextSpan, { primary: true }, "See details")))) : null)) : (props.children))));
};
// Equilateral triangle
const WarningIcon = () => (React.createElement("p", { css: `
      width: 0px;
      height: 0px;
      text-indent: -2px;
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 20px solid white;
      font-weight: bold;
      line-height: 25px;
      user-select: none;
    ` }, "!"));
export default WarningBox;
//# sourceMappingURL=WarningBox.js.map
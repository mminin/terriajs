import i18next from "i18next";
import { runInAction } from "mobx";
import React from "react";
import TerriaError from "../../Core/TerriaError";
import Box from "../../Styled/Box";
import Spacing from "../../Styled/Spacing";
import { Text } from "../../Styled/Text";
import Collapsible from "../Custom/Collapsible/Collapsible";
import FeedbackLinkCustomComponent, { FeedbackLink } from "../Custom/FeedbackLinkCustomComponent";
import parseCustomMarkdownToReact from "../Custom/parseCustomMarkdownToReact";
const ErrorsBox = (props) => {
    return (React.createElement(React.Fragment, null, props.errors.map((error, idx) => {
        var _a, _b;
        return (React.createElement(Box, { displayInlineBlock: true, css: {
                paddingLeft: "6px",
                borderLeft: "solid 1px rgba(255,255,255,.1)"
            }, key: idx }, error instanceof TerriaError ? (React.createElement(TerriaErrorBox, { error: error, viewState: props.viewState })) : (
        // Show error.message (as well as error.stack) if error.stack is defined
        React.createElement("div", null,
            error.stack ? React.createElement("pre", null, error.message) : null,
            React.createElement("pre", null, (_b = (_a = error.stack) !== null && _a !== void 0 ? _a : error.message) !== null && _b !== void 0 ? _b : error.toString())))));
    })));
};
const TerriaErrorBox = (props) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Text, { css: `
          p {
            margin: 5px 0px;
          }
        `, textLight: true }, parseCustomMarkdownToReact(props.error.message, {
            viewState: props.viewState,
            terria: props.viewState.terria
        })),
        React.createElement(Spacing, { bottom: 1 }),
        Array.isArray(props.error.originalError) &&
            props.error.originalError.length > 0 ? (React.createElement(ErrorsBox, { errors: props.error.originalError, viewState: props.viewState })) : null));
};
export const terriaErrorNotification = (error) => (viewState) => {
    // Get "detailed" errors - these can be expanded if the user wants to see more "detail"
    let detailedErrors;
    // If the top level error is the highestImportanceError, then don't show it in detailedErrors (as it will just duplicate the top level error message)
    if (error.message !== error.highestImportanceError.message) {
        detailedErrors = [error];
    }
    else if (error.originalError) {
        detailedErrors = Array.isArray(error.originalError)
            ? error.originalError
            : [error.originalError];
    }
    // We only show FeedbackLink if the error message doesn't include the <feedbacklink> custom component (so we don't get duplicates)
    const includesFeedbackLink = error.highestImportanceError.message.includes(`<${FeedbackLinkCustomComponent.componentName}`);
    return (React.createElement(React.Fragment, null,
        React.createElement(Text, { css: `
            p {
              margin: 5px 0px;
            }
            // Fix feedback button color
            button {
              color: ${(p) => p.theme.textLight};
            }
          `, textLight: true }, parseCustomMarkdownToReact(error.highestImportanceError.message, {
            viewState: viewState,
            terria: viewState.terria
        })),
        detailedErrors ? (React.createElement(React.Fragment, null,
            React.createElement(Spacing, { bottom: 2 }),
            React.createElement(Collapsible, { btnRight: true, title: i18next.t("models.raiseError.developerDetails"), titleTextProps: { large: true }, bodyBoxProps: { padded: true }, isOpen: error.showDetails, onToggle: (show) => {
                    runInAction(() => (error.showDetails = show));
                } },
                React.createElement(ErrorsBox, { errors: detailedErrors, viewState: viewState })))) : null,
        !includesFeedbackLink ? (React.createElement(FeedbackLink, { viewState: viewState })) : null));
};
//# sourceMappingURL=terriaErrorNotification.js.map
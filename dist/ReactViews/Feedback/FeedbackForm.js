var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import { useUID } from "react-uid";
import styled, { withTheme } from "styled-components";
import sendFeedback from "../../Models/sendFeedback";
import Box from "../../Styled/Box";
import Button, { RawButton } from "../../Styled/Button";
import Checkbox from "../../Styled/Checkbox";
import { GLYPHS, StyledIcon } from "../../Styled/Icon";
import Input, { StyledInput } from "../../Styled/Input";
import Spacing from "../../Styled/Spacing";
import Text from "../../Styled/Text";
import parseCustomMarkdownToReact, { parseCustomMarkdownToReactWithOptions } from "../Custom/parseCustomMarkdownToReact";
import { useTranslationIfExists } from "./../../Language/languageHelpers";
let FeedbackForm = class FeedbackForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSending: false,
            sendShareURL: true,
            name: "",
            email: "",
            comment: "",
            commentIsValid: false
        };
        this.escKeyListener = e => {
            if (e.keyCode === 27) {
                this.onDismiss();
            }
        };
        this.onDismiss = this.onDismiss.bind(this);
        this.updateName = this.updateName.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.changeSendShareUrl = this.changeSendShareUrl.bind(this);
    }
    getInitialState() {
        return {
            isSending: false,
            sendShareURL: true,
            name: "",
            email: "",
            comment: ""
        };
    }
    componentDidMount() {
        window.addEventListener("keydown", this.escKeyListener, true);
        this.setState({
            commentIsValid: this.props.viewState.terria.configParameters.feedbackMinLength === 0
        });
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.escKeyListener, true);
    }
    resetState() {
        this.setState(this.getInitialState());
    }
    onDismiss() {
        runInAction(() => {
            this.props.viewState.feedbackFormIsVisible = false;
        });
        this.resetState();
    }
    updateName(e) {
        this.setState({
            name: e.target.value
        });
    }
    updateEmail(e) {
        this.setState({
            email: e.target.value
        });
    }
    updateComment(e) {
        this.setState({
            comment: e.target.value
        });
        if (this.state.comment.replace(/\s+/g, " ").length >=
            this.props.viewState.terria.configParameters.feedbackMinLength) {
            this.setState({
                commentIsValid: true
            });
        }
        else {
            this.setState({
                commentIsValid: false
            });
        }
    }
    changeSendShareUrl(e) {
        this.setState((prevState) => ({
            sendShareURL: !prevState.sendShareURL
        }));
    }
    onSubmit(e) {
        e.preventDefault();
        if (this.state.comment.length >=
            this.props.viewState.terria.configParameters.feedbackMinLength) {
            this.state.isSending = true;
            sendFeedback({
                terria: this.props.viewState.terria,
                name: this.state.name,
                email: this.state.email,
                sendShareURL: this.state.sendShareURL,
                comment: this.state.comment
            }).then((succeeded) => {
                if (succeeded) {
                    this.setState({
                        isSending: false,
                        comment: ""
                    });
                    runInAction(() => {
                        this.props.viewState.feedbackFormIsVisible = false;
                    });
                }
                else {
                    this.setState({
                        isSending: false
                    });
                }
            });
        }
    }
    render() {
        const { t, viewState, theme } = this.props;
        const preamble = parseCustomMarkdownToReact(useTranslationIfExists(viewState.terria.configParameters.feedbackPreamble));
        const postamble = viewState.terria.configParameters.feedbackPostamble
            ? parseCustomMarkdownToReact(useTranslationIfExists(viewState.terria.configParameters.feedbackPostamble))
            : undefined;
        return (React.createElement(FormWrapper, null,
            React.createElement(Box, { backgroundColor: theme.darkLighter, paddedRatio: 2 },
                React.createElement(Text, { textLight: true, textAlignCenter: true, semiBold: true, as: "h4", fullWidth: true, css: `
              margin: 0;
            ` }, t("feedback.title")),
                React.createElement(RawButton, { onClick: this.onDismiss },
                    React.createElement(StyledIcon, { styledWidth: "15px", light: true, glyph: GLYPHS.close }))),
            React.createElement(Form, { paddedRatio: 2, onSubmit: this.onSubmit.bind(this), column: true },
                React.createElement(Text, { textDarker: true }, preamble),
                React.createElement(StyledLabel, { viewState: viewState, textProps: {
                        textDarker: true
                    }, label: t("feedback.yourName"), spacingBottom: true },
                    React.createElement(Input, { styledHeight: "34px", white: true, fieldBorder: theme.greyLighter, border: true, id: "name", type: "text", name: "name", value: this.state.name, onChange: this.updateName, autoComplete: "off" })),
                React.createElement(StyledLabel, { viewState: viewState, textProps: {
                        textDarker: true
                    }, label: t("feedback.email"), spacingBottom: true },
                    React.createElement(Input, { styledHeight: "34px", white: true, fieldBorder: theme.greyLighter, border: true, id: "email", type: "text", name: "email", value: this.state.email, onChange: this.updateEmail, autoComplete: "off" })),
                React.createElement(StyledLabel, { viewState: viewState, textProps: {
                        textDarker: true
                    }, label: t("feedback.commentQuestion"), spacingBottom: true },
                    React.createElement(TextArea, { lineHeight: "22px", styledMinHeight: "56px", styledMaxHeight: "120px", white: true, fieldBorder: theme.greyLighter, border: true, name: "comment", value: this.state.comment, valueIsValid: this.state.commentIsValid, onChange: this.updateComment, autoComplete: "off" }),
                    !this.state.commentIsValid && (React.createElement(WarningText, null, t("feedback.minLength", {
                        minLength: viewState.terria.configParameters.feedbackMinLength
                    })))),
                React.createElement(Checkbox, { isChecked: this.state.sendShareURL, value: "sendShareUrl", onChange: this.changeSendShareUrl },
                    React.createElement(Text, null, t("feedback.shareWithDevelopers", {
                        appName: this.props.viewState.terria.appName
                    }))),
                React.createElement(Spacing, { bottom: 2 }),
                postamble ? React.createElement(Text, { textDarker: true }, postamble) : null,
                React.createElement(Box, { right: true },
                    React.createElement(Button, { type: "button", denyButton: true, rounded: true, shortMinHeight: true, styledMinWidth: "80px", onClick: this.onDismiss }, t("feedback.cancel")),
                    React.createElement(Spacing, { right: 1 }),
                    React.createElement(Button, { type: "submit", primary: true, shortMinHeight: true, styledMinWidth: "80px", disabled: this.state.comment.length <
                            viewState.terria.configParameters.feedbackMinLength ||
                            this.state.isSending }, this.state.isSending
                        ? t("feedback.sending")
                        : t("feedback.send"))))));
    }
};
FeedbackForm.displayName = "FeedbackForm";
FeedbackForm = __decorate([
    observer
], FeedbackForm);
const WarningText = styled(Text) `
  color: red;
`;
const TextArea = (props) => {
    const { value, onChange, styledMaxHeight, styledMinHeight, valueIsValid, ...rest } = props;
    const textAreaRef = useRef(null);
    useEffect(() => {
        textAreaRef.current.style.setProperty("height", `${textAreaRef.current.scrollHeight + 2}px`);
    }, [value]);
    const onChangeHandler = (event) => {
        textAreaRef.current.style.setProperty("height", "auto");
        if (props.onChange) {
            props.onChange(event);
        }
    };
    return (React.createElement(StyledTextArea, Object.assign({}, rest, { ref: textAreaRef, rows: 1, styledHeight: styledMinHeight, styledMinHeight: styledMinHeight, styledMaxHeight: styledMaxHeight, onChange: onChangeHandler, invalidValue: !valueIsValid })));
};
const StyledTextArea = styled(StyledInput).attrs({
    as: "textarea"
}) `
  line-height: ${props => props.lineHeight};
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: auto;
  -webkit-overflow-scrolling: touch;
  min-width: 100%;
  max-width: 100%;

  &::-webkit-scrollbar {
    width: 10px; /* for vertical scrollbars */
    height: 8px; /* for horizontal scrollbars */
  }

  &::-webkit-scrollbar-track {
    background: rgba(136, 136, 136, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(136, 136, 136, 0.6);
  }
`;
const StyledLabel = (props) => {
    const { viewState, label, textProps } = props;
    const id = useUID();
    const childrenWithId = React.Children.map(props.children, child => {
        // checking isValidElement is the safe way and avoids a typescript error too
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { id: id });
        }
        return child;
    });
    return (React.createElement(Box, { column: true },
        label && (React.createElement(Text, Object.assign({ as: "label", htmlFor: id, css: "p {margin: 0;}" }, textProps), parseCustomMarkdownToReactWithOptions(`${label}:`, {
            injectTermsAsTooltips: true,
            tooltipTerms: viewState.terria.configParameters.helpContentTerms
        }))),
        childrenWithId,
        props.spacingBottom && React.createElement(Spacing, { bottom: 2 })));
};
const Form = styled(Box).attrs({
    overflowY: "auto",
    scroll: true,
    as: "form"
}) ``;
const FormWrapper = styled(Box).attrs(props => ({
    column: true,
    position: "absolute",
    styledMaxHeight: "60vh",
    styledMaxWidth: "400px",
    styledWidth: "350px",
    backgroundColor: props.theme.textLight
})) `
  z-index: ${props => props.theme.notificationWindowZIndex};
  border-radius: 5px;
  @media (min-width: ${props => props.theme.sm}px) {
    bottom: 75px;
    right: 20px;
    //max-height: 60vh;
  }
  @media (max-width: ${props => props.theme.sm}px) {
    right: 0;
    top: 50px;
    left: 0;
    max-height: calc(100vh - 50px);
    min-width: 100%;
  }
`;
export default withTranslation()(withTheme(FeedbackForm));
//# sourceMappingURL=FeedbackForm.js.map
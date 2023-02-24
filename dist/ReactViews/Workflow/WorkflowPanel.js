import { action, runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";
import Button from "../../Styled/Button";
import { StyledIcon } from "../../Styled/Icon";
import { addTerriaScrollbarStyles } from "../../Styled/mixins";
import Text from "../../Styled/Text";
import { PortalChild } from "../StandardUserInterface/Portal";
import { PanelButton } from "./Panel";
export const WorkflowPanelPortalId = "workflow-panel-portal";
/** Wraps component in Portal, adds TitleBar, ErrorBoundary and Footer (PanelButton) */
const WorkflowPanel = observer((props) => {
    const viewState = props.viewState;
    useEffect(function hideTerriaSidePanelOnMount() {
        runInAction(() => {
            viewState.terria.isWorkflowPanelActive = true;
        });
        return () => {
            runInAction(() => {
                viewState.terria.isWorkflowPanelActive = false;
            });
        };
    }, []);
    return (React.createElement(PortalChild, { viewState: viewState, portalId: WorkflowPanelPortalId },
        React.createElement(Container, { className: viewState.topElement === "WorkflowPanel" ? "top-element" : "", onClick: action(() => {
                viewState.topElement = "WorkflowPanel";
            }) },
            React.createElement(TitleBar, null,
                React.createElement(Icon, { glyph: props.icon }),
                React.createElement(Title, null, props.title),
                React.createElement(CloseButton, { onClick: props.onClose }, props.closeButtonText)),
            React.createElement(Content, null,
                React.createElement(ErrorBoundary, { viewState: viewState }, props.children)),
            props.footer ? (React.createElement(PanelButton, { onClick: props.footer.onClick, title: props.footer.buttonText })) : null)));
});
class ErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error) {
        this.props.viewState.terria.raiseErrorToUser(error);
    }
    render() {
        return this.state.hasError ? (React.createElement(Error, null, "An error occurred when running the workflow. Please try re-loading the app if the error persists.")) : (this.props.children);
    }
}
const Container = styled.div `
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: ${(p) => p.theme.fontPop}px;
  width: ${(p) => p.theme.workflowPanelWidth}px;
  height: 100vh;
  max-width: ${(p) => p.theme.workflowPanelWidth}px;
  box-sizing: border-box;
  padding: 0 0 5px;
`;
const TitleBar = styled.div `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.7em;
  border-bottom: 1px solid ${(p) => p.theme.darkLighter};
`;
const FooterBar = styled(TitleBar) `
  border: none;
`;
const Title = styled(Text).attrs({
    textLight: true,
    bold: true
}) `
  flex-grow: 1;
  padding: 0 1em;
`;
const Icon = styled(StyledIcon).attrs({
    styledWidth: "24px",
    styledHeight: "24px",
    light: true
}) ``;
const Content = styled.div `
  flex-grow: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding-bottom: 4em;
  ${addTerriaScrollbarStyles()}
`;
const CloseButton = styled(Button).attrs({
    secondary: true
}) `
  border: 0px;
  border-radius: 3px;
  min-height: 0;
  padding: 3px 12px;
`;
const Error = styled.div `
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${(p) => p.theme.textLight};
  font-size: 14px;
`;
export default WorkflowPanel;
//# sourceMappingURL=WorkflowPanel.js.map
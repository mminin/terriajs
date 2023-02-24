import React from "react";
import styled from "styled-components";
import { Portal } from "../StandardUserInterface/Portal";
import { useViewState } from "../StandardUserInterface/ViewStateContext";
import { WorkflowPanelPortalId } from "./WorkflowPanel";
const WorkflowPanelPortal = ({ show }) => {
    const viewState = useViewState();
    return (React.createElement(Container, { show: show, onTransitionEnd: () => viewState.triggerResizeEvent() },
        React.createElement(Portal, { id: WorkflowPanelPortalId })));
};
const Container = styled.div `
  height: 100vh;
  width: ${(p) => p.theme.workflowPanelWidth}px;
  max-width: ${(p) => p.theme.workflowPanelWidth}px;

  transition: all 0.25s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  visibility: ${(p) => (p.show ? "visible" : "hidden")};
  margin-left: ${(p) => (p.show ? "0px" : `-${p.theme.workflowPanelWidth}px`)};
  opacity: ${(p) => (p.show ? 1 : 0)};
`;
export default WorkflowPanelPortal;
//# sourceMappingURL=WorkflowPanelPortal.js.map
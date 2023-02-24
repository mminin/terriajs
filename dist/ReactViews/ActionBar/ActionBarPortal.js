import React from "react";
import styled from "styled-components";
import { Portal } from "../StandardUserInterface/Portal";
export const ActionBarPortalId = "action-bar-ui-portal";
/**
 * A Portal to show ActionBar UI.
 */
const ActionBarPortal = ({ show }) => {
    return React.createElement(StyledPortal, { id: ActionBarPortalId, show: show });
};
const StyledPortal = styled(Portal) `
  display: flex;
  position: absolute;
  height: 56px;
  visibility: ${(p) => (p.show ? "visible" : "hidden")};
  max-width: 60%;
  bottom: ${(p) => (p.show ? "80px" : "-56px")};
  left: 0;
  right: 0;
  margin: auto;

  /* Animate slide in-out */
  transition: all 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
`;
export default ActionBarPortal;
//# sourceMappingURL=ActionBarPortal.js.map
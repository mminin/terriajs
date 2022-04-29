import React from "react";
import styled from "styled-components";
/**
 * A toast component that positions its children bottom center of the map
 */
const Toast = ({ children }) => {
    return React.createElement(Container, null, children);
};
const Container = styled.div `
  position: absolute;
  bottom: 40px;
  left: 20px; // on mobile
  @media (min-width: ${props => props.theme.sm}px) {
    left: 45%; // on larger screens
  }

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 7px;

  border-radius: 16px;
  min-height: 32px;
  background: ${p => p.theme.textLight};
`;
export default Toast;
//# sourceMappingURL=Toast.js.map
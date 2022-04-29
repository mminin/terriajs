import styled, { css } from "styled-components";
export const Li = styled.li ``;
export const Ul = styled.ul `
  list-style: none;
  padding: 0;
  margin: 0;
  ${props => props.fullWidth && "width: 100%;"}
  ${props => props.spaced &&
    css `
      ${Li}:not(:first-child) {
        padding-top: 5px;
      }
    `}

  ${props => props.lined &&
    css `
      ${Li}:first-child {
        padding-bottom: 5px;
      }
      ${Li}:not(:first-child) {
        border-top: 1px solid grey;
      }
    `}
`;
export const Ol = styled(Ul).attrs({
    as: "ol"
}) ``;
export default Ul;
//# sourceMappingURL=List.js.map
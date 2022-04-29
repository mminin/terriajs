import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../../../../Styled/Button";
import { downloadImg } from "./PrintView";
const ButtonBar = styled.section `
  display: flex;
  justify-content: flex-end;
`;
const PrintViewButtons = (props) => {
    const [isDisabled, setDisabled] = useState(true);
    useEffect(() => {
        var _a;
        (_a = props.screenshot) === null || _a === void 0 ? void 0 : _a.then(() => setDisabled(false));
    }, [props.screenshot]);
    return (React.createElement(ButtonBar, null,
        React.createElement(Button, { primary: true, disabled: isDisabled, onClick: (evt) => {
                var _a;
                evt.preventDefault();
                (_a = props.screenshot) === null || _a === void 0 ? void 0 : _a.then(downloadImg);
            } }, "Download map"),
        React.createElement(Button, { primary: true, disabled: isDisabled, marginLeft: 1, onClick: (evt) => {
                evt.preventDefault();
                props.window.print();
            } }, "Print")));
};
export default PrintViewButtons;
//# sourceMappingURL=PrintViewButtons.js.map
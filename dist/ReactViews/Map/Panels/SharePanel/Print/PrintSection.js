import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Box from "../../../../../Styled/Box";
import { TextSpan } from "../../../../../Styled/Text";
import Button from "../../../../../Styled/Button";
import { downloadImg } from "./PrintView";
export const PrintSection = ({ viewState }) => {
    const { t } = useTranslation();
    const [isDownloading, setIsDownloading] = useState(false);
    const printView = () => {
        const newWindow = window.open();
        viewState.setPrintWindow(newWindow);
    };
    const downloadMap = () => {
        setIsDownloading(true);
        viewState.terria.currentViewer
            .captureScreenshot()
            .then((dataString) => {
            downloadImg(dataString);
        })
            .finally(() => setIsDownloading(false));
    };
    return (React.createElement(Box, { column: true },
        React.createElement(TextSpan, { medium: true }, t("share.printTitle")),
        React.createElement(Explanation, null, t("share.printExplanation")),
        React.createElement(Box, { gap: true },
            React.createElement(PrintButton, { primary: true, fullWidth: true, disabled: isDownloading, onClick: downloadMap },
                React.createElement(TextSpan, { medium: true }, t("share.downloadMap"))),
            React.createElement(PrintButton, { primary: true, fullWidth: true, onClick: printView },
                React.createElement(TextSpan, { medium: true }, t("share.printViewButton"))))));
};
const PrintButton = styled(Button) `
  border-radius: 4px;
`;
const Explanation = styled(TextSpan) `
  opacity: 0.8;
`;
//# sourceMappingURL=PrintSection.js.map
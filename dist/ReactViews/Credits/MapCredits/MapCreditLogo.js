import React from "react";
import CreditDisplay from "terriajs-cesium/Source/Scene/CreditDisplay";
import parseCustomHtmlToReact from "../../Custom/parseCustomHtmlToReact";
export const MapCreditLogo = ({ currentViewer }) => {
    if (currentViewer.type === "Leaflet") {
        const prefix = currentViewer.attributionPrefix;
        if (prefix) {
            return React.createElement(React.Fragment, null, parseCustomHtmlToReact(prefix));
        }
        return null;
    }
    return parseCustomHtmlToReact(CreditDisplay.cesiumCredit.html, {
        disableExternalLinkIcon: true
    });
};
//# sourceMappingURL=MapCreditLogo.js.map
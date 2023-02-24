"use strict";
import { observer } from "mobx-react";
import React from "react";
import isDefined from "../../Core/isDefined";
import parseCustomHtmlToReact from "../Custom/parseCustomHtmlToReact";
import { withViewState } from "../StandardUserInterface/ViewStateContext";
const DEFAULT_BRANDING = '<a target="_blank" href="http://terria.io"><img src="images/terria_logo.png" height="52" title="Version: {{ version }}" /></a>';
export default withViewState(observer((props) => {
    var _a, _b, _c;
    // Set brandingHtmlElements to brandBarElements or default Terria branding as default
    let brandingHtmlElements = (_a = props.viewState.terria.configParameters
        .brandBarElements) !== null && _a !== void 0 ? _a : [DEFAULT_BRANDING];
    if (props.viewState.useSmallScreenInterface) {
        const brandBarSmallElements = props.viewState.terria.configParameters.brandBarSmallElements;
        const displayOne = props.viewState.terria.configParameters.displayOneBrand;
        // Use brandBarSmallElements if it exists
        if (brandBarSmallElements)
            brandingHtmlElements = brandBarSmallElements;
        // If no brandBarSmallElements, but displayOne parameter is selected
        // Try to find brand element based on displayOne index - OR find the first item that isn't an empty string (for backward compatability of old terriamap defaults)
        else if (isDefined(displayOne))
            brandingHtmlElements = [
                (_b = (brandingHtmlElements[displayOne] ||
                    brandingHtmlElements.find((item) => item.length > 0))) !== null && _b !== void 0 ? _b : DEFAULT_BRANDING
            ];
    }
    const version = (_c = props.version) !== null && _c !== void 0 ? _c : "Unknown";
    return (React.createElement("div", { css: `
          display: flex;
          justify-content: space-between;

          box-sizing: border-box;

          width: 100%;
          height: ${(p) => p.theme.logoHeight};

          overflow: hidden;

          a {
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
          }
          span {
            display: block;
          }
          img {
            max-height: 100%;
            max-width: 100%;
          }

          font-family: ${(p) => p.theme.fontPop};

          padding: ${(p) => p.theme.logoPaddingHorizontal}
            ${(p) => p.theme.logoPaddingVertical};

          @media (max-width: ${(p) => p.theme.sm}px) {
            height: ${(p) => p.theme.logoSmallHeight};

            padding: ${(p) => p.theme.logoSmallPaddingHorizontal}
              ${(p) => p.theme.logoSmallPaddingVertical};

            // Remove a "display: flex" on small screen if only showing one brandingHtmlElement
            a {
              ${brandingHtmlElements.length > 0 ? "display: unset;" : ""}
            }
          }
        ` }, brandingHtmlElements.map((element, idx) => (React.createElement(React.Fragment, { key: idx }, parseCustomHtmlToReact(element.replace(/\{\{\s*version\s*\}\}/g, version), { disableExternalLinkIcon: true }))))));
}));
//# sourceMappingURL=Branding.js.map
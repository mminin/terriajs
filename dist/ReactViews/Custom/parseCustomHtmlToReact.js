"use strict";
import React, { createElement } from "react";
import CustomComponent from "./CustomComponent";
import { ExternalLinkWithWarning, ExternalLinkIcon } from "./ExternalLink";
const DOMPurify = require("dompurify/dist/purify");
const HtmlToReact = require("html-to-react");
const combine = require("terriajs-cesium/Source/Core/combine").default;
const defined = require("terriajs-cesium/Source/Core/defined").default;
const utils = require("html-to-react/lib/utils");
const htmlToReactParser = new HtmlToReact.Parser({
    decodeEntities: true
});
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
const isValidNode = function () {
    return true;
};
const shouldProcessEveryNodeExceptWhiteSpace = function (node) {
    // Use this to avoid white space between table elements, eg.
    //     <table> <tbody> <tr>\n<td>x</td> <td>3</td> </tr> </tbody> </table>
    // being rendered as empty <span> elements, and causing React errors.
    return node.type !== "text" || node.data.trim();
};
let keyIndex = 0;
function shouldAppendExternalLinkIcon(url, context) {
    if (!url)
        return false;
    const tmp = document.createElement("a");
    tmp.href = url;
    const isExternalLink = tmp.host !== window.location.host;
    return context.disableExternalLinkIcon !== true && isExternalLink;
}
/**
 * @private
 */
function getProcessingInstructions(context) {
    // Process custom nodes specially.
    const processingInstructions = [];
    const customComponents = CustomComponent.values;
    for (let i = 0; i < customComponents.length; i++) {
        const customComponent = customComponents[i];
        processingInstructions.push({
            shouldProcessNode: customComponent.shouldProcessNode.bind(customComponent, context),
            processNode: customComponent.processNode.bind(customComponent, context)
        });
    }
    /** Process anchor elements:
     * - Make sure any <a href> tags open in a new window
     * - Add ExternalLinkIcon
     * - Replace anchor with ExternalLinkWithWarning if `context.showExternalLinkWarning`
     */
    processingInstructions.push({
        shouldProcessNode: (node) => node.name === "a",
        processNode: function (node, children, index) {
            var _a;
            // Make sure any <a href> tags open in a new window
            // eslint-disable-line react/display-name
            const elementProps = {
                key: "anchor-" + keyIndex++,
                target: "_blank",
                rel: "noreferrer noopener"
            };
            node.attribs = combine(node.attribs, elementProps);
            // If applicable - append ExternalLinkIcon
            const appendExternalLink = shouldAppendExternalLinkIcon((_a = node === null || node === void 0 ? void 0 : node.attribs) === null || _a === void 0 ? void 0 : _a.href, context);
            if (appendExternalLink) {
                const externalIcon = React.createElement(ExternalLinkIcon, {});
                children.push(externalIcon);
            }
            // Create new Anchor element
            const aElement = utils.createElement(node, index, node.data, children);
            // If external link and showExternalLinkWarning is true - replace with ExternalLinkWithWarning
            if (appendExternalLink && context.showExternalLinkWarning) {
                return createElement(ExternalLinkWithWarning, {
                    attributes: aElement.props,
                    children: aElement.props.children
                });
            }
            return aElement;
        }
    });
    // Process all other nodes as normal.
    processingInstructions.push({
        shouldProcessNode: shouldProcessEveryNodeExceptWhiteSpace,
        processNode: processNodeDefinitions.processDefaultNode
    });
    return processingInstructions;
}
/**
 * Return html as a React Element.
 * HTML is purified by default. Custom components are not supported by default
 * Set domPurifyOptions to specify supported custom components - for example
 * - eg. {ADD_TAGS: ['component1', 'component2']} (https://github.com/cure53/DOMPurify).
 */
function parseCustomHtmlToReact(html, context, allowUnsafeHtml = false, domPurifyOptions = {}) {
    if (!defined(html) || html.length === 0) {
        return html;
    }
    if (!allowUnsafeHtml) {
        html = DOMPurify.sanitize(html, domPurifyOptions);
    }
    return htmlToReactParser.parseWithInstructions(html, isValidNode, getProcessingInstructions(context !== null && context !== void 0 ? context : {}));
}
export default parseCustomHtmlToReact;
//# sourceMappingURL=parseCustomHtmlToReact.js.map
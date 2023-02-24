"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observer } from "mobx-react";
import React from "react";
import defined from "terriajs-cesium/Source/Core/defined";
import Resource from "terriajs-cesium/Source/Core/Resource";
import URI from "urijs";
import isDefined from "../../../Core/isDefined";
import { getMakiIcon } from "../../../Map/Icons/Maki/MakiIcons";
import MinMaxLevelMixin from "../../../ModelMixins/MinMaxLevelMixin";
import TableMixin from "../../../ModelMixins/TableMixin";
import proxyCatalogItemUrl from "../../../Models/Catalog/proxyCatalogItemUrl";
import hasTraits from "../../../Models/Definition/hasTraits";
import Button from "../../../Styled/Button";
import Icon, { StyledIcon } from "../../../Styled/Icon";
import LegendOwnerTraits from "../../../Traits/TraitsClasses/LegendOwnerTraits";
import Styles from "./legend.scss";
/* A lookup map for displayable mime types */
const DISPLAYABLE_MIME_TYPES = [
    "image/jpeg",
    "image/gif",
    "image/png",
    "image/svg+xml",
    "image/bmp",
    "image/x-bmp"
].reduce((acc, mimeType) => {
    acc[mimeType] = true;
    return acc;
}, {});
const IMAGE_URL_REGEX = /[.\/](png|jpg|jpeg|gif|svg)/i;
function checkMimeType(legend) {
    var _a;
    return ((legend.urlMimeType && !!DISPLAYABLE_MIME_TYPES[legend.urlMimeType]) ||
        !!((_a = legend.url) === null || _a === void 0 ? void 0 : _a.match(IMAGE_URL_REGEX)));
}
let Legend = class Legend extends React.Component {
    onImageLoad(evt, legend) {
        var _a;
        const image = evt.target;
        image.style.display = "none";
        image.style.maxWidth = "none";
        if (evt.type === "error") {
            return;
        }
        image.style.display = "initial";
        // If legend need scaling, this is the only way to do it :/
        // See https://stackoverflow.com/questions/7699621/display-image-at-50-of-its-native-size
        // or https://stackoverflow.com/questions/35711807/display-high-dpi-image-at-50-scaling-using-just-css
        image.style.width = `${((_a = legend.imageScaling) !== null && _a !== void 0 ? _a : 1) * image.offsetWidth}px`;
        // Must set maxWidth *after* setting width, as it may change offsetWidth
        image.style.maxWidth = "100%";
    }
    renderLegend(legend, i) {
        if (defined(legend.url)) {
            return this.renderImageLegend(legend, i);
        }
        else if (defined(legend.items)) {
            return this.renderGeneratedLegend(legend, i);
        }
        return null;
    }
    renderImageLegend(legend, i) {
        const isImage = checkMimeType(legend);
        // const insertDirectly = !!legend.safeSvgContent; // we only insert content we generated ourselves, not arbitrary SVG from init files.
        // const svg = legend.safeSvgContent;
        // // Safari xlink NS issue fix
        // const processedSvg = svg ? svg.replace(/NS\d+:href/gi, "xlink:href") : null;
        // const safeSvgContent = { __html: processedSvg };
        /* We proxy the legend so it's cached, and so that the Print/Export feature works with non-CORS servers.
         * We make it absolute because the print view is opened on a different domain (about:blank) so relative
         * URLs will not work.
         */
        const proxiedUrl = isDefined(legend.url)
            ? makeAbsolute(proxyCatalogItemUrl(this.props.item, legend.url))
            : undefined;
        // padding-top: 8px;
        // padding-bottom: 8px;
        // if (isImage && insertDirectly) {
        //   return (<li
        //     key={i}
        //     className={Styles.legendSvg}
        //     dangerouslySetInnerHTML={safeSvgContent}
        //   />)
        // }
        if (!isDefined(proxiedUrl))
            return null;
        if (isImage) {
            return (React.createElement("li", { key: proxiedUrl },
                React.createElement("a", { href: proxiedUrl, className: Styles.imageAnchor, target: "_blank", rel: "noreferrer noopener", css: { backgroundColor: legend.backgroundColor } },
                    React.createElement("img", { src: proxiedUrl, 
                        // Set maxWidth to 100% if no scaling required (otherwise - see onImageLoad)
                        style: {
                            maxWidth: !isDefined(legend.imageScaling) || legend.imageScaling === 1
                                ? "100%"
                                : undefined
                        }, onError: (evt) => this.onImageLoad.bind(this, evt, legend)(), onLoad: (evt) => this.onImageLoad.bind(this, evt, legend)() }))));
        }
        return (React.createElement("li", { key: proxiedUrl },
            React.createElement("a", { href: proxiedUrl, target: "_blank", rel: "noreferrer noopener", className: Styles.legendOpenExternally }, "Open legend in a separate tab")));
    }
    renderGeneratedLegend(legend, i) {
        if (isDefined(legend.items) && legend.items.length > 0) {
            return (React.createElement("li", { key: i, className: Styles.generatedLegend },
                React.createElement("table", { css: { backgroundColor: legend.backgroundColor } },
                    React.createElement("tbody", null, legend.items.map(this.renderLegendItem.bind(this))))));
        }
        return null;
    }
    renderLegendItem(legendItem, i) {
        var _a, _b, _c;
        let imageUrl = legendItem.imageUrl;
        if (legendItem.marker) {
            imageUrl = (_b = getMakiIcon(legendItem.marker, (_a = legendItem.color) !== null && _a !== void 0 ? _a : "#fff", // We have to have a fallback color here for `getMakiIcon`
            legendItem.outlineWidth, legendItem.outlineColor, legendItem.imageHeight, legendItem.imageWidth)) !== null && _b !== void 0 ? _b : 
            // If getMakiIcons returns nothing, we assume legendItem.marker is a URL
            legendItem.marker;
        }
        // Set boxStyle border to solid black if we aren't showing an image AND this legend item has space above it
        let boxStyle = {
            border: !imageUrl && legendItem.addSpacingAbove ? "1px solid black" : undefined
        };
        // Override the boxStyle border if we have outlineColor and outlineWidth defined for this legend item
        if (!imageUrl && legendItem.outlineColor && legendItem.outlineWidth) {
            boxStyle.border = `${legendItem.outlineWidth}px solid ${legendItem.outlineColor}`;
        }
        let boxContents = React.createElement(React.Fragment, null);
        // Browsers don't print background colors by default, so we render things a little differently.
        // Chrome and Firefox let you override this, but not IE and Edge. So...
        if (this.props.forPrint) {
            if (imageUrl) {
                boxContents = (React.createElement("img", { width: "20px", height: "16px", src: imageUrl, style: { transform: `rotate(${(_c = legendItem.rotation) !== null && _c !== void 0 ? _c : 0}deg)` } }));
            }
            else {
                boxContents = React.createElement(React.Fragment, null, "\u25A0");
                boxStyle = {
                    color: legendItem.color,
                    fontSize: "48px",
                    lineHeight: "16px",
                    ...boxStyle
                };
            }
        }
        else {
            if (imageUrl || legendItem.marker) {
                boxStyle = {
                    transform: `rotate(${legendItem.rotation}deg)`,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "24px",
                    width: `${legendItem.imageWidth}px`,
                    ...boxStyle
                };
            }
            else {
                boxStyle = {
                    backgroundColor: legendItem.color,
                    minWidth: "20px",
                    ...boxStyle
                };
            }
        }
        const rowStyle = {
            height: `${legendItem.imageHeight + 2}px`
        };
        return (React.createElement(React.Fragment, { key: i },
            legendItem.addSpacingAbove && (React.createElement("tr", { className: Styles.legendSpacer },
                React.createElement("td", null))),
            React.createElement("tr", { style: rowStyle },
                React.createElement("td", { style: boxStyle }, boxContents),
                React.createElement("td", { className: Styles.legendTitles },
                    legendItem.titleAbove && (React.createElement("div", { className: Styles.legendTitleAbove }, legendItem.titleAbove)),
                    React.createElement("div", { title: isDefined(legendItem.multipleTitles)
                            ? legendItem.multipleTitles.join(", ")
                            : legendItem.title }, isDefined(legendItem.multipleTitles)
                        ? `${legendItem.multipleTitles
                            .slice(0, legendItem.maxMultipleTitlesShowed)
                            .join(", ")}${legendItem.multipleTitles.length >
                            legendItem.maxMultipleTitlesShowed
                            ? "..."
                            : ""}`
                        : legendItem.title),
                    legendItem.titleBelow && (React.createElement("div", { className: Styles.legendTitleBelow }, legendItem.titleBelow))))));
    }
    render() {
        if ((!hasTraits(this.props.item, LegendOwnerTraits, "legends") ||
            !hasTraits(this.props.item, LegendOwnerTraits, "hideLegendInWorkbench")) &&
            !TableMixin.isMixedInto(this.props.item)) {
            return null;
        }
        if ((hasTraits(this.props.item, LegendOwnerTraits, "hideLegendInWorkbench") &&
            this.props.item.hideLegendInWorkbench) ||
            (MinMaxLevelMixin.isMixedInto(this.props.item) &&
                this.props.item.scaleWorkbenchInfo))
            return null;
        if (isDefined(this.props.item.legends) &&
            this.props.item.legends.length > 0) {
            const backgroundColor = hasTraits(this.props.item, LegendOwnerTraits, "legendBackgroundColor")
                ? this.props.item.legendBackgroundColor
                : undefined;
            return (React.createElement("ul", { className: Styles.legend },
                React.createElement("div", { className: Styles.legendInner, css: { position: "relative", " li": { backgroundColor } } },
                    // Show temporary "legend button" - if custom styling has been applied
                    TableMixin.isMixedInto(this.props.item) &&
                        this.props.item.legendButton ? (React.createElement(Button, { primary: true, shortMinHeight: true, css: { position: "absolute", top: 10, right: 0 }, renderIcon: () => (React.createElement(StyledIcon, { light: true, glyph: Icon.GLYPHS.menuDotted, styledWidth: "12px" })), rightIcon: true, iconProps: { css: { marginRight: 0, marginLeft: 4 } }, onClick: this.props.item.legendButton.onClick.bind(this.props.item) }, this.props.item.legendButton.title)) : null,
                    this.props.item.legends.map((legend, i) => (React.createElement(React.Fragment, { key: i },
                        isDefined(legend.title) ? (React.createElement("h3", { className: Styles.legendTitle }, legend.title)) : null,
                        this.renderLegend.bind(this)(legend, i)))))));
        }
        return null;
    }
};
Legend.defaultProps = {
    forPrint: false
};
Legend = __decorate([
    observer
], Legend);
export default Legend;
function makeAbsolute(url) {
    if (url instanceof Resource) {
        url = url.url;
    }
    const uri = new URI(url);
    if (uri.protocol() &&
        uri.protocol() !== "http" &&
        uri.protocol() !== "https") {
        return url;
    }
    else {
        return uri.absoluteTo(window.location.href).toString();
    }
}
//# sourceMappingURL=Legend.js.map
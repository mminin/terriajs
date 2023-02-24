import DOMPurify from "dompurify";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { StyleSheetManager, ThemeProvider } from "styled-components";
import { terriaTheme } from "../../../../StandardUserInterface/StandardTheme";
import { useViewState } from "../../../../StandardUserInterface/ViewStateContext";
import DistanceLegend from "../../../Legend/DistanceLegend";
import { buildShareLink, buildShortShareLink, canShorten } from "../BuildShareLink";
import PrintDatasets from "./PrintDatasets";
import PrintSource from "./PrintSource";
import PrintViewButtons from "./PrintViewButtons";
import PrintViewMap from "./PrintViewMap";
import PrintWorkbench from "./PrintWorkbench";
const PRINT_MAP_WIDTH = 1000;
const styles = `
    .tjs-_base__list-reset {
        list-style: none;
        padding-left: 0;
        margin: 0;
    }

    .mapContainer {
      position: relative;
    }

    .map-image {
      width: ${PRINT_MAP_WIDTH}px;
    }

    .mapSection {
      display: flex;
      border: 1px solid lightgray;
      margin: 10px 0;
    }

    .mapSection .datasets{
      width:200px
    }

    h1, h2, h3 {
      clear: both;
    }

    .WorkbenchItem {
      padding-bottom: 10px;
      margin: 0 5px;
      border-bottom: 1px solid lightgray;
    }

    .WorkbenchItem:last-of-type {
      border: 0;
      padding-bottom: 0;
    }

    .tjs-_form__input {
      width: 80%;
    }

    .tjs-legend__distanceLegend {
      display: inline-block;
      text-align: center;
      position: absolute;
      bottom: 5px;
      right: 10px;
      background: white;
      padding: 5px;
    }

    .tjs-legend__bar {
      border-bottom: 3px solid black;
      border-right: 3px solid black;
      border-left: 3px solid black;
    }

    body {
      display:flex;
      justify-content: center;
      width: 100%
    }

    @media print {
      body {
        display: block;
      }
      .PrintView__printControls {
        display: none;
      }
    }

    main {
      width: 1200px;
    }
`;
const mkStyle = (unsafeCSS) => {
    const style = document.createElement("style");
    style.innerHTML = DOMPurify.sanitize(unsafeCSS, {});
    return style;
};
export const downloadImg = (dataString, fileName = "map.png") => {
    const a = document.createElement("a");
    a.href = dataString;
    a.download = fileName;
    a.click();
};
const getScale = (maybeElement) => maybeElement
    ? PRINT_MAP_WIDTH / maybeElement.offsetWidth
    : 1;
const PrintView = (props) => {
    const viewState = useViewState();
    const rootNode = useRef(document.createElement("main"));
    const [screenshot, setScreenshot] = useState(null);
    const [shareLink, setShareLink] = useState("");
    useEffect(() => {
        props.window.document.title = "Print view";
        props.window.document.head.appendChild(mkStyle(styles));
        props.window.document.body.appendChild(rootNode.current);
        props.window.addEventListener("beforeunload", props.closeCallback);
    }, [props.window]);
    useEffect(() => {
        setScreenshot(viewState.terria.currentViewer.captureScreenshot());
    }, [props.window]);
    useEffect(() => {
        canShorten(viewState.terria)
            ? buildShortShareLink(viewState.terria, viewState, {
                includeStories: false
            })
                .then((url) => {
                setShareLink(url);
            })
                .catch(() => buildShareLink(viewState.terria, viewState, {
                includeStories: false
            }))
            : setShareLink(buildShareLink(viewState.terria, viewState, {
                includeStories: false
            }));
    }, [viewState.terria, viewState]);
    return ReactDOM.createPortal(React.createElement(StyleSheetManager, { target: props.window.document.head },
        React.createElement(ThemeProvider, { theme: terriaTheme },
            React.createElement(PrintViewButtons, { window: props.window, screenshot: screenshot }),
            React.createElement("section", { className: "mapSection" },
                React.createElement("div", { className: "datasets" },
                    React.createElement(PrintWorkbench, { workbench: viewState.terria.workbench })),
                React.createElement("div", { className: "map" }, screenshot ? (React.createElement(PrintViewMap, { screenshot: screenshot },
                    React.createElement(DistanceLegend, { terria: viewState.terria, scale: getScale(viewState.terria.currentViewer.getContainer()), isPrintMode: true }))) : (React.createElement("div", null, "Loading...")))),
            React.createElement("section", { className: "PrintView__source" }, shareLink && React.createElement(PrintSource, { link: shareLink })),
            React.createElement("section", null,
                React.createElement("h2", null, "Datasets"),
                React.createElement(PrintDatasets, { items: viewState.terria.workbench.items })))), rootNode.current);
};
export default PrintView;
//# sourceMappingURL=PrintView.js.map
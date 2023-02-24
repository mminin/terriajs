import React from "react";
import { ThemeProvider } from "styled-components";
import { ViewStateProvider } from "./ViewStateContext";
export default (props) => (React.createElement(ViewStateProvider, { viewState: props.viewState },
    React.createElement(ThemeProvider, { theme: props.theme }, props.children)));
//# sourceMappingURL=ContextProviders.js.map
import React, { createContext, useContext } from "react";
import TerriaError from "../../Core/TerriaError";
export const ViewStateContext = createContext(undefined);
export const ViewStateProvider = ({ viewState, children }) => (React.createElement(ViewStateContext.Provider, { value: viewState }, children));
export const useViewState = () => {
    const viewState = useContext(ViewStateContext);
    if (!viewState)
        throw new TerriaError({ message: "ViewState is not defined!" });
    return viewState;
};
export const withViewState = (Component) => (props) => (React.createElement(ViewStateContext.Consumer, null, (viewState) => {
    if (!viewState)
        throw new TerriaError({ message: "ViewState is not defined!" });
    return React.createElement(Component, Object.assign({}, props, { viewState: viewState }));
}));
//# sourceMappingURL=ViewStateContext.js.map
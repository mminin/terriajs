import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useViewState } from "../StandardUserInterface/ViewStateContext";
import ModalPopup from "./ModalPopup";
import Tabs from "./Tabs";
export const ExplorerWindowElementName = "AddData";
export default observer(function ExplorerWindow() {
    const viewState = useViewState();
    const onClose = action(() => {
        viewState.closeCatalog();
        viewState.switchMobileView("nowViewing");
    });
    const onStartAnimatingIn = action(() => {
        viewState.explorerPanelAnimating = true;
    });
    const onDoneAnimatingIn = action(() => {
        viewState.explorerPanelAnimating = false;
    });
    const isVisible = !viewState.useSmallScreenInterface &&
        !viewState.hideMapUi &&
        viewState.explorerPanelIsVisible;
    return (React.createElement(ModalPopup, { viewState: viewState, isVisible: isVisible, isTopElement: viewState.topElement === ExplorerWindowElementName, onClose: onClose, onStartAnimatingIn: onStartAnimatingIn, onDoneAnimatingIn: onDoneAnimatingIn },
        React.createElement(Tabs, { terria: viewState.terria, viewState: viewState })));
});
//# sourceMappingURL=ExplorerWindow.js.map
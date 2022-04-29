import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import defined from "terriajs-cesium/Source/Core/defined";
import addedByUser from "../../Core/addedByUser";
import { DataSourceAction } from "../../Core/AnalyticEvents/analyticEvents";
import getPath from "../../Core/getPath";
import CatalogGroup from "./CatalogGroup";
import CatalogItem, { ButtonState } from "./CatalogItem";
import toggleItemOnMapFromCatalog, { Op as ToggleOnMapOp } from "./toggleItemOnMapFromCatalog";
export default observer(function DataCatalogReference({ reference, viewState, onActionButtonClicked, isTopLevel }) {
    const setPreviewedItem = () => viewState.viewCatalogMember(reference);
    const add = async (event) => {
        const keepCatalogOpen = event.shiftKey || event.ctrlKey;
        if (onActionButtonClicked) {
            onActionButtonClicked(reference);
            return;
        }
        if (defined(viewState.storyShown)) {
            runInAction(() => {
                viewState.storyShown = false;
            });
        }
        if (reference.isFunction || viewState.useSmallScreenInterface) {
            await setPreviewedItem();
        }
        else {
            await toggleItemOnMapFromCatalog(viewState, reference, keepCatalogOpen, {
                [ToggleOnMapOp.Add]: DataSourceAction.addFromCatalogue,
                [ToggleOnMapOp.Remove]: DataSourceAction.removeFromCatalogue
            });
        }
    };
    const isSelected = addedByUser(reference)
        ? viewState.userDataPreviewedItem === reference
        : viewState.previewedItem === reference;
    const path = getPath(reference, " -> ");
    let btnState;
    if (reference.isLoading) {
        btnState = ButtonState.Loading;
    }
    else if (viewState.useSmallScreenInterface) {
        btnState = ButtonState.Preview;
    }
    else if (reference.isFunction) {
        btnState = ButtonState.Stats;
    }
    else {
        btnState = ButtonState.Add;
    }
    return (React.createElement(React.Fragment, null, reference.isGroup ? (React.createElement(CatalogGroup, { text: reference.name || "...", isPrivate: reference.isPrivate, title: path, onClick: setPreviewedItem, topLevel: isTopLevel, loading: reference.isLoadingReference, open: reference.isLoadingReference })) : (React.createElement(CatalogItem, { onTextClick: setPreviewedItem, selected: isSelected, text: reference.name || "...", isPrivate: reference.isPrivate, title: path, btnState: btnState, onBtnClick: reference.isFunction ? setPreviewedItem : add }))));
});
//# sourceMappingURL=DataCatalogReference.js.map
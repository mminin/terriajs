var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import classNames from "classnames";
import { action, runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Trans, withTranslation } from "react-i18next";
import { Category, DataSourceAction } from "../Core/AnalyticEvents/analyticEvents";
import isDefined from "../Core/isDefined";
import Result from "../Core/Result";
import CatalogMemberMixin, { getName } from "../ModelMixins/CatalogMemberMixin";
import MappableMixin from "../ModelMixins/MappableMixin";
import addUserFiles from "../Models/Catalog/addUserFiles";
import Styles from "./drag-drop-file.scss";
import { withViewState } from "./StandardUserInterface/ViewStateContext";
let DragDropFile = class DragDropFile extends React.Component {
    async handleDrop(e) {
        var _a;
        e.preventDefault();
        e.stopPropagation();
        const props = this.props;
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            // Log event to analytics for each file dropped (sometimes multiple files dropped in one DragEvent)
            const fileType = e.dataTransfer.files[i].type ||
                e.dataTransfer.files[i].name.split(".").pop(); // use file extension if type property is empty
            (_a = this.props.viewState.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.dataSource, DataSourceAction.addFromDragAndDrop, `File Type: ${fileType}, File Size(B): ${e.dataTransfer.files[i].size}`);
        }
        try {
            const addedCatalogItems = await addUserFiles(e.dataTransfer.files, props.viewState.terria, props.viewState);
            if (isDefined(addedCatalogItems) && addedCatalogItems.length > 0) {
                runInAction(() => (props.viewState.myDataIsUploadView = false));
                if (props.viewState.explorerPanelIsVisible) {
                    (await props.viewState.viewCatalogMember(addedCatalogItems[0])).throwIfError(`Failed to view ${getName(addedCatalogItems[0])}`);
                    props.viewState.openUserData();
                }
                else {
                    // update last batch of uploaded files
                    runInAction(() => (props.viewState.lastUploadedFiles = addedCatalogItems.map((item) => CatalogMemberMixin.isMixedInto(item)
                        ? item.name
                        : item.uniqueId)));
                }
                // Add load all mapable items
                const mappableItems = addedCatalogItems.filter(MappableMixin.isMixedInto);
                Result.combine(await Promise.all(mappableItems.map((f) => f.loadMapItems())), "Failed to load uploaded files").raiseError(props.viewState.terria);
                // Zoom to first item
                const firstZoomableItem = mappableItems.find((i) => isDefined(i.rectangle) && i.disableZoomTo === false);
                isDefined(firstZoomableItem) &&
                    runInAction(() => props.viewState.terria.currentViewer.zoomTo(firstZoomableItem, 1));
            }
            runInAction(() => (props.viewState.isDraggingDroppingFile = false));
        }
        catch (e) {
            props.viewState.terria.raiseErrorToUser(e, "Failed to upload files");
        }
    }
    handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "copy";
        this.target = e.target;
    }
    handleDragOver(e) {
        e.preventDefault();
    }
    handleDragLeave(e) {
        e.preventDefault();
        if (e.screenX === 0 && e.screenY === 0) {
            this.props.viewState.isDraggingDroppingFile = false;
        }
        if (e.target === document || e.target === this.target) {
            this.props.viewState.isDraggingDroppingFile = false;
        }
    }
    handleMouseLeave() {
        this.props.viewState.isDraggingDroppingFile = false;
    }
    render() {
        return (React.createElement("div", { onDrop: this.handleDrop.bind(this), onDragEnter: this.handleDragEnter.bind(this), onDragOver: this.handleDragOver.bind(this), onDragLeave: this.handleDragLeave.bind(this), onMouseLeave: this.handleMouseLeave.bind(this), className: classNames(Styles.dropZone, {
                [Styles.isActive]: this.props.viewState.isDraggingDroppingFile
            }) }, this.props.viewState.isDraggingDroppingFile ? (React.createElement("div", { className: Styles.inner },
            React.createElement(Trans, { i18nKey: "dragDrop.text" },
                React.createElement("h3", { className: Styles.heading }, "Drag & Drop"),
                React.createElement("div", { className: Styles.caption }, "Your data anywhere to view on the map")))) : ("")));
    }
};
__decorate([
    action
], DragDropFile.prototype, "handleDragEnter", null);
__decorate([
    action
], DragDropFile.prototype, "handleDragLeave", null);
__decorate([
    action
], DragDropFile.prototype, "handleMouseLeave", null);
DragDropFile = __decorate([
    observer
], DragDropFile);
export default withTranslation()(withViewState(DragDropFile));
//# sourceMappingURL=DragDropFile.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable, reaction, runInAction } from "mobx";
import defined from "terriajs-cesium/Source/Core/defined";
import addedByUser from "../Core/addedByUser";
import { Category, HelpAction } from "../Core/AnalyticEvents/analyticEvents";
import Result from "../Core/Result";
import triggerResize from "../Core/triggerResize";
import CatalogMemberMixin, { getName } from "../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../ModelMixins/GroupMixin";
import MappableMixin from "../ModelMixins/MappableMixin";
import ReferenceMixin from "../ModelMixins/ReferenceMixin";
import CommonStrata from "../Models/Definition/CommonStrata";
import { BaseModel } from "../Models/Definition/Model";
import getAncestors from "../Models/getAncestors";
import { SATELLITE_HELP_PROMPT_KEY } from "../ReactViews/HelpScreens/SatelliteHelpPrompt";
import { defaultTourPoints, RelativePosition } from "./defaultTourPoints";
import DisclaimerHandler from "./DisclaimerHandler";
import SearchState from "./SearchState";
export const DATA_CATALOG_NAME = "data-catalog";
export const USER_DATA_NAME = "my-data";
// check showWorkbenchButton delay and transforms
// export const WORKBENCH_RESIZE_ANIMATION_DURATION = 250;
export const WORKBENCH_RESIZE_ANIMATION_DURATION = 500;
/**
 * Root of a global view model. Presumably this should get nested as more stuff goes into it. Basically this belongs to
 * the root of the UI and then it can choose to pass either the whole thing or parts down as props to its children.
 */
export default class ViewState {
    constructor(options) {
        this.mobileViewOptions = Object.freeze({
            data: "data",
            preview: "preview",
            nowViewing: "nowViewing",
            locationSearchResults: "locationSearchResults"
        });
        this.relativePosition = RelativePosition;
        this.explorerPanelIsVisible = false;
        this.activeTabCategory = DATA_CATALOG_NAME;
        this.activeTabIdInCategory = undefined;
        this.isDraggingDroppingFile = false;
        this.mobileView = null;
        this.isMapFullScreen = false;
        this.myDataIsUploadView = true;
        this.mobileMenuVisible = false;
        this.explorerPanelAnimating = false;
        this.topElement = "FeatureInfo";
        this.lastUploadedFiles = [];
        this.storyBuilderShown = false;
        // Flesh out later
        this.showHelpMenu = false;
        this.showSatelliteGuidance = false;
        this.showWelcomeMessage = false;
        this.selectedHelpMenuItem = "";
        this.helpPanelExpanded = false;
        this.disclaimerSettings = undefined;
        this.disclaimerVisible = false;
        this.videoGuideVisible = "";
        this.trainerBarVisible = false;
        this.trainerBarExpanded = false;
        this.trainerBarShowingAllSteps = false;
        this.selectedTrainerItem = "";
        this.currentTrainerItemIndex = 0;
        this.currentTrainerStepIndex = 0;
        this.printWindow = null;
        /**
         * Bottom dock state & action
         */
        this.bottomDockHeight = 0;
        this.workbenchWithOpenControls = undefined;
        this.errorProvider = null;
        // default value is null, because user has not made decision to show or
        // not show story
        // will be explicitly set to false when user 1. dismiss story
        // notification or 2. close a story
        this.storyShown = null;
        this.currentStoryId = 0;
        this.featurePrompts = [];
        /**
         * we need a layering system for touring the app, but also a way for it to be
         * chopped and changed from a terriamap
         *
         * this will be slightly different to the help sequences that were done in
         * the past, but may evolve to become a "sequence" (where the UI gets
         * programatically toggled to delve deeper into the app, e.g. show the user
         * how to add data via the data catalog window)
         *
         * rough points
         * - "all guide points visible"
         * -
         *
      
         * draft structure(?):
         *
         * maybe each "guide" item will have
         * {
         *  ref: (react ref object)
         *  dotOffset: (which way the dot and guide should be positioned relative to the ref component)
         *  content: (component, more flexibility than a string)
         * ...?
         * }
         * and guide props?
         * {
         *  enabled: parent component to decide this based on active index
         * ...?
         * }
         *  */
        this.tourPoints = defaultTourPoints;
        this.showTour = false;
        this.appRefs = new Map();
        this.currentTourIndex = -1;
        this.showCollapsedNavigation = false;
        /**
         * Gets or sets a value indicating whether the small screen (mobile) user interface should be used.
         * @type {Boolean}
         */
        this.useSmallScreenInterface = false;
        /**
         * Gets or sets a value indicating whether the feature info panel is visible.
         * @type {Boolean}
         */
        this.featureInfoPanelIsVisible = false;
        /**
         * Gets or sets a value indicating whether the feature info panel is collapsed.
         * When it's collapsed, only the title bar is visible.
         * @type {Boolean}
         */
        this.featureInfoPanelIsCollapsed = false;
        /**
         * True if this is (or will be) the first time the user has added data to the map.
         * @type {Boolean}
         */
        this.firstTimeAddingData = true;
        /**
         * Gets or sets a value indicating whether the feedback form is visible.
         * @type {Boolean}
         */
        this.feedbackFormIsVisible = false;
        /**
         * Gets or sets a value indicating whether the catalog's model share panel
         * is currently visible.
         */
        this.shareModelIsVisible = false;
        const terria = options.terria;
        this.searchState = new SearchState({
            terria: terria,
            catalogSearchProvider: options.catalogSearchProvider,
            locationSearchProviders: options.locationSearchProviders
        });
        this.errorProvider = options.errorHandlingProvider
            ? options.errorHandlingProvider
            : null;
        this.terria = terria;
        // When features are picked, show the feature info panel.
        this._pickedFeaturesSubscription = reaction(() => this.terria.pickedFeatures, (pickedFeatures) => {
            if (defined(pickedFeatures)) {
                this.featureInfoPanelIsVisible = true;
                this.featureInfoPanelIsCollapsed = false;
            }
            else {
                this.featureInfoPanelIsVisible = false;
            }
        });
        // When disclaimer is shown, ensure fullscreen
        // unsure about this behaviour because it nudges the user off center
        // of the original camera set from config once they acknowdge
        this._disclaimerVisibleSubscription = reaction(() => this.disclaimerVisible, disclaimerVisible => {
            if (disclaimerVisible) {
                this.isMapFullScreen = true;
            }
            else if (!disclaimerVisible && this.isMapFullScreen) {
                this.isMapFullScreen = false;
            }
        });
        this._isMapFullScreenSubscription = reaction(() => terria.userProperties.get("hideWorkbench") === "1" ||
            terria.userProperties.get("hideExplorerPanel") === "1", (isMapFullScreen) => {
            this.isMapFullScreen = isMapFullScreen;
            // if /#hideWorkbench=1 exists in url onload, show stories directly
            // any show/hide workbench will not automatically show story
            if (!defined(this.storyShown)) {
                // why only checkk config params here? because terria.stories are not
                // set at the moment, and that property will be checked in rendering
                // Here are all are checking are: is terria story enabled in this app?
                // if so we should show it when app first laod, if workbench is hiddne
                this.storyShown = terria.configParameters.storyEnabled;
            }
        });
        this._showStoriesSubscription = reaction(() => Boolean(terria.userProperties.get("playStory")), (playStory) => {
            this.storyShown = terria.configParameters.storyEnabled && playStory;
        });
        this._mobileMenuSubscription = reaction(() => this.mobileMenuVisible, (mobileMenuVisible) => {
            if (mobileMenuVisible) {
                this.explorerPanelIsVisible = false;
                this.switchMobileView(null);
            }
        });
        this._disclaimerHandler = new DisclaimerHandler(terria, this);
        this._workbenchHasTimeWMSSubscription = reaction(() => this.terria.workbench.hasTimeWMS, (hasTimeWMS) => {
            if (this.terria.configParameters.showInAppGuides &&
                hasTimeWMS === true &&
                // // only show it once
                !this.terria.getLocalProperty(`${SATELLITE_HELP_PROMPT_KEY}Prompted`)) {
                this.setShowSatelliteGuidance(true);
                this.toggleFeaturePrompt(SATELLITE_HELP_PROMPT_KEY, true, true);
            }
        });
        this._storyPromptSubscription = reaction(() => this.storyShown, (storyShown) => {
            if (storyShown === false) {
                // only show it once
                if (!this.terria.getLocalProperty("storyPrompted")) {
                    this.toggleFeaturePrompt("story", true, false);
                }
            }
        });
        this._previewedItemIdSubscription = reaction(() => this.terria.previewedItemId, (previewedItemId) => {
            if (previewedItemId === undefined) {
                return;
            }
            const model = this.terria.getModelById(BaseModel, previewedItemId);
            if (model !== undefined) {
                this.viewCatalogMember(model);
            }
        });
        const handleWindowClose = (e) => {
            // Cancel the event
            e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
            // Chrome requires returnValue to be set
            e.returnValue = "";
        };
        this._storyBeforeUnloadSubscription = reaction(() => this.terria.stories.length > 0, hasScenes => {
            if (hasScenes) {
                window.addEventListener("beforeunload", handleWindowClose);
            }
            else {
                window.removeEventListener("beforeunload", handleWindowClose);
            }
        });
    }
    get previewedItem() {
        return this._previewedItem;
    }
    setSelectedTrainerItem(trainerItem) {
        this.selectedTrainerItem = trainerItem;
    }
    setTrainerBarVisible(bool) {
        this.trainerBarVisible = bool;
    }
    setTrainerBarShowingAllSteps(bool) {
        this.trainerBarShowingAllSteps = bool;
    }
    setTrainerBarExpanded(bool) {
        this.trainerBarExpanded = bool;
        // if collapsing trainer bar, also hide steps
        if (!bool) {
            this.trainerBarShowingAllSteps = bool;
        }
    }
    setCurrentTrainerItemIndex(index) {
        this.currentTrainerItemIndex = index;
        this.currentTrainerStepIndex = 0;
    }
    setCurrentTrainerStepIndex(index) {
        this.currentTrainerStepIndex = index;
    }
    setBottomDockHeight(height) {
        if (this.bottomDockHeight !== height) {
            this.bottomDockHeight = height;
        }
    }
    get tourPointsWithValidRefs() {
        // should viewstate.ts reach into document? seems unavoidable if we want
        // this to be the true source of tourPoints.
        // update: well it turns out you can be smarter about it and actually
        // properly clean up your refs - so we'll leave that up to the UI to
        // provide valid refs
        return this.tourPoints
            .sort((a, b) => {
            return a.priority - b.priority;
        })
            .filter(tourPoint => { var _a; return (_a = this.appRefs.get(tourPoint.appRefName)) === null || _a === void 0 ? void 0 : _a.current; });
    }
    setTourIndex(index) {
        this.currentTourIndex = index;
    }
    setShowTour(bool) {
        this.showTour = bool;
        // If we're enabling the tour, make sure the trainer is collapsed
        if (bool) {
            this.setTrainerBarExpanded(false);
        }
    }
    closeTour() {
        this.currentTourIndex = -1;
        this.showTour = false;
    }
    previousTourPoint() {
        const currentIndex = this.currentTourIndex;
        if (currentIndex !== 0) {
            this.currentTourIndex = currentIndex - 1;
        }
    }
    nextTourPoint() {
        const totalTourPoints = this.tourPointsWithValidRefs.length;
        const currentIndex = this.currentTourIndex;
        if (currentIndex >= totalTourPoints - 1) {
            this.closeTour();
        }
        else {
            this.currentTourIndex = currentIndex + 1;
        }
    }
    closeCollapsedNavigation() {
        this.showCollapsedNavigation = false;
    }
    updateAppRef(refName, ref) {
        if (!this.appRefs.get(refName) || this.appRefs.get(refName) !== ref) {
            this.appRefs.set(refName, ref);
        }
    }
    deleteAppRef(refName) {
        this.appRefs.delete(refName);
    }
    dispose() {
        this._pickedFeaturesSubscription();
        this._disclaimerVisibleSubscription();
        this._mobileMenuSubscription();
        this._isMapFullScreenSubscription();
        this._showStoriesSubscription();
        this._storyPromptSubscription();
        this._previewedItemIdSubscription();
        this._workbenchHasTimeWMSSubscription();
        this._disclaimerHandler.dispose();
        this.searchState.dispose();
    }
    triggerResizeEvent() {
        triggerResize();
    }
    setIsMapFullScreen(bool, animationDuration = WORKBENCH_RESIZE_ANIMATION_DURATION) {
        this.isMapFullScreen = bool;
        // Allow any animations to finish, then trigger a resize.
        // (wing): much better to do by listening for transitionend, but will leave
        // this as is until that's in place
        setTimeout(function () {
            // should we do this here in viewstate? it pulls in browser dependent things,
            // and (defensively) calls it.
            // but only way to ensure we trigger this resize, by standardising fullscreen
            // toggle through an action.
            triggerResize();
        }, animationDuration);
    }
    toggleStoryBuilder() {
        this.storyBuilderShown = !this.storyBuilderShown;
    }
    setTopElement(key) {
        this.topElement = key;
    }
    openAddData() {
        this.explorerPanelIsVisible = true;
        this.activeTabCategory = DATA_CATALOG_NAME;
        this.switchMobileView(this.mobileViewOptions.data);
    }
    openUserData() {
        this.explorerPanelIsVisible = true;
        this.activeTabCategory = USER_DATA_NAME;
    }
    closeCatalog() {
        this.explorerPanelIsVisible = false;
        this.switchMobileView(null);
        this.clearPreviewedItem();
    }
    searchInCatalog(query) {
        this.openAddData();
        this.searchState.catalogSearchText = query;
        this.searchState.searchCatalog();
    }
    clearPreviewedItem() {
        this.userDataPreviewedItem = undefined;
        this._previewedItem = undefined;
    }
    /**
     * Views a model in the catalog. If model is a
     *
     * - `Reference` - it will be dereferenced first.
     * - `CatalogMember` - `loadMetadata` will be called
     * - `Group` - its `isOpen` trait will be set according to the value of the `isOpen` parameter in the `stratum` indicated.
     *   - If after doing this the group is open, its members will be loaded with a call to `loadMembers`.
     * - `Mappable` - `loadMapItems` will be called
     *
     * Then (if no errors have occurred) it will open the catalog.
     * Note - `previewItem` is set at the start of the function, regardless of errors.
     *
     * @param item The model to view in catalog.
     * @param [isOpen=true] True if the group should be opened. False if it should be closed.
     * @param stratum The stratum in which to mark the group opened or closed.
     * @param openAddData True if data catalog window should be opened.
     */
    async viewCatalogMember(item, isOpen = true, stratum = CommonStrata.user, openAddData = true) {
        try {
            // Get referenced target first.
            if (ReferenceMixin.isMixedInto(item)) {
                (await item.loadReference()).throwIfError();
                if (item.target) {
                    return this.viewCatalogMember(item.target);
                }
                else {
                    return Result.error(`Could not view catalog member ${getName(item)}`);
                }
            }
            const theItem = ReferenceMixin.isMixedInto(item) && item.target ? item.target : item;
            // Set preview item
            runInAction(() => (this._previewedItem = theItem));
            // Open "Add Data"
            if (openAddData) {
                if (addedByUser(theItem)) {
                    runInAction(() => (this.userDataPreviewedItem = theItem));
                    this.openUserData();
                }
                else {
                    runInAction(() => {
                        this.openAddData();
                        if (this.terria.configParameters.tabbedCatalog) {
                            const parentGroups = getAncestors(item);
                            if (parentGroups.length > 0) {
                                // Go to specific tab
                                this.activeTabIdInCategory = parentGroups[0].uniqueId;
                            }
                        }
                    });
                }
                // mobile switch to now vewing if not viewing a group
                if (!GroupMixin.isMixedInto(theItem)) {
                    this.switchMobileView(this.mobileViewOptions.preview);
                }
            }
            if (GroupMixin.isMixedInto(theItem)) {
                theItem.setTrait(stratum, "isOpen", isOpen);
                if (theItem.isOpen) {
                    (await theItem.loadMembers()).throwIfError();
                }
            }
            else if (MappableMixin.isMixedInto(theItem))
                (await theItem.loadMapItems()).throwIfError();
            else if (CatalogMemberMixin.isMixedInto(theItem))
                (await theItem.loadMetadata()).throwIfError();
        }
        catch (e) {
            return Result.error(e, `Could not view catalog member ${getName(item)}`);
        }
        return Result.none();
    }
    switchMobileView(viewName) {
        this.mobileView = viewName;
    }
    showHelpPanel() {
        var _a;
        (_a = this.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.help, HelpAction.panelOpened);
        this.showHelpMenu = true;
        this.helpPanelExpanded = false;
        this.selectedHelpMenuItem = "";
        this.setTopElement("HelpPanel");
    }
    selectHelpMenuItem(key) {
        this.selectedHelpMenuItem = key;
        this.helpPanelExpanded = true;
    }
    hideHelpPanel() {
        this.showHelpMenu = false;
    }
    changeSearchState(newText) {
        this.searchState.catalogSearchText = newText;
    }
    setDisclaimerVisible(bool) {
        this.disclaimerVisible = bool;
    }
    hideDisclaimer() {
        this.setDisclaimerVisible(false);
    }
    setShowSatelliteGuidance(showSatelliteGuidance) {
        this.showSatelliteGuidance = showSatelliteGuidance;
    }
    setShowWelcomeMessage(welcomeMessageShown) {
        this.showWelcomeMessage = welcomeMessageShown;
    }
    setVideoGuideVisible(videoName) {
        this.videoGuideVisible = videoName;
    }
    /**
     * Removes references of a model from viewState
     */
    removeModelReferences(model) {
        if (this._previewedItem === model)
            this._previewedItem = undefined;
        if (this.userDataPreviewedItem === model)
            this.userDataPreviewedItem = undefined;
    }
    toggleFeaturePrompt(feature, state, persistent = false) {
        const featureIndexInPrompts = this.featurePrompts.indexOf(feature);
        if (state &&
            featureIndexInPrompts < 0 &&
            !this.terria.getLocalProperty(`${feature}Prompted`)) {
            this.featurePrompts.push(feature);
        }
        else if (!state && featureIndexInPrompts >= 0) {
            this.featurePrompts.splice(featureIndexInPrompts, 1);
        }
        if (persistent) {
            this.terria.setLocalProperty(`${feature}Prompted`, true);
        }
    }
    viewingUserData() {
        return this.activeTabCategory === USER_DATA_NAME;
    }
    afterTerriaStarted() {
        if (this.terria.configParameters.openAddData) {
            this.openAddData();
        }
    }
    openTool(tool) {
        this.currentTool = tool;
    }
    closeTool() {
        this.currentTool = undefined;
    }
    setPrintWindow(window) {
        if (this.printWindow) {
            this.printWindow.close();
        }
        this.printWindow = window;
    }
    toggleMobileMenu() {
        this.setTopElement("mobileMenu");
        this.mobileMenuVisible = !this.mobileMenuVisible;
    }
    get breadcrumbsShown() {
        return (this.previewedItem !== undefined ||
            this.userDataPreviewedItem !== undefined);
    }
    get isToolOpen() {
        return this.currentTool !== undefined;
    }
    get hideMapUi() {
        return (this.terria.notificationState.currentNotification !== undefined &&
            this.terria.notificationState.currentNotification.hideUi);
    }
    get isMapZooming() {
        return this.terria.currentViewer.isMapZooming;
    }
    /**
     * Returns true if the user is currently interacting with the map - like
     * picking a point or drawing a shape.
     */
    get isMapInteractionActive() {
        return this.terria.mapInteractionModeStack.length > 0;
    }
}
__decorate([
    observable
], ViewState.prototype, "_previewedItem", void 0);
__decorate([
    observable
], ViewState.prototype, "userDataPreviewedItem", void 0);
__decorate([
    observable
], ViewState.prototype, "explorerPanelIsVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "activeTabCategory", void 0);
__decorate([
    observable
], ViewState.prototype, "activeTabIdInCategory", void 0);
__decorate([
    observable
], ViewState.prototype, "isDraggingDroppingFile", void 0);
__decorate([
    observable
], ViewState.prototype, "mobileView", void 0);
__decorate([
    observable
], ViewState.prototype, "isMapFullScreen", void 0);
__decorate([
    observable
], ViewState.prototype, "myDataIsUploadView", void 0);
__decorate([
    observable
], ViewState.prototype, "mobileMenuVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "explorerPanelAnimating", void 0);
__decorate([
    observable
], ViewState.prototype, "topElement", void 0);
__decorate([
    observable
], ViewState.prototype, "lastUploadedFiles", void 0);
__decorate([
    observable
], ViewState.prototype, "storyBuilderShown", void 0);
__decorate([
    observable
], ViewState.prototype, "showHelpMenu", void 0);
__decorate([
    observable
], ViewState.prototype, "showSatelliteGuidance", void 0);
__decorate([
    observable
], ViewState.prototype, "showWelcomeMessage", void 0);
__decorate([
    observable
], ViewState.prototype, "selectedHelpMenuItem", void 0);
__decorate([
    observable
], ViewState.prototype, "helpPanelExpanded", void 0);
__decorate([
    observable
], ViewState.prototype, "disclaimerSettings", void 0);
__decorate([
    observable
], ViewState.prototype, "disclaimerVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "videoGuideVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "trainerBarVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "trainerBarExpanded", void 0);
__decorate([
    observable
], ViewState.prototype, "trainerBarShowingAllSteps", void 0);
__decorate([
    observable
], ViewState.prototype, "selectedTrainerItem", void 0);
__decorate([
    observable
], ViewState.prototype, "currentTrainerItemIndex", void 0);
__decorate([
    observable
], ViewState.prototype, "currentTrainerStepIndex", void 0);
__decorate([
    observable
], ViewState.prototype, "printWindow", void 0);
__decorate([
    action
], ViewState.prototype, "setSelectedTrainerItem", null);
__decorate([
    action
], ViewState.prototype, "setTrainerBarVisible", null);
__decorate([
    action
], ViewState.prototype, "setTrainerBarShowingAllSteps", null);
__decorate([
    action
], ViewState.prototype, "setTrainerBarExpanded", null);
__decorate([
    action
], ViewState.prototype, "setCurrentTrainerItemIndex", null);
__decorate([
    action
], ViewState.prototype, "setCurrentTrainerStepIndex", null);
__decorate([
    observable
], ViewState.prototype, "bottomDockHeight", void 0);
__decorate([
    action
], ViewState.prototype, "setBottomDockHeight", null);
__decorate([
    observable
], ViewState.prototype, "workbenchWithOpenControls", void 0);
__decorate([
    observable
], ViewState.prototype, "storyShown", void 0);
__decorate([
    observable
], ViewState.prototype, "currentStoryId", void 0);
__decorate([
    observable
], ViewState.prototype, "featurePrompts", void 0);
__decorate([
    observable
], ViewState.prototype, "tourPoints", void 0);
__decorate([
    observable
], ViewState.prototype, "showTour", void 0);
__decorate([
    observable
], ViewState.prototype, "appRefs", void 0);
__decorate([
    observable
], ViewState.prototype, "currentTourIndex", void 0);
__decorate([
    observable
], ViewState.prototype, "showCollapsedNavigation", void 0);
__decorate([
    action
], ViewState.prototype, "setTourIndex", null);
__decorate([
    action
], ViewState.prototype, "setShowTour", null);
__decorate([
    action
], ViewState.prototype, "closeTour", null);
__decorate([
    action
], ViewState.prototype, "previousTourPoint", null);
__decorate([
    action
], ViewState.prototype, "nextTourPoint", null);
__decorate([
    action
], ViewState.prototype, "closeCollapsedNavigation", null);
__decorate([
    action
], ViewState.prototype, "updateAppRef", null);
__decorate([
    action
], ViewState.prototype, "deleteAppRef", null);
__decorate([
    observable
], ViewState.prototype, "useSmallScreenInterface", void 0);
__decorate([
    observable
], ViewState.prototype, "featureInfoPanelIsVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "featureInfoPanelIsCollapsed", void 0);
__decorate([
    observable
], ViewState.prototype, "firstTimeAddingData", void 0);
__decorate([
    observable
], ViewState.prototype, "feedbackFormIsVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "shareModelIsVisible", void 0);
__decorate([
    observable
], ViewState.prototype, "currentTool", void 0);
__decorate([
    observable
], ViewState.prototype, "panel", void 0);
__decorate([
    action
], ViewState.prototype, "triggerResizeEvent", null);
__decorate([
    action
], ViewState.prototype, "setIsMapFullScreen", null);
__decorate([
    action
], ViewState.prototype, "toggleStoryBuilder", null);
__decorate([
    action
], ViewState.prototype, "setTopElement", null);
__decorate([
    action
], ViewState.prototype, "openAddData", null);
__decorate([
    action
], ViewState.prototype, "openUserData", null);
__decorate([
    action
], ViewState.prototype, "closeCatalog", null);
__decorate([
    action
], ViewState.prototype, "searchInCatalog", null);
__decorate([
    action
], ViewState.prototype, "clearPreviewedItem", null);
__decorate([
    action
], ViewState.prototype, "switchMobileView", null);
__decorate([
    action
], ViewState.prototype, "showHelpPanel", null);
__decorate([
    action
], ViewState.prototype, "selectHelpMenuItem", null);
__decorate([
    action
], ViewState.prototype, "hideHelpPanel", null);
__decorate([
    action
], ViewState.prototype, "changeSearchState", null);
__decorate([
    action
], ViewState.prototype, "setDisclaimerVisible", null);
__decorate([
    action
], ViewState.prototype, "hideDisclaimer", null);
__decorate([
    action
], ViewState.prototype, "setShowSatelliteGuidance", null);
__decorate([
    action
], ViewState.prototype, "setShowWelcomeMessage", null);
__decorate([
    action
], ViewState.prototype, "setVideoGuideVisible", null);
__decorate([
    action
], ViewState.prototype, "removeModelReferences", null);
__decorate([
    action
], ViewState.prototype, "toggleFeaturePrompt", null);
__decorate([
    action
], ViewState.prototype, "openTool", null);
__decorate([
    action
], ViewState.prototype, "closeTool", null);
__decorate([
    action
], ViewState.prototype, "setPrintWindow", null);
__decorate([
    action
], ViewState.prototype, "toggleMobileMenu", null);
__decorate([
    computed
], ViewState.prototype, "breadcrumbsShown", null);
__decorate([
    computed
], ViewState.prototype, "isToolOpen", null);
__decorate([
    computed
], ViewState.prototype, "hideMapUi", null);
__decorate([
    computed
], ViewState.prototype, "isMapInteractionActive", null);
//# sourceMappingURL=ViewState.js.map
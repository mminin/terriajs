export var Category;
(function (Category) {
    Category["search"] = "Search";
    Category["launch"] = "Launch";
    Category["help"] = "Help";
    Category["timeLine"] = "Time line";
    Category["view"] = "View";
    Category["dataSource"] = "Data Source";
    Category["dataTab"] = "Data tab";
    Category["addDataUrl"] = "Add data Url";
    Category["guide"] = "Guide";
    Category["share"] = "Share";
    Category["story"] = "Story";
})(Category || (Category = {}));
export var SearchAction;
(function (SearchAction) {
    SearchAction["bing"] = "Bing";
    SearchAction["catalog"] = "Catalog";
    SearchAction["gazetteer"] = "Gazetteer";
    SearchAction["gnaf"] = "gnaf";
    SearchAction["nominatim"] = "nominatim";
})(SearchAction || (SearchAction = {}));
export var LaunchAction;
(function (LaunchAction) {
    LaunchAction["url"] = "url";
})(LaunchAction || (LaunchAction = {}));
export var HelpAction;
(function (HelpAction) {
    HelpAction["panelOpened"] = "Panel opened";
    HelpAction["takeTour"] = "Take tour";
})(HelpAction || (HelpAction = {}));
export var TimeLineAction;
(function (TimeLineAction) {
    TimeLineAction["goToStart"] = "Go to start";
    TimeLineAction["togglePlay"] = "Toggle play";
    TimeLineAction["playSlower"] = "Play slower";
    TimeLineAction["playFaster"] = "Play faster";
    TimeLineAction["toggleLoop"] = "Toggle loop";
})(TimeLineAction || (TimeLineAction = {}));
export var ViewAction;
(function (ViewAction) {
    ViewAction["zoomIn"] = "Zoom in";
    ViewAction["zoomOut"] = "Zoom out";
    ViewAction["reset"] = "Reset";
    ViewAction["enterFullScreen"] = "Enter full screen";
    ViewAction["exitFullScreen"] = "Exit full screen";
})(ViewAction || (ViewAction = {}));
export var DataSourceAction;
(function (DataSourceAction) {
    DataSourceAction["addFromCatalogue"] = "Add from catalogue";
    DataSourceAction["removeFromCatalogue"] = "Remove from catalogue";
    DataSourceAction["addFromPreviewButton"] = "Add from preview button";
    DataSourceAction["removeFromPreviewButton"] = "Remove from preview button";
    DataSourceAction["removeAllFromWorkbench"] = "Remove all from workbench";
})(DataSourceAction || (DataSourceAction = {}));
export var DatatabAction;
(function (DatatabAction) {
    DatatabAction["addDataUrl"] = "Add data url";
})(DatatabAction || (DatatabAction = {}));
export var GuideAction;
(function (GuideAction) {
    GuideAction["open"] = "open";
    GuideAction["close"] = "close";
    GuideAction["openInModal"] = "open (inside modal)";
    GuideAction["closeInModal"] = "close (inside modal)";
    GuideAction["navigatePrev"] = "Navigate previous";
    GuideAction["navigateNext"] = "Navigate next";
})(GuideAction || (GuideAction = {}));
export var ShareAction;
(function (ShareAction) {
    ShareAction["storyCopy"] = "Story copy url";
    ShareAction["catalogCopy"] = "Catalogue copy";
    ShareAction["shareCopy"] = "Share copy";
})(ShareAction || (ShareAction = {}));
export var StoryAction;
(function (StoryAction) {
    StoryAction["saveStory"] = "save story";
    StoryAction["runStory"] = "run story";
    StoryAction["viewScene"] = "view scene";
    StoryAction["datasetView"] = "dataset view";
})(StoryAction || (StoryAction = {}));
//# sourceMappingURL=analyticEvents.js.map
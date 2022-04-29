// Position of tour point explanations relative to highlighted element.
export var RelativePosition;
(function (RelativePosition) {
    RelativePosition[RelativePosition["RECT_LEFT"] = 0] = "RECT_LEFT";
    RelativePosition[RelativePosition["RECT_RIGHT"] = 1] = "RECT_RIGHT";
    RelativePosition[RelativePosition["RECT_TOP"] = 2] = "RECT_TOP";
    RelativePosition[RelativePosition["RECT_BOTTOM"] = 3] = "RECT_BOTTOM";
})(RelativePosition || (RelativePosition = {}));
export const TOUR_WIDTH = 345;
// use appRefName as the ID
export const defaultTourPoints = [
    {
        appRefName: "LocationSearchInput",
        priority: 30,
        offsetLeft: 225,
        content: "translate#tour.locationSearchInput.content"
    },
    {
        appRefName: "ExploreMapDataButton",
        priority: 10,
        offsetLeft: 70,
        content: "translate#tour.exploreMapDataButton.content"
    },
    {
        appRefName: "SidePanelUploadButton",
        priority: 20,
        offsetLeft: 70,
        content: "translate#tour.sidePanelUploadButton.content"
    },
    {
        appRefName: "MenuBarMapSettingsButton",
        priority: 40,
        caretOffsetLeft: TOUR_WIDTH - 25,
        offsetLeft: -TOUR_WIDTH - 30,
        positionLeft: RelativePosition.RECT_RIGHT,
        content: "translate#tour.menuBarMapSettingsButton.content"
    },
    {
        appRefName: "MenuBarStoryButton",
        priority: 50,
        caretOffsetLeft: TOUR_WIDTH - 25,
        offsetLeft: -TOUR_WIDTH - 10,
        positionLeft: RelativePosition.RECT_RIGHT,
        content: "translate#tour.menuBarStoryButton.content"
    },
    {
        appRefName: "MapNavigationCompassOuterRing",
        priority: 60,
        caretOffsetTop: 18,
        caretOffsetLeft: TOUR_WIDTH - 18,
        indicatorOffsetTop: 15,
        indicatorOffsetLeft: 25,
        offsetTop: 0,
        offsetLeft: -TOUR_WIDTH - 15,
        positionTop: RelativePosition.RECT_TOP,
        positionLeft: RelativePosition.RECT_LEFT,
        content: "translate#tour.mapNavigationCompassOuterRing.content"
    },
    {
        appRefName: "MapNavigationSplitterIcon",
        priority: 70,
        caretOffsetTop: 20,
        caretOffsetLeft: TOUR_WIDTH - 18,
        indicatorOffsetTop: 3,
        indicatorOffsetLeft: 17,
        offsetTop: -15,
        offsetLeft: -TOUR_WIDTH - 15,
        positionTop: RelativePosition.RECT_TOP,
        positionLeft: RelativePosition.RECT_LEFT,
        content: "translate#tour.mapNavigationSplitterIcon.content"
    }
];
//# sourceMappingURL=defaultTourPoints.js.map
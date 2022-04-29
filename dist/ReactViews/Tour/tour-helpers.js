import isDefined from "../../Core/isDefined";
import { RelativePosition } from "../../ReactViewModels/defaultTourPoints";
export { RelativePosition, TOUR_WIDTH } from "../../ReactViewModels/defaultTourPoints";
// We need isDefined across these as we are dealing with numbers, 0 is falsy
export function getOffsetsFromTourPoint(tourPoint) {
    // Offsets
    const offsetTop = isDefined(tourPoint === null || tourPoint === void 0 ? void 0 : tourPoint.offsetTop) ? tourPoint.offsetTop : 15;
    const offsetLeft = isDefined(tourPoint === null || tourPoint === void 0 ? void 0 : tourPoint.offsetLeft)
        ? tourPoint.offsetLeft
        : 0;
    // TODO(wing): caret could easily be smarter than manually positioning it,
    // take the rectangle from the highlighted component and set the base offset
    // around that. manually position it for now
    const caretOffsetTop = isDefined(tourPoint === null || tourPoint === void 0 ? void 0 : tourPoint.caretOffsetTop)
        ? tourPoint.caretOffsetTop
        : -3;
    const caretOffsetLeft = isDefined(tourPoint === null || tourPoint === void 0 ? void 0 : tourPoint.caretOffsetLeft)
        ? tourPoint.caretOffsetLeft
        : 20;
    // todo: more stuff that could be structured better
    const indicatorOffsetTop = isDefined(tourPoint === null || tourPoint === void 0 ? void 0 : tourPoint.indicatorOffsetTop)
        ? tourPoint.indicatorOffsetTop
        : -20;
    const indicatorOffsetLeft = isDefined(tourPoint === null || tourPoint === void 0 ? void 0 : tourPoint.indicatorOffsetLeft)
        ? tourPoint.indicatorOffsetLeft
        : 3;
    return {
        offsetTop,
        offsetLeft,
        caretOffsetTop,
        caretOffsetLeft,
        indicatorOffsetTop,
        indicatorOffsetLeft
    };
}
/**
 * Work out the screen pixel value for left positioning based on helpScreen parameters.
 * @private
 */
export function calculateLeftPosition(helpScreen) {
    const screenRect = helpScreen.rectangle;
    if (!screenRect) {
        console.log("no rectangle in helpScreen");
        return 0;
    }
    let leftPosition = 0;
    if (helpScreen.positionLeft === RelativePosition.RECT_LEFT) {
        leftPosition = screenRect.left;
    }
    else if (helpScreen.positionLeft === RelativePosition.RECT_RIGHT) {
        leftPosition = screenRect.right;
    }
    else if (helpScreen.positionLeft === RelativePosition.RECT_TOP) {
        leftPosition = screenRect.top;
    }
    else if (helpScreen.positionLeft === RelativePosition.RECT_BOTTOM) {
        leftPosition = screenRect.bottom;
    }
    leftPosition += helpScreen.offsetLeft || 0;
    return leftPosition;
}
/**
 * Work out the screen pixel value for top positioning based on helpScreen parameters.
 * @private
 */
export function calculateTopPosition(helpScreen) {
    const screenRect = helpScreen.rectangle;
    if (!screenRect) {
        console.log("no rectangle in helpScreen");
        return 0;
    }
    let topPosition = 0;
    if (helpScreen.positionTop === RelativePosition.RECT_LEFT) {
        topPosition = screenRect.left;
    }
    else if (helpScreen.positionTop === RelativePosition.RECT_RIGHT) {
        topPosition = screenRect.right;
    }
    else if (helpScreen.positionTop === RelativePosition.RECT_TOP) {
        topPosition = screenRect.top;
    }
    else if (helpScreen.positionTop === RelativePosition.RECT_BOTTOM) {
        topPosition = screenRect.bottom;
    }
    topPosition += helpScreen.offsetTop || 0;
    return topPosition;
}
//# sourceMappingURL=tour-helpers.js.map
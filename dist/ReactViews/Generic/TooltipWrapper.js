/**
 * base tooltipwrapperraw repurposed from magda, with some a11y modifications
 */
import React from "react";
import ReactDOM from "react-dom";
import { withTheme } from "styled-components";
import { useUID } from "react-uid";
import { BoxSpan } from "../../Styled/Box";
import { RawButton } from "../../Styled/Button";
import { TextSpan } from "../../Styled/Text";
/**
 * @description Return a information tooltip, on hover show calculation method.
 */
class TooltipWrapperRaw extends React.Component {
    constructor() {
        super(...arguments);
        this.rootRef = React.createRef();
        this.tooltipTextElementRef = React.createRef();
        this.state = {
            offset: 0,
            open: !!this.props.startOpen
        };
        this.dismiss = () => {
            this.props.onDismiss && this.props.onDismiss();
            this.setState({ open: false });
        };
        /**
         * get live-render-time values of tooltip ref - should already offset adjusted
         * by the time its rendered
         */
        this.getTooltipCoords = () => {
            const tooltipTextElement = this.tooltipTextElementRef.current;
            if (!tooltipTextElement) {
                return { x: 0, y: 0 };
            }
            const { x, y, width, height } = tooltipTextElement.getBoundingClientRect();
            const maxX = document.documentElement.clientWidth - width;
            const maxY = document.documentElement.clientHeight - height;
            // make sure the tooltip doesn't get clipped by the browser edges
            const adjustedX = x < 10 ? 10 : x > maxX ? maxX - 10 : x;
            const adjustedY = y < 10 ? 10 : y > maxY ? maxY - 10 : y;
            return { x: adjustedX, y: adjustedY };
        };
        this.forceSetState = (bool = true) => {
            this.setState({
                open: bool
            });
        };
    }
    componentDidMount() {
        if (!this.props.disableEventListeners) {
            document.addEventListener("mousedown", this.dismiss);
            document.addEventListener("touchstart", this.dismiss);
        }
        this.adjustOffset();
    }
    componentDidUpdate() {
        this.adjustOffset();
    }
    componentWillUnmount() {
        if (!this.props.disableEventListeners) {
            document.removeEventListener("mousedown", this.dismiss);
            document.removeEventListener("touchstart", this.dismiss);
        }
    }
    /**
     * Adjust the offset margin of the tooltiptext so it's at the centre of the launcher.
     */
    adjustOffset() {
        var _a;
        const tooltipTextElement = this.tooltipTextElementRef.current;
        const rootElement = this.rootRef.current;
        // Why .firstChild? Because we can't attach a ref to a render prop unless whatever's passed in passes the ref through to its first dom element
        const launcherElement = (_a = rootElement) === null || _a === void 0 ? void 0 : _a.firstChild;
        if (!launcherElement || !tooltipTextElement) {
            return;
        }
        const launcherElementStyle = launcherElement.currentStyle ||
            window.getComputedStyle(launcherElement);
        const tooltipWidth = tooltipTextElement.offsetWidth;
        const offset = (tooltipWidth +
            parseFloat(launcherElementStyle.marginLeft) +
            parseFloat(launcherElementStyle.marginRight) -
            parseFloat(launcherElementStyle.paddingRight) -
            parseFloat(launcherElementStyle.paddingLeft)) /
            2;
        // only update if the difference is big enough to prevent indefinite loop caused by browser sub pixel error
        // FIXME: this test however passes in safari mobile each time resulting in a inifinite render loop
        if (Math.abs(this.state.offset - offset) > 5) {
            this.setState({
                offset: offset
            });
        }
    }
    render() {
        const { orientation, theme, innerElementStyles } = this.props;
        const orientationBelow = orientation === "below";
        // default to above
        const orientationAbove = orientation === "above" || orientation === undefined;
        return (React.createElement("span", { ref: this.rootRef, css: `
          position: relative;
          display: inline-block;
        ` },
            this.props.launcher &&
                this.props.launcher({
                    state: this.state,
                    launch: () => this.forceSetState(true),
                    forceSetState: this.forceSetState
                }),
            this.state.open &&
                ReactDOM.createPortal(React.createElement(BoxSpan, { paddedRatio: 3, position: "absolute", rounded: true, style: {
                        ...innerElementStyles
                    }, css: `
                // TODO: find offending z-index - likely still in scss
                z-index: ${theme.frontComponentZIndex + 999999 + 2};
                background-color: ${theme.textDark};
                color: ${theme.textLight};
                text-align: left;
                top: ${this.getTooltipCoords().y}px;
                left: ${this.getTooltipCoords().x}px;
              ` }, this.props.children(true, this.dismiss)), document.body),
            React.createElement(BoxSpan, { paddedRatio: 3, position: "absolute", css: `
            visibility: hidden;
            left: 50%;

            ${orientationAbove && `bottom: calc(100% + 10px);`}
            ${orientationBelow && `top: calc(100% + 10px);`}
          `, ref: this.tooltipTextElementRef, style: {
                    marginLeft: "-" + this.state.offset + "px",
                    ...innerElementStyles
                } }, this.props.children(false, this.dismiss))));
    }
}
export const TooltipWrapper = withTheme(TooltipWrapperRaw);
export const TooltipWithButtonLauncher = (props) => {
    const { launcherComponent, children, dismissOnLeave, orientation, ...rest } = props;
    const idForAria = `ButtonLauncher-${useUID()}`;
    const idForChildAria = `ButtonLauncher-child-${useUID()}`;
    return (React.createElement(TooltipWrapper, Object.assign({ innerElementStyles: {
            width: "350px"
        }, orientation: orientation || "below" }, rest, { disableEventListeners: true, launcher: (launchObj) => {
            const handleClose = () => {
                if (launchObj.state.open) {
                    launchObj.forceSetState(false);
                }
            };
            const restButtonProps = dismissOnLeave
                ? {
                    onMouseLeave: () => handleClose(),
                    onBlur: () => handleClose()
                }
                : {};
            return (React.createElement(RawButton, Object.assign({ css: "text-decoration: underline dashed;", "aria-expanded": launchObj.state.open, "aria-describedby": `${idForAria} ${idForChildAria}`, onClick: () => launchObj.forceSetState(!launchObj.state.open), onFocus: launchObj.launch, onMouseOver: () => {
                    if (!launchObj.state.open) {
                        launchObj.launch();
                    }
                } }, restButtonProps), launcherComponent()));
        } }), (applyAriaId) => (React.createElement(TextSpan
    // provide some base text styles as a textspan,
    // as this will be rendered outside the tree
    , Object.assign({ 
        // provide some base text styles as a textspan,
        // as this will be rendered outside the tree
        large: true, semiBold: true }, {
        id: (applyAriaId && idForAria) || undefined
    }), children((applyAriaId && idForChildAria) || "")))));
};
export default TooltipWrapper;
//# sourceMappingURL=TooltipWrapper.js.map
import React from "react";
import debounce from "lodash-es/debounce";
const getDisplayName = (WrappedComponent) => {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
};
/*
    HOC to check component width & supply updated widths as a prop (stored interally via state)
    Ensure the wrapped component contains a reference to the element you wish to measure the width of,
    typically the root element - ensure the ref is a HTML element and not a custom class component,
    as we want to use the DOM API

    Set the ref via a callback ref
    ```js
    ref={component => (this.refToMeasure = component)}>
    ```

    or

    Set the ref via createRef
    `React.createRef()` in constructor, then setting via
    ```js
    ref={this.refToMeasure}>
    ```
*/
const measureElement = (WrappedComponent, verbose = true) => {
    class MeasureElement extends React.Component {
        constructor(props) {
            super(props);
            this.wrappedComponent = React.createRef();
            this.state = {
                width: null,
                height: null
            };
            this.checkAndUpdateSizing = this.checkAndUpdateSizing.bind(this);
            this.checkAndUpdateSizingWithDebounce = debounce(this.checkAndUpdateSizing, 200);
        }
        componentDidMount() {
            window.addEventListener("resize", this.checkAndUpdateSizingWithDebounce);
            this.checkAndUpdateSizing();
        }
        componentDidUpdate() {
            this.checkAndUpdateSizing();
        }
        componentWillUnmount() {
            window.removeEventListener("resize", this.checkAndUpdateSizingWithDebounce);
        }
        checkAndUpdateSizing() {
            var _a, _b;
            if (!this.wrappedComponent.current) {
                return;
            }
            const refToUse = this.wrappedComponent.current.refToMeasure;
            const widthFromRef = refToUse
                ? "current" in refToUse
                    ? (_a = refToUse.current) === null || _a === void 0 ? void 0 : _a.clientWidth : refToUse.clientWidth
                : undefined;
            const heightFromRef = refToUse
                ? "current" in refToUse
                    ? (_b = refToUse.current) === null || _b === void 0 ? void 0 : _b.clientHeight : refToUse.clientHeight
                : undefined;
            const newWidth = widthFromRef || 0;
            const newHeight = heightFromRef || 0;
            if (verbose) {
                if (!widthFromRef || !heightFromRef)
                    console.warn("measureElement was used without a ref to measure");
                // not sure if we warn on height = 0?
                if (newWidth === 0 || newHeight === 0)
                    console.warn("measureElement has a reading of 0");
            }
            // if we haven't already set the width, or if the current width doesn't match the newly rendered width
            if (this.wrappedComponent.current &&
                this.wrappedComponent.current.refToMeasure) {
                if (
                // if we get into a null state this has a path of setting infinitely(?)
                // !this.state.height ||
                // !this.state.width ||
                this.state.height !== newHeight ||
                    this.state.width !== newWidth) {
                    this.setState({ width: newWidth, height: newHeight });
                }
            }
        }
        render() {
            return (React.createElement(WrappedComponent, Object.assign({}, this.props, { ref: this.wrappedComponent, widthFromMeasureElementHOC: this.state.width, heightFromMeasureElementHOC: this.state.height })));
        }
    }
    MeasureElement.displayName = `MeasureElement(${getDisplayName(WrappedComponent)})`;
    return MeasureElement;
};
export default measureElement;
//# sourceMappingURL=measureElement.js.map
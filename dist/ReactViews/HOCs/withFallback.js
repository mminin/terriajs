import React, { Suspense } from "react";
import PropTypes from "prop-types";
// TODO: better fallback
// This is used as i18n can be configured by a TerriaMap to run & use suspense,
// which will use the suspend API & will throw without a suspend component in
// the tree - of which we don't currently have at any point
/**
 * HOC for a basic fallback UI incase any dependencies end up using suspense
 * features
 */
export const withFallback = (WrappedComponent) => {
    const WithFallback = (props) => {
        return (React.createElement(Suspense, { fallback: "Loading..." },
            React.createElement(WrappedComponent, Object.assign({}, props))));
    };
    WithFallback.propTypes = {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired
    };
    return WithFallback;
};
export default withFallback;
//# sourceMappingURL=withFallback.js.map
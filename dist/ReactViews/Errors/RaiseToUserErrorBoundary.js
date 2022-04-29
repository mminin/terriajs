import React from "react";
/**
 * An error boundary that raises the error to the user.
 */
export default class RaiseToUserErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true
        };
    }
    componentDidCatch(error, errorInfo) {
        this.props.viewState.terria.raiseErrorToUser(error, this.props.terriaErrorOptions);
    }
    render() {
        return this.state.hasError ? null : this.props.children;
    }
}
//# sourceMappingURL=RaiseToUserErrorBoundary.js.map
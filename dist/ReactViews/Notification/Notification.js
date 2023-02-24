import { observer } from "mobx-react";
import React from "react";
import triggerResize from "../../Core/triggerResize";
import { useViewState } from "../StandardUserInterface/ViewStateContext";
// Avoid type error caused by importing untyped jsx
const NotificationWindow = require("./NotificationWindow").default;
const Notification = observer(() => {
    var _a;
    const viewState = useViewState();
    const notificationState = viewState === null || viewState === void 0 ? void 0 : viewState.terria.notificationState;
    const notification = notificationState === null || notificationState === void 0 ? void 0 : notificationState.currentNotification;
    if (viewState === undefined ||
        notificationState === undefined ||
        notification === undefined) {
        return React.createElement(React.Fragment, null);
    }
    const close = () => {
        // Force refresh once the notification is dispatched if .hideUi is set since once all the .hideUi's
        // have been dispatched the UI will no longer be suppressed causing a change in the view state.
        if (notification.hideUi) {
            triggerResize();
        }
        notificationState.dismissCurrentNotification();
    };
    const confirm = () => {
        if (notification.confirmAction !== undefined) {
            notification.confirmAction();
        }
        close();
    };
    const deny = () => {
        if (notification.denyAction !== undefined) {
            notification.denyAction();
        }
        close();
    };
    return (React.createElement(NotificationWindow, { viewState: viewState, title: notification.title, message: notification.message, confirmText: notification.confirmText, denyText: notification.denyText, onConfirm: confirm, onDeny: deny, type: (_a = notification.type) !== null && _a !== void 0 ? _a : "notification", width: notification.width, height: notification.height }));
});
export default Notification;
//# sourceMappingURL=Notification.js.map
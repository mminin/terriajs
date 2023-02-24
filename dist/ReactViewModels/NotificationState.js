var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable } from "mobx";
/**
 * Tracks pending notifications, and provides and interface for adding and removing them.
 * Notification queue is first-in, first-out.
 * Notifications with the same key will only be added once.
 */
export default class NotificationState {
    constructor() {
        this.notifications = [];
        this.alreadyNotifiedKeys = new Set();
    }
    addNotificationToQueue(notification) {
        var _a;
        const alreadyQueued = this.notifications.filter((item) => item.title === notification.title &&
            item.message === notification.message).length !== 0;
        const keyNotSeenBefore = notification.key === undefined ||
            !this.alreadyNotifiedKeys.has(notification.key);
        if (!alreadyQueued && keyNotSeenBefore) {
            const ignore = typeof notification.ignore === "function"
                ? notification.ignore()
                : (_a = notification.ignore) !== null && _a !== void 0 ? _a : false;
            if (!ignore)
                this.notifications.push(notification);
        }
        if (notification.key !== undefined) {
            this.alreadyNotifiedKeys.add(notification.key);
        }
    }
    dismissCurrentNotification() {
        const removed = this.notifications.shift();
        (removed === null || removed === void 0 ? void 0 : removed.onDismiss) && removed.onDismiss();
        // Remove all ignored notifications
        // This is needed here as the action of dismissing the current notification may change "ignore" status of notifications in stack
        this.notifications = this.notifications.filter((n) => { var _a; return !(typeof n.ignore === "function" ? n.ignore() : (_a = n.ignore) !== null && _a !== void 0 ? _a : false); });
        return removed;
    }
    get currentNotification() {
        return this.notifications.length > 0 ? this.notifications[0] : undefined;
    }
}
__decorate([
    observable
], NotificationState.prototype, "notifications", void 0);
__decorate([
    action
], NotificationState.prototype, "addNotificationToQueue", null);
__decorate([
    action
], NotificationState.prototype, "dismissCurrentNotification", null);
__decorate([
    computed
], NotificationState.prototype, "currentNotification", null);
//# sourceMappingURL=NotificationState.js.map
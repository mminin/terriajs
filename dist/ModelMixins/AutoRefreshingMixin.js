var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { computed, onBecomeObserved, onBecomeUnobserved, reaction } from "mobx";
import { now } from "mobx-utils";
import MappableMixin from "./MappableMixin";
export default function AutoRefreshingMixin(Base) {
    class AutoRefreshingMixin extends MappableMixin(Base) {
        constructor(...args) {
            super(...args);
            // We should only poll when our map items have consumers
            onBecomeObserved(this, "mapItems", this.startAutoRefresh.bind(this));
            onBecomeUnobserved(this, "mapItems", this.stopAutoRefresh.bind(this));
        }
        startAutoRefresh() {
            if (!this.autorunRefreshEnableDisposer) {
                // Toggle autorefresh when `refreshEnabled` trait changes
                this.autorunRefreshEnableDisposer = reaction(() => this.refreshEnabled, () => {
                    if (this.refreshEnabled) {
                        this.startAutoRefresh();
                    }
                    else {
                        this.stopAutoRefresh();
                    }
                });
            }
            if (!this.autoRefreshDisposer && this.refreshEnabled) {
                this.autoRefreshDisposer = reaction(() => this._pollingTimer, () => {
                    if (this.show)
                        this.refreshData();
                });
            }
        }
        stopAutoRefresh() {
            if (this.autorunRefreshEnableDisposer) {
                this.autorunRefreshEnableDisposer();
                this.autorunRefreshEnableDisposer = undefined;
            }
            if (this.autoRefreshDisposer) {
                this.autoRefreshDisposer();
                this.autoRefreshDisposer = undefined;
            }
        }
        get _pollingTimer() {
            if (this.refreshInterval !== undefined) {
                return now(this.refreshInterval * 1000);
            }
            else {
                return undefined;
            }
        }
        get isPolling() {
            return this._pollingTimer !== undefined;
        }
        get nextScheduledUpdateTime() {
            if (this.refreshEnabled &&
                this._pollingTimer !== undefined &&
                this.refreshInterval !== undefined) {
                return new Date(this._pollingTimer + this.refreshInterval * 1000);
            }
            else {
                return undefined;
            }
        }
    }
    __decorate([
        computed
    ], AutoRefreshingMixin.prototype, "_pollingTimer", null);
    __decorate([
        computed
    ], AutoRefreshingMixin.prototype, "isPolling", null);
    __decorate([
        computed
    ], AutoRefreshingMixin.prototype, "nextScheduledUpdateTime", null);
    return AutoRefreshingMixin;
}
//# sourceMappingURL=AutoRefreshingMixin.js.map
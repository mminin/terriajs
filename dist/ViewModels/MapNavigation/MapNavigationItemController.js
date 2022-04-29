var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action } from "mobx";
import { CompositeBarItemController } from "../CompositeBar/CompositeBarItemController";
export default class MapNavigationItemController extends CompositeBarItemController {
    /**
     * Set this item to active state. If used it's recommended to override this method and a proper logic
     * for activating this item, so it's easier to programmatically control the item from other places.
     */
    activate() {
        this._active = true;
    }
    /**
     * Set this item to inactive state. If used it's recommended to override this method and a proper logic
     * for deactivating this item, so it's easier to programmatically control the item from other places.
     */
    deactivate() {
        this._active = false;
    }
    get width() {
        if (this.itemRef &&
            this.itemRef.current &&
            this.itemRef.current.offsetWidth > 0) {
            return this.itemRef.current.offsetWidth;
        }
        return undefined;
    }
    get height() {
        if (this.itemRef &&
            this.itemRef.current &&
            this.itemRef.current.offsetHeight > 0) {
            return this.itemRef.current.offsetHeight;
        }
        return undefined;
    }
    handleClick() {
        if (this.active) {
            this.deactivate();
        }
        else {
            this.activate();
        }
    }
}
__decorate([
    action
], MapNavigationItemController.prototype, "activate", null);
__decorate([
    action
], MapNavigationItemController.prototype, "deactivate", null);
// Basically used with custom renderer element, just to control basic properties of elements
export class GenericMapNavigationItemController extends MapNavigationItemController {
    constructor(options) {
        super();
        this.options = options;
    }
    get glyph() {
        return this.options.icon;
    }
    get viewerMode() {
        var _a;
        return (_a = this.options) === null || _a === void 0 ? void 0 : _a.viewerMode;
    }
    activate() {
        var _a;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.activate) {
            this.options.activate();
        }
        super.activate();
    }
    deactivate() {
        var _a;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.deactivate) {
            this.options.deactivate();
        }
        super.deactivate();
    }
    handleClick() {
        var _a;
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.handleClick) {
            this.options.handleClick();
        }
        else {
            super.handleClick();
        }
    }
}
__decorate([
    action.bound
], GenericMapNavigationItemController.prototype, "activate", null);
__decorate([
    action.bound
], GenericMapNavigationItemController.prototype, "deactivate", null);
//# sourceMappingURL=MapNavigationItemController.js.map
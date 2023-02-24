var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable } from "mobx";
import isDefined from "../../Core/isDefined";
export var CompositeOrientation;
(function (CompositeOrientation) {
    CompositeOrientation[CompositeOrientation["HORIZONTAL"] = 0] = "HORIZONTAL";
    CompositeOrientation[CompositeOrientation["VERTICAL"] = 1] = "VERTICAL";
})(CompositeOrientation || (CompositeOrientation = {}));
export class CompositeBarModel {
    constructor(items, options) {
        this._items = [];
        if (options) {
            this.options = options;
        }
        if (items) {
            this.setItems(items);
        }
    }
    get items() {
        return this._items;
    }
    get visibleItems() {
        return this.items.filter((item) => item.controller.visible);
    }
    get pinnedItems() {
        return this.items.filter((item) => item.controller.visible && item.controller.pinned);
    }
    setItems(items) {
        const result = [];
        if (!this.items || this.items.length === 0) {
            this._items = items.map((item) => {
                return this.createCompositeBarItem(item);
            });
        }
        else {
            const existingItems = this.items;
            for (const newItem of items) {
                const existingItem = existingItems.filter(({ id }) => id === newItem.id)[0];
                if (existingItem) {
                    existingItem.controller = newItem.controller;
                    existingItem.name = newItem.name;
                    existingItem.title = newItem.title;
                    existingItem.screenSize = newItem.screenSize;
                    result.push(existingItem);
                }
                else {
                    result.push(this.createCompositeBarItem(newItem));
                }
            }
            this._items = result;
        }
    }
    add(newItem, requestedIndex) {
        const existingItem = this.findItem(newItem.id);
        if (existingItem) {
            existingItem.name = newItem.name;
            existingItem.controller = newItem.controller;
            existingItem.title = newItem.title;
            existingItem.screenSize = newItem.screenSize;
            existingItem.order = newItem.order;
        }
        else {
            const item = this.createCompositeBarItem(newItem);
            if (isDefined(requestedIndex)) {
                let index = 0;
                let rIndex = requestedIndex;
                while (rIndex > 0 && index < this.items.length) {
                    if (this.items[index++].controller.visible) {
                        rIndex--;
                    }
                }
                this.items.splice(index, 0, item);
            }
            else if (!isDefined(item.order)) {
                this.items.push(item);
            }
            else {
                let index = 0;
                while (index < this.items.length &&
                    typeof this.items[index].order === "number" &&
                    this.items[index].order < item.order) {
                    index++;
                }
                this.items.splice(index, 0, item);
            }
        }
    }
    remove(id) {
        for (let index = 0; index < this.items.length; index++) {
            if (this.items[index].id === id) {
                this.items.splice(index, 1);
                return;
            }
        }
    }
    hide(id) {
        for (const item of this.items) {
            if (item.id === id) {
                if (item.controller.visible) {
                    item.controller.setVisible(false);
                    return;
                }
                return;
            }
        }
    }
    show(id) {
        for (const item of this.items) {
            if (item.id === id) {
                if (!item.controller.visible) {
                    item.controller.setVisible(true);
                    return;
                }
                return;
            }
        }
    }
    disable(id) {
        for (const item of this.items) {
            if (item.id === id) {
                if (!item.controller.disabled) {
                    item.controller.disabled = true;
                    return;
                }
                return;
            }
        }
    }
    enable(id) {
        for (const item of this.items) {
            if (item.id === id) {
                if (item.controller.disabled) {
                    item.controller.disabled = false;
                    return;
                }
                return;
            }
        }
    }
    move(compositeId, toCompositeId) {
        const fromIndex = this.findIndex(compositeId);
        const toIndex = this.findIndex(toCompositeId);
        // Make sure both items are known to the model
        if (fromIndex === -1 || toIndex === -1) {
            return;
        }
        const sourceItem = this.items.splice(fromIndex, 1)[0];
        this.items.splice(toIndex, 0, sourceItem);
    }
    setPinned(id, pinned) {
        for (const item of this.items) {
            if (item.id === id) {
                if (item.controller.pinned !== pinned) {
                    item.controller.pinned = pinned;
                    return;
                }
                return;
            }
        }
    }
    setCollapsed(id, collapsed) {
        const item = this.findItem(id);
        if (item) {
            item.controller.collapsed = collapsed;
        }
    }
    findItem(id) {
        return this.items.filter((item) => item.id === id)[0];
    }
    createCompositeBarItem(item) {
        return item;
    }
    findIndex(id) {
        for (let index = 0; index < this.items.length; index++) {
            if (this.items[index].id === id) {
                return index;
            }
        }
        return -1;
    }
}
__decorate([
    observable
], CompositeBarModel.prototype, "_items", void 0);
__decorate([
    computed
], CompositeBarModel.prototype, "items", null);
__decorate([
    computed
], CompositeBarModel.prototype, "visibleItems", null);
__decorate([
    action.bound
], CompositeBarModel.prototype, "add", null);
__decorate([
    action
], CompositeBarModel.prototype, "remove", null);
__decorate([
    action.bound
], CompositeBarModel.prototype, "hide", null);
__decorate([
    action.bound
], CompositeBarModel.prototype, "show", null);
__decorate([
    action
], CompositeBarModel.prototype, "disable", null);
__decorate([
    action
], CompositeBarModel.prototype, "enable", null);
__decorate([
    action
], CompositeBarModel.prototype, "move", null);
__decorate([
    action
], CompositeBarModel.prototype, "setPinned", null);
__decorate([
    action.bound
], CompositeBarModel.prototype, "setCollapsed", null);
//# sourceMappingURL=CompositeBarModel.js.map
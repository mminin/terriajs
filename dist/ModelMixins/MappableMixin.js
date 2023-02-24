var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { computed, runInAction } from "mobx";
import Rectangle from "terriajs-cesium/Source/Core/Rectangle";
import AsyncLoader from "../Core/AsyncLoader";
import Result from "../Core/Result";
import CatalogMemberMixin, { getName } from "./CatalogMemberMixin";
// This discriminator only discriminates between ImageryParts and DataSource
export var ImageryParts;
(function (ImageryParts) {
    function is(object) {
        return "imageryProvider" in object;
    }
    ImageryParts.is = is;
})(ImageryParts || (ImageryParts = {}));
export function isPrimitive(mapItem) {
    return "isDestroyed" in mapItem;
}
export function isCesium3DTileset(mapItem) {
    return "allTilesLoaded" in mapItem;
}
export function isTerrainProvider(mapItem) {
    return "hasVertexNormals" in mapItem;
}
export function isDataSource(object) {
    return "entities" in object;
}
function MappableMixin(Base) {
    class MappableMixin extends Base {
        constructor() {
            super(...arguments);
            this.initialMessageShown = false;
            this._mapItemsLoader = new AsyncLoader(this.forceLoadMapItems.bind(this));
        }
        get isMappable() {
            return true;
        }
        get cesiumRectangle() {
            if (this.rectangle !== undefined &&
                this.rectangle.east !== undefined &&
                this.rectangle.west !== undefined &&
                this.rectangle.north !== undefined &&
                this.rectangle.south !== undefined) {
                return Rectangle.fromDegrees(this.rectangle.west, this.rectangle.south, this.rectangle.east, this.rectangle.north);
            }
            return undefined;
        }
        get shouldShowInitialMessage() {
            if (this.initialMessage !== undefined) {
                const hasTitle = this.initialMessage.title !== undefined &&
                    this.initialMessage.title !== "" &&
                    this.initialMessage.title !== null;
                const hasContent = this.initialMessage.content !== undefined &&
                    this.initialMessage.content !== "" &&
                    this.initialMessage.content !== null;
                return (hasTitle || hasContent) && !this.initialMessageShown;
            }
            return false;
        }
        get loadMapItemsResult() {
            return this._mapItemsLoader.result;
        }
        /**
         * Gets a value indicating whether map items are currently loading.
         */
        get isLoadingMapItems() {
            return this._mapItemsLoader.isLoading;
        }
        /**
         * Loads the map items. It is safe to call this as often as necessary.
         * This will also call `loadMetadata()`.
         * If the map items are already loaded or already loading, it will
         * return the existing promise.
         *
         * This returns a Result object, it will contain errors if they occur - they will not be thrown.
         * To throw errors, use `(await loadMetadata()).throwIfError()`
         *
         * {@see AsyncLoader}
         */
        async loadMapItems(force) {
            try {
                runInAction(() => {
                    if (this.shouldShowInitialMessage) {
                        // Don't await the initialMessage because this causes cyclic dependency between loading
                        //  and user interaction (see https://github.com/TerriaJS/terriajs/issues/5528)
                        this.showInitialMessage();
                    }
                });
                if (CatalogMemberMixin.isMixedInto(this))
                    (await this.loadMetadata()).throwIfError();
                (await this._mapItemsLoader.load(force)).throwIfError();
            }
            catch (e) {
                return Result.error(e, {
                    message: `Failed to load \`${getName(this)}\` mapItems`,
                    importance: -1
                });
            }
            return Result.none();
        }
        showInitialMessage() {
            // This function is deliberately not a computed,
            // this.terria.notificationState.addNotificationToQueue changes state
            this.initialMessageShown = true;
            return new Promise((resolve) => {
                var _a, _b;
                this.terria.notificationState.addNotificationToQueue({
                    title: (_a = this.initialMessage.title) !== null && _a !== void 0 ? _a : i18next.t("notification.title"),
                    width: this.initialMessage.width,
                    height: this.initialMessage.height,
                    confirmText: this.initialMessage.confirmation
                        ? this.initialMessage.confirmText
                        : undefined,
                    message: (_b = this.initialMessage.content) !== null && _b !== void 0 ? _b : "",
                    key: "initialMessage:" + this.initialMessage.key,
                    confirmAction: () => resolve()
                });
            });
        }
        dispose() {
            super.dispose();
            this._mapItemsLoader.dispose();
        }
    }
    __decorate([
        computed
    ], MappableMixin.prototype, "cesiumRectangle", null);
    return MappableMixin;
}
(function (MappableMixin) {
    function isMixedInto(model) {
        return (model &&
            model.isMappable &&
            "forceLoadMapItems" in model &&
            typeof model.forceLoadMapItems === "function");
    }
    MappableMixin.isMixedInto = isMixedInto;
})(MappableMixin || (MappableMixin = {}));
export default MappableMixin;
//# sourceMappingURL=MappableMixin.js.map
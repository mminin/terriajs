var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, computed, observable, runInAction } from "mobx";
import Result from "./Result";
import TerriaError from "./TerriaError";
/**
 *
 * The AsyncLoader class provides a way to memoize (of sorts) async requests. In a `forceLoadX` function you should load from an asynchronous service, transform the data into something that can be stored in 1 or multiple observables and then set those observables.
 *
 * It works by calling `loadCallback` in `@computed loadKeepAlive`. This `@computed` will update if observables change that were used in `loadCallback()`.Because we are using a `@computed` in this way - it is **very important** that no changes to `observables` are made **before an async call**.
 *
 * A **correct** example:
 * ```ts
 * async function loadX() {
 *    const url = this.someObservableUrl
 *    const someData = await loadText(url)
 *    runInAction(() => this.someOtherObservable = someData)
 * }
 * ```
 *
 * This function will only be called *again* when `someObservableUrl` changes.
 *
 * ------------------------
 *
 * If there is any synchronous processing present it should be pulled out of forceLoadX and placed into 1 or multiple computeds.
 *
 * An **incorrect** example:
 * ```ts
 * async function loadX() {
 *    const arg = this.someObservable
 *    const someData = someSynchronousFn(arg)
 *    runInAction(() => this.someOtherObservable = someData)
 * }
 * ```
 *
 * Instead this should be in a `@computed`:
 *
 * ```ts
 * @computed
 * get newComputed {
 *    return someSynchronousFn(this.someObservable);
 * }
 * ```
 *
 * ------------------------
 *
 * **Other tips**:
 *
 * - You can not nest together `AsyncLoaders`.
 *
 * **Examples**:
 *
 * See:
 * - `MappableMixin`
 * - `CatalogMemberMixin`
 */
export default class AsyncLoader {
    constructor(
    /** {@see AsyncLoader} */
    loadCallback, disposeCallback) {
        this.loadCallback = loadCallback;
        this.disposeCallback = disposeCallback;
        this._isLoading = false;
        this._result = undefined;
        this._forceReloadCount = 0;
        this._promise = undefined;
    }
    get loadKeepAlive() {
        // We don't do much with _forceReloadCount directly, but by accessing it
        // we will cause a new load to be triggered when it changes. If it's value
        // is -1, we don't call the `loadCallback` at all, so this keepAlive'd
        // observable will no longer depend on anything, which avoids creating
        // a memory leak when this loader is no longer needed.
        if (this._forceReloadCount < 0) {
            if (this.disposeCallback) {
                return this.disposeCallback();
            }
            else {
                return Promise.resolve();
            }
        }
        return this.loadCallback();
    }
    /**
     * Gets a value indicating whether we are currently loading.
     */
    get isLoading() {
        return this._isLoading;
    }
    get result() {
        return this._result;
    }
    async load(forceReload = false) {
        if (forceReload) {
            runInAction(() => ++this._forceReloadCount);
        }
        const newPromise = this.loadKeepAlive;
        if (newPromise !== this._promise) {
            if (this._promise) {
                // TODO - cancel old promise
                //this._metadataPromise.cancel();
            }
            this._promise = newPromise;
            runInAction(() => {
                this._isLoading = true;
            });
        }
        let error;
        try {
            await newPromise;
        }
        catch (e) {
            error = TerriaError.from(e);
        }
        runInAction(() => {
            this._result = Result.none(error);
            this._isLoading = false;
        });
        return this._result;
    }
    /**
     * Disposes this loader, allowing the loaded resources to be garbage collected.
     * The loader can be resurrected and forced to load again by calling
     * `load(true)`.
     */
    dispose() {
        this._forceReloadCount = -1;
        this.load();
    }
}
__decorate([
    observable
], AsyncLoader.prototype, "_isLoading", void 0);
__decorate([
    observable
], AsyncLoader.prototype, "_result", void 0);
__decorate([
    observable
], AsyncLoader.prototype, "_forceReloadCount", void 0);
__decorate([
    computed({ keepAlive: true })
], AsyncLoader.prototype, "loadKeepAlive", null);
__decorate([
    action
], AsyncLoader.prototype, "load", null);
__decorate([
    action
], AsyncLoader.prototype, "dispose", null);
//# sourceMappingURL=AsyncLoader.js.map
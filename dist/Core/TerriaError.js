"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import i18next from "i18next";
import { observable } from "mobx";
import RequestErrorEvent from "terriajs-cesium/Source/Core/RequestErrorEvent";
import { terriaErrorNotification } from "../ReactViews/Notification/terriaErrorNotification";
import filterOutUndefined from "./filterOutUndefined";
import flatten from "./flatten";
import isDefined from "./isDefined";
function resolveI18n(i) {
    return typeof i === "string" ? i : i18next.t(i.key, i.parameters);
}
/** `TerriaErrorSeverity` can be `Error` or `Warning`.
 * Errors with severity `Error` are presented to the user. `Warning` will just be printed to console.
 */
export var TerriaErrorSeverity;
(function (TerriaErrorSeverity) {
    /** Errors which should be shown to the user. This is the default value for all errors.
     */
    TerriaErrorSeverity[TerriaErrorSeverity["Error"] = 0] = "Error";
    /** Errors which can be ignored by the user. These will be printed to console s
     * For example:
     * - Failing to load models (from share links or stories) if they are **NOT** in the workbench
     */
    TerriaErrorSeverity[TerriaErrorSeverity["Warning"] = 1] = "Warning";
})(TerriaErrorSeverity || (TerriaErrorSeverity = {}));
/** Turn TerriaErrorOverrides to TerriaErrorOptions so it can be passed to TerriaError constructor */
export function parseOverrides(overrides) {
    // If overrides is a string - we treat is as the `message` parameter
    if (typeof overrides === "string") {
        overrides = { message: overrides };
    }
    else if (typeof overrides === "number") {
        overrides = { severity: overrides };
    }
    // Remove undefined properties
    if (overrides)
        Object.keys(overrides).forEach(key => overrides[key] === undefined
            ? delete overrides[key]
            : null);
    return overrides !== null && overrides !== void 0 ? overrides : {};
}
/**
 * Represents an error that occurred in a TerriaJS module, especially an asynchronous one that cannot be raised
 * by throwing an exception because no one would be able to catch it.
 */
export default class TerriaError {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f;
        this.importance = 0;
        this._message = options.message;
        this._title = (_a = options.title) !== null && _a !== void 0 ? _a : { key: "core.terriaError.defaultTitle" };
        this.sender = options.sender;
        this._raisedToUser = (_b = options.raisedToUser) !== null && _b !== void 0 ? _b : false;
        this.overrideRaiseToUser = options.overrideRaiseToUser;
        this.importance = (_c = options.importance) !== null && _c !== void 0 ? _c : 0;
        this.showDetails = (_d = options.showDetails) !== null && _d !== void 0 ? _d : false;
        // Transform originalError to an array if needed
        this.originalError = isDefined(options.originalError)
            ? Array.isArray(options.originalError)
                ? options.originalError
                : [options.originalError]
            : [];
        this.severity = (_e = options.severity) !== null && _e !== void 0 ? _e : TerriaErrorSeverity.Error;
        this.stack = ((_f = new Error().stack) !== null && _f !== void 0 ? _f : "")
            .split("\n")
            // Filter out some less useful lines in the stack trace
            .filter(s => ["result.ts", "terriaerror.ts", "opendatasoft.apiclient.umd.js"].every(remove => !s.toLowerCase().includes(remove)))
            .join("\n");
    }
    /**
     * Convenience function to generate a TerriaError from some unknown error. It will try to extract a meaningful message from whatever object it is given.
     *
     * `overrides` can be used to add more context to the TerriaError
     *
     * If error is a `TerriaError`, and `overrides` are provided -  then `createParentError` will be used to create a tree of `TerriaErrors` (see {@link `TerriaError#createParentError}`).
     *
     * Note, you can not pass `TerriaErrorOptions` (or JSON version of `TerriaError`) as the error parameter.
     *
     * For example:
     *
     * This is  **incorrect**:
     *
     * ```
     * TerriaError.from({message: "Some message", title: "Some title"})
     * ```
     *
     * Instead you must use TerriaError constructor
     *
     * This is **correct**:
     *
     * ```
     * new TerriaError({message: "Some message", title: "Some title"})
     * ```
     */
    static from(error, overrides) {
        if (error instanceof TerriaError) {
            return isDefined(overrides) ? error.createParentError(overrides) : error;
        }
        // Try to find message/title from error object
        let message = {
            key: "core.terriaError.defaultMessage"
        };
        let title = {
            key: "core.terriaError.defaultTitle"
        };
        // Create original Error from `error` object
        let originalError;
        if (typeof error === "string") {
            message = error;
            originalError = new Error(message);
        }
        // If error is RequestErrorEvent - use networkRequestTitle and networkRequestMessage
        else if (error instanceof RequestErrorEvent) {
            title = { key: "core.terriaError.networkRequestTitle" };
            message = {
                key: "core.terriaError.networkRequestMessage"
            };
            originalError = new Error(error.toString());
        }
        else if (error instanceof Error) {
            message = error.message;
            originalError = error;
        }
        else if (typeof error === "object" && error !== null) {
            message = error.toString();
            originalError = new Error(error.toString());
        }
        return new TerriaError({
            title,
            message,
            originalError,
            ...parseOverrides(overrides)
        });
    }
    /** Combine an array of `TerriaErrors` into a single `TerriaError`.
     * `overrides` can be used to add more context to the combined `TerriaError`.
     */
    static combine(errors, overrides) {
        const filteredErrors = errors.filter(e => isDefined(e));
        if (filteredErrors.length === 0)
            return;
        // If only one error, just create parent error - this is so we don't get unnecessary levels of TerriaError created
        if (filteredErrors.length === 1) {
            return filteredErrors[0].createParentError(overrides);
        }
        // Find highest severity across errors (eg if one if `Error`, then the new TerriaError will also be `Error`)
        const severity = () => filteredErrors
            .map(error => typeof error.severity === "function"
            ? error.severity()
            : error.severity)
            .includes(TerriaErrorSeverity.Error)
            ? TerriaErrorSeverity.Error
            : TerriaErrorSeverity.Warning;
        // overrideRaiseToUser will be true if at least one error includes overrideRaiseToUser = true
        // Otherwise, it will be undefined
        let overrideRaiseToUser = filteredErrors.some(error => error.overrideRaiseToUser === true) ||
            undefined;
        // overrideRaiseToUser will be false if:
        // - NO errors includes overrideRaiseToUser = true
        // - and at least one error includes overrideRaiseToUser = false
        if (!isDefined(overrideRaiseToUser) &&
            filteredErrors.some(error => error.overrideRaiseToUser === false)) {
            overrideRaiseToUser = false;
        }
        return new TerriaError({
            // Set default title and message
            title: { key: "core.terriaError.defaultCombineTitle" },
            message: { key: "core.terriaError.defaultCombineMessage" },
            // Add original errors and overrides
            originalError: filteredErrors,
            severity,
            overrideRaiseToUser,
            ...parseOverrides(overrides)
        });
    }
    get message() {
        return resolveI18n(this._message);
    }
    /** Return error with message of highest importance in Error tree */
    get highestImportanceError() {
        return this.flatten().sort((a, b) => b.importance - a.importance)[0];
    }
    get title() {
        return resolveI18n(this._title);
    }
    /** True if `severity` is `Error` and the error hasn't been raised yet - or return this.overrideRaiseToUser if it is defined */
    get shouldRaiseToUser() {
        var _a;
        return ((_a = 
        // Return this.overrideRaiseToUser override if it is defined
        this.overrideRaiseToUser) !== null && _a !== void 0 ? _a : 
        // Otherwise, we should raise the error if it hasn't already been raised and the severity is ERROR
        (!this.raisedToUser &&
            (typeof this.severity === "function"
                ? this.severity()
                : this.severity) === TerriaErrorSeverity.Error));
    }
    /** Has any error in the error tree been raised to the user? */
    get raisedToUser() {
        return this.flatten().find(error => error._raisedToUser) ? true : false;
    }
    /** Resolve error seveirty */
    get resolvedSeverity() {
        return typeof this.severity === "function"
            ? this.severity()
            : this.severity;
    }
    /** Set raisedToUser value for **all** `TerriaErrors` in this tree. */
    set raisedToUser(r) {
        this._raisedToUser = r;
        if (this.originalError) {
            this.originalError.forEach(err => err instanceof TerriaError ? (err.raisedToUser = r) : null);
        }
    }
    /** Print error to console */
    log() {
        this.resolvedSeverity === TerriaErrorSeverity.Warning
            ? console.warn(this.toString())
            : console.error(this.toString());
    }
    /** Convert `TerriaError` to `Notification` */
    toNotification() {
        return {
            title: () => this.highestImportanceError.title,
            message: terriaErrorNotification(this),
            // Don't show TerriaError Notification if shouldRaiseToUser is false, or we have already raisedToUser
            ignore: () => !this.shouldRaiseToUser,
            // Set raisedToUser to true on dismiss
            onDismiss: () => (this.raisedToUser = true)
        };
    }
    /**
     * Create a new parent `TerriaError` from this error. This essentially "clones" the `TerriaError` and applied `overrides` on top. It will also set `originalError` so we get a nice tree of `TerriaErrors`
     */
    createParentError(overrides) {
        // Note: we don't copy over `raisedToUser` or `importance` here
        // We don't need `raisedToUser` as the getter will check all errors in the tree when called
        // We don't want `importance` copied over, as it may vary between errors in the tree - and we want to be able to find errors with highest importance when diplaying the entire error tree to the user
        return new TerriaError({
            message: this._message,
            title: this._title,
            sender: this.sender,
            originalError: this,
            severity: this.severity,
            overrideRaiseToUser: this.overrideRaiseToUser,
            ...parseOverrides(overrides)
        });
    }
    /** Depth-first flatten */
    flatten() {
        return filterOutUndefined([
            this,
            ...flatten(this.originalError
                ? this.originalError.map(error => error instanceof TerriaError ? error.flatten() : [])
                : [])
        ]);
    }
    /**
     * Returns a plain error object for this TerriaError instance.
     *
     * The `message` string for the returned plain error will include the
     * messages from all the nested `originalError`s for this instance.
     */
    toError() {
        // indentation required per nesting when stringifying nested error messages
        const indentChar = "  ";
        const buildNested = prop => (error, depth) => {
            if (!Array.isArray(error.originalError)) {
                return;
            }
            const indent = indentChar.repeat(depth);
            const nestedMessage = error.originalError
                .map(e => {
                var _a, _b;
                if (e instanceof TerriaError) {
                    // recursively build the message for nested errors
                    return `${(_a = e[prop]) === null || _a === void 0 ? void 0 : _a.split("\n").map(s => indent + s).join("\n")}\n${buildNested(prop)(e, depth + 1)}`;
                }
                else {
                    return `${(_b = e[prop]) === null || _b === void 0 ? void 0 : _b.split("\n").map(s => indent + s).join("\n")}`;
                }
            })
                .join("\n");
            return nestedMessage;
        };
        let message = this.message;
        const nestedMessage = buildNested("message")(this, 1);
        if (nestedMessage) {
            message = `${message}\nNested error:\n${nestedMessage}`;
        }
        const error = new Error(message);
        error.name = this.title;
        let stack = this.stack;
        const nestedStack = buildNested("stack")(this, 1);
        if (nestedStack) {
            stack = `${stack}\n${nestedStack}`;
        }
        error.stack = stack;
        return error;
    }
    toString() {
        // indentation required per nesting when stringifying nested error messages
        const indentChar = "  ";
        const buildNested = (error, depth) => {
            if (!Array.isArray(error.originalError)) {
                return;
            }
            const indent = indentChar.repeat(depth);
            const nestedMessage = error.originalError
                .map(e => {
                const log = `${e.message}\n${e.stack}`
                    .split("\n")
                    .map(s => indent + s)
                    .join("\n");
                if (e instanceof TerriaError) {
                    // recursively build the message for nested errors
                    return `${log}\n${buildNested(e, depth + 1)}`;
                }
                else {
                    return log;
                }
            })
                .join("\n");
            return nestedMessage;
        };
        const nestedMessage = buildNested(this, 1);
        return `${this.title}: ${this.highestImportanceError.message}\n${nestedMessage}`;
    }
}
__decorate([
    observable
], TerriaError.prototype, "showDetails", void 0);
/** Wrap up network requets error with user-friendly message */
export function networkRequestError(error) {
    // Combine network error with "networkRequestMessageDetailed" - this contains extra info about what could cause network error
    return TerriaError.combine([
        error instanceof TerriaError ? error : new TerriaError(error),
        new TerriaError({
            message: {
                key: "core.terriaError.networkRequestMessageDetailed"
            }
        })
    ], 
    // Override combined error with user-friendly title and message
    {
        title: { key: "core.terriaError.networkRequestTitle" },
        message: {
            key: "core.terriaError.networkRequestMessage"
        },
        importance: 1
    });
}
//# sourceMappingURL=TerriaError.js.map
/**
 * Returns a promise that resolves in milliseconds.
 */
export default function timeout(milliseconds) {
    return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}
//# sourceMappingURL=timeout.js.map
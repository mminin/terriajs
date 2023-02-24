/**
 * Ensures that the given `str` ends with the given `char`.
 *
 */
export default function ensureSuffix(str, char) {
    return str.endsWith(char) ? str : `${str}${char}`;
}
//# sourceMappingURL=ensureSuffix.js.map
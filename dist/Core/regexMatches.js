/**
 * Returns array of capture groups for each match
 */
export function regexMatches(regex, str) {
    const m = [];
    let matches;
    while ((matches = regex.exec(str))) {
        matches.splice(0, 1);
        m.push(matches.map(decodeURIComponent));
    }
    return m;
}
//# sourceMappingURL=regexMatches.js.map
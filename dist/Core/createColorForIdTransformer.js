import { createTransformer } from "mobx-utils";
import StandardCssColors from "../Core/StandardCssColors";
// Set of available colors
const colors = StandardCssColors.modifiedBrewer8ClassSet2;
// Keeps track of color usage counts
const usedColors = {};
/**
 * Returns a transformer for assigning least used color to an id.
 *
 * The transformer ensures that each `id` to color mapping is stable and if the
 * color is not used anymore, it is returned to the pool.
 */
function createColorForIdTransformer() {
    return createTransformer((id) => {
        const nextColor = leastUsedColor();
        useColor(nextColor);
        return nextColor;
    }, (color) => (color ? freeColor(color) : undefined));
}
function leastUsedColor() {
    // Sort colors by usage count and return the least used color.
    const sortedColors = colors
        .slice()
        .sort((a, b) => (usedColors[a] || 0) - (usedColors[b] || 0));
    return sortedColors[0];
}
function useColor(color) {
    usedColors[color] = (usedColors[color] || 0) + 1;
}
function freeColor(color) {
    const count = usedColors[color];
    if (count !== undefined) {
        if (count <= 1) {
            delete usedColors[color];
        }
        else {
            usedColors[color] = count - 1;
        }
    }
}
export default createColorForIdTransformer;
//# sourceMappingURL=createColorForIdTransformer.js.map
export class StringAttr {
    constructor(c, defaultValue) {
        this.str = c !== null && c !== void 0 ? c : defaultValue;
        this.per_feature = typeof this.str == "function" && this.str.length == 2;
    }
    get(z, f) {
        if (typeof this.str === "function") {
            return this.str(z, f);
        }
        else {
            return this.str;
        }
    }
}
export class NumberAttr {
    constructor(c, defaultValue = 1) {
        this.value = c !== null && c !== void 0 ? c : defaultValue;
        this.per_feature =
            typeof this.value == "function" && this.value.length == 2;
    }
    get(z, f) {
        if (typeof this.value == "function") {
            return this.value(z, f);
        }
        else {
            return this.value;
        }
    }
}
export class TextAttr {
    constructor(options) {
        var _a;
        this.label_props = (_a = options === null || options === void 0 ? void 0 : options.label_props) !== null && _a !== void 0 ? _a : ["name"];
        this.textTransform = options === null || options === void 0 ? void 0 : options.textTransform;
    }
    get(z, f) {
        let retval;
        let label_props;
        if (typeof this.label_props == "function") {
            label_props = this.label_props(z, f);
        }
        else {
            label_props = this.label_props;
        }
        for (let property of label_props) {
            if (f.props.hasOwnProperty(property) &&
                typeof f.props[property] === "string") {
                retval = f.props[property];
                break;
            }
        }
        let transform;
        if (typeof this.textTransform === "function") {
            transform = this.textTransform(z, f);
        }
        else {
            transform = this.textTransform;
        }
        if (retval && transform === "uppercase")
            retval = retval.toUpperCase();
        else if (retval && transform === "lowercase")
            retval = retval.toLowerCase();
        else if (retval && transform === "capitalize") {
            const wordsArray = retval.toLowerCase().split(" ");
            const capsArray = wordsArray.map((word) => {
                return word[0].toUpperCase() + word.slice(1);
            });
            retval = capsArray.join(" ");
        }
        return retval;
    }
}
export class FontAttr {
    constructor(options) {
        var _a, _b;
        if (options === null || options === void 0 ? void 0 : options.font) {
            this.font = options.font;
        }
        else {
            this.family = (_a = options === null || options === void 0 ? void 0 : options.fontFamily) !== null && _a !== void 0 ? _a : "sans-serif";
            this.size = (_b = options === null || options === void 0 ? void 0 : options.fontSize) !== null && _b !== void 0 ? _b : 12;
            this.weight = options === null || options === void 0 ? void 0 : options.fontWeight;
            this.style = options === null || options === void 0 ? void 0 : options.fontStyle;
        }
    }
    get(z, f) {
        if (this.font) {
            if (typeof this.font === "function") {
                return this.font(z, f);
            }
            else {
                return this.font;
            }
        }
        else {
            var style = "";
            if (this.style) {
                if (typeof this.style === "function") {
                    style = this.style(z, f) + " ";
                }
                else {
                    style = this.style + " ";
                }
            }
            var weight = "";
            if (this.weight) {
                if (typeof this.weight === "function") {
                    weight = this.weight(z, f) + " ";
                }
                else {
                    weight = this.weight + " ";
                }
            }
            var size;
            if (typeof this.size === "function") {
                size = this.size(z, f);
            }
            else {
                size = this.size;
            }
            var family;
            if (typeof this.family === "function") {
                family = this.family(z, f);
            }
            else {
                family = this.family;
            }
            return `${style}${weight}${size}px ${family}`;
        }
    }
}
export class ArrayAttr {
    constructor(c, defaultValue = []) {
        this.value = c !== null && c !== void 0 ? c : defaultValue;
        this.per_feature =
            typeof this.value == "function" && this.value.length == 2;
    }
    get(z, f) {
        if (typeof this.value == "function") {
            return this.value(z, f);
        }
        else {
            return this.value;
        }
    }
}

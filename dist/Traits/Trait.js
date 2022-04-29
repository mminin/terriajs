/** Decorator to set traitClass options (eg `description` of the class) */
export function traitClass(options) {
    return function (target) {
        target.description = options.description;
        target.example = options.example;
    };
}
export default class Trait {
    constructor(id, options, parent) {
        this.id = id;
        this.name = options.name;
        this.description = options.description;
        this.parent = parent;
    }
}
//# sourceMappingURL=Trait.js.map
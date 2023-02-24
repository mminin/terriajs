import { Feature } from "./tilecache";
export declare type AttrOption<T> = T | ((z: number, f?: Feature) => T);
export declare class StringAttr<T extends string = string> {
    str: AttrOption<T>;
    per_feature: boolean;
    constructor(c: AttrOption<T> | undefined, defaultValue: T);
    get(z: number, f?: Feature): T;
}
export declare class NumberAttr {
    value: AttrOption<number>;
    per_feature: boolean;
    constructor(c: AttrOption<number> | undefined, defaultValue?: number);
    get(z: number, f?: Feature): number;
}
export interface TextAttrOptions {
    label_props?: AttrOption<string[]>;
    textTransform?: AttrOption<string>;
}
export declare class TextAttr {
    label_props: AttrOption<string[]>;
    textTransform?: AttrOption<string>;
    constructor(options?: TextAttrOptions);
    get(z: number, f: Feature): string | undefined;
}
export interface FontAttrOptions {
    font?: AttrOption<string>;
    fontFamily?: AttrOption<string>;
    fontSize?: AttrOption<number>;
    fontWeight?: AttrOption<number>;
    fontStyle?: AttrOption<string>;
}
export declare class FontAttr {
    family?: AttrOption<string>;
    size?: AttrOption<number>;
    weight?: AttrOption<number>;
    style?: AttrOption<string>;
    font?: AttrOption<string>;
    constructor(options?: FontAttrOptions);
    get(z: number, f?: Feature): string;
}
export declare class ArrayAttr<T = number> {
    value: AttrOption<T[]>;
    per_feature: boolean;
    constructor(c: AttrOption<T[]>, defaultValue?: T[]);
    get(z: number, f?: Feature): T[];
}

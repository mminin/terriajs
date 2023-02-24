/// <reference types="@types/css-font-loading-module" />
export declare const Font: (name: string, url: string, weight: string) => Promise<FontFace>;
interface Sprite {
    x: number;
    y: number;
    w: number;
    h: number;
}
export declare class Sheet {
    src: string;
    canvas: HTMLCanvasElement;
    mapping: Map<string, Sprite>;
    missingBox: Sprite;
    constructor(src: string);
    load(): Promise<this>;
    get(name: string): Sprite;
}
export {};

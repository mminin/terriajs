import Point from "@mapbox/point-geometry";
import { ArrayAttr, AttrOption, FontAttr, FontAttrOptions, NumberAttr, StringAttr, TextAttr, TextAttrOptions } from "./attribute";
import { Label, Layout } from "./labeler";
import { Bbox, Feature } from "./tilecache";
import { Sheet } from "./task";
export interface PaintSymbolizer {
    before?(ctx: CanvasRenderingContext2D, z: number): void;
    draw(ctx: CanvasRenderingContext2D, geom: Point[][], z: number, feature: Feature): void;
}
export declare enum Justify {
    Left = 1,
    Center = 2,
    Right = 3
}
export declare enum TextPlacements {
    N = 1,
    NE = 2,
    E = 3,
    SE = 4,
    S = 5,
    SW = 6,
    W = 7,
    NW = 8
}
export interface DrawExtra {
    justify: Justify;
}
export interface LabelSymbolizer {
    place(layout: Layout, geom: Point[][], feature: Feature): Label[] | undefined;
}
export declare const createPattern: (width: number, height: number, fn: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void) => HTMLCanvasElement;
export declare class PolygonSymbolizer implements PaintSymbolizer {
    pattern?: CanvasImageSource;
    fill: StringAttr;
    opacity: NumberAttr;
    stroke: StringAttr;
    width: NumberAttr;
    per_feature: boolean;
    do_stroke: boolean;
    constructor(options: {
        pattern?: CanvasImageSource;
        fill?: AttrOption<string>;
        opacity?: AttrOption<number>;
        stroke?: AttrOption<string>;
        width?: AttrOption<number>;
        per_feature?: boolean;
    });
    before(ctx: CanvasRenderingContext2D, z: number): void;
    draw(ctx: CanvasRenderingContext2D, geom: Point[][], z: number, f: Feature): void;
}
export declare function arr(base: number, a: number[]): (z: number) => number;
export declare function exp(base: number, stops: number[][]): (z: number) => number;
export declare type Stop = [number, number] | [number, string] | [number, boolean];
export declare function step(output0: number | string | boolean, stops: Stop[]): (z: number) => number | string | boolean;
export declare function linear(stops: number[][]): (z: number) => number;
export declare function cubicBezier(x1: number, y1: number, x2: number, y2: number, stops: number[][]): (z: number) => number;
export declare class LineSymbolizer implements PaintSymbolizer {
    color: StringAttr;
    width: NumberAttr;
    opacity: NumberAttr;
    dash: ArrayAttr<number> | null;
    dashColor: StringAttr;
    dashWidth: NumberAttr;
    skip: boolean;
    per_feature: boolean;
    lineCap: StringAttr<CanvasLineCap>;
    lineJoin: StringAttr<CanvasLineJoin>;
    constructor(options: {
        color?: AttrOption<string>;
        width?: AttrOption<number>;
        opacity?: AttrOption<number>;
        dash?: number[];
        dashColor?: AttrOption<string>;
        dashWidth?: AttrOption<number>;
        skip?: boolean;
        per_feature?: boolean;
        lineCap?: AttrOption<CanvasLineCap>;
        lineJoin?: AttrOption<CanvasLineJoin>;
    });
    before(ctx: CanvasRenderingContext2D, z: number): void;
    draw(ctx: CanvasRenderingContext2D, geom: Point[][], z: number, f: Feature): void;
}
export interface IconSymbolizerOptions {
    name: string;
    sheet: Sheet;
}
export declare class IconSymbolizer implements LabelSymbolizer {
    name: string;
    sheet: Sheet;
    dpr: number;
    constructor(options: IconSymbolizerOptions);
    place(layout: Layout, geom: Point[][], feature: Feature): {
        anchor: Point;
        bboxes: {
            minX: number;
            minY: number;
            maxX: number;
            maxY: number;
        }[];
        draw: (ctx: CanvasRenderingContext2D) => void;
    }[];
}
export declare class CircleSymbolizer implements LabelSymbolizer, PaintSymbolizer {
    radius: NumberAttr;
    fill: StringAttr;
    stroke: StringAttr;
    width: NumberAttr;
    opacity: NumberAttr;
    constructor(options: {
        radius?: AttrOption<number>;
        fill?: AttrOption<string>;
        stroke?: AttrOption<string>;
        width?: AttrOption<number>;
        opacity?: AttrOption<number>;
    });
    draw(ctx: CanvasRenderingContext2D, geom: Point[][], z: number, f: Feature): void;
    place(layout: Layout, geom: Point[][], feature: Feature): {
        anchor: Point;
        bboxes: {
            minX: number;
            minY: number;
            maxX: number;
            maxY: number;
        }[];
        draw: (ctx: CanvasRenderingContext2D) => void;
    }[];
}
export declare class ShieldSymbolizer implements LabelSymbolizer {
    font: FontAttr;
    text: TextAttr;
    background: StringAttr;
    fill: StringAttr;
    padding: NumberAttr;
    constructor(options: {
        fill?: AttrOption<string>;
        background?: AttrOption<string>;
        padding?: AttrOption<number>;
    } & FontAttrOptions & TextAttrOptions);
    place(layout: Layout, geom: Point[][], f: Feature): {
        anchor: Point;
        bboxes: {
            minX: number;
            minY: number;
            maxX: number;
            maxY: number;
        }[];
        draw: (ctx: CanvasRenderingContext2D) => void;
    }[] | undefined;
}
export declare class FlexSymbolizer implements LabelSymbolizer {
    list: LabelSymbolizer[];
    constructor(list: LabelSymbolizer[]);
    place(layout: Layout, geom: Point[][], feature: Feature): {
        anchor: Point;
        bboxes: Bbox[];
        draw: (ctx: CanvasRenderingContext2D) => void;
    }[] | undefined;
}
export declare class GroupSymbolizer implements LabelSymbolizer {
    list: LabelSymbolizer[];
    constructor(list: LabelSymbolizer[]);
    place(layout: Layout, geom: Point[][], feature: Feature): {
        anchor: Point;
        bboxes: Bbox[];
        draw: (ctx: CanvasRenderingContext2D) => void;
    }[] | undefined;
}
export declare class CenteredSymbolizer implements LabelSymbolizer {
    symbolizer: LabelSymbolizer;
    constructor(symbolizer: LabelSymbolizer);
    place(layout: Layout, geom: Point[][], feature: Feature): {
        anchor: Point;
        bboxes: {
            minX: number;
            maxX: number;
            minY: number;
            maxY: number;
        }[];
        draw: (ctx: CanvasRenderingContext2D) => void;
    }[] | undefined;
}
export declare class Padding implements LabelSymbolizer {
    symbolizer: LabelSymbolizer;
    padding: NumberAttr;
    constructor(padding: number, symbolizer: LabelSymbolizer);
    place(layout: Layout, geom: Point[][], feature: Feature): Label[] | undefined;
}
export interface TextSymbolizerOptions extends FontAttrOptions, TextAttrOptions {
    fill?: AttrOption<string>;
    stroke?: AttrOption<string>;
    width?: AttrOption<number>;
    lineHeight?: AttrOption<number>;
    letterSpacing?: AttrOption<number>;
    maxLineChars?: AttrOption<number>;
    justify?: Justify;
}
export declare class TextSymbolizer implements LabelSymbolizer {
    font: FontAttr;
    text: TextAttr;
    fill: StringAttr;
    stroke: StringAttr;
    width: NumberAttr;
    lineHeight: NumberAttr;
    letterSpacing: NumberAttr;
    maxLineCodeUnits: NumberAttr;
    justify?: Justify;
    constructor(options: TextSymbolizerOptions);
    place(layout: Layout, geom: Point[][], feature: Feature): {
        anchor: Point;
        bboxes: {
            minX: number;
            minY: number;
            maxX: number;
            maxY: number;
        }[];
        draw: (ctx: CanvasRenderingContext2D, extra?: DrawExtra | undefined) => void;
    }[] | undefined;
}
export declare class CenteredTextSymbolizer implements LabelSymbolizer {
    centered: LabelSymbolizer;
    constructor(options: TextSymbolizerOptions);
    place(layout: Layout, geom: Point[][], feature: Feature): Label[] | undefined;
}
export interface OffsetSymbolizerValues {
    offsetX?: number;
    offsetY?: number;
    placements?: TextPlacements[];
    justify?: Justify;
}
export declare type DataDrivenOffsetSymbolizer = (zoom: number, feature: Feature) => OffsetSymbolizerValues;
export interface OffsetSymbolizerOptions {
    offsetX?: AttrOption<number>;
    offsetY?: AttrOption<number>;
    justify?: Justify;
    placements?: TextPlacements[];
    ddValues?: DataDrivenOffsetSymbolizer;
}
export declare class OffsetSymbolizer implements LabelSymbolizer {
    symbolizer: LabelSymbolizer;
    offsetX: NumberAttr;
    offsetY: NumberAttr;
    justify?: Justify;
    placements: TextPlacements[];
    ddValues: DataDrivenOffsetSymbolizer;
    constructor(symbolizer: LabelSymbolizer, options: OffsetSymbolizerOptions);
    place(layout: Layout, geom: Point[][], feature: Feature): {
        anchor: Point;
        bboxes: {
            minX: number;
            minY: number;
            maxX: number;
            maxY: number;
        }[];
        draw: (ctx: CanvasRenderingContext2D) => void;
    }[] | undefined;
    computeXAxisOffset(offsetX: number, fb: Bbox, placement: TextPlacements): number;
    computeYAxisOffset(offsetY: number, fb: Bbox, placement: TextPlacements): number;
    computeJustify(fixedJustify: Justify | undefined, placement: TextPlacements): Justify;
}
export declare class OffsetTextSymbolizer implements LabelSymbolizer {
    symbolizer: LabelSymbolizer;
    constructor(options: OffsetSymbolizerOptions & TextSymbolizerOptions);
    place(layout: Layout, geom: Point[][], feature: Feature): Label[] | undefined;
}
export declare enum LineLabelPlacement {
    Above = 1,
    Center = 2,
    Below = 3
}
export declare class LineLabelSymbolizer implements LabelSymbolizer {
    font: FontAttr;
    text: TextAttr;
    fill: StringAttr;
    stroke: StringAttr;
    width: NumberAttr;
    offset: NumberAttr;
    position: LineLabelPlacement;
    maxLabelCodeUnits: NumberAttr;
    repeatDistance: NumberAttr;
    constructor(options: {
        radius?: AttrOption<number>;
        fill?: AttrOption<string>;
        stroke?: AttrOption<string>;
        width?: AttrOption<number>;
        offset?: AttrOption<number>;
        maxLabelChars?: AttrOption<number>;
        repeatDistance?: AttrOption<number>;
        position?: LineLabelPlacement;
    } & TextAttrOptions & FontAttrOptions);
    place(layout: Layout, geom: Point[][], feature: Feature): {
        anchor: Point;
        bboxes: {
            minX: number;
            minY: number;
            maxX: number;
            maxY: number;
        }[];
        draw: (ctx: CanvasRenderingContext2D) => void;
        deduplicationKey: string;
        deduplicationDistance: number;
    }[] | undefined;
}
export declare class PolygonLabelSymbolizer implements LabelSymbolizer {
    symbolizer: LabelSymbolizer;
    constructor(options: TextSymbolizerOptions);
    place(layout: Layout, geom: Point[][], feature: Feature): {
        anchor: Point;
        bboxes: {
            minX: number;
            minY: number;
            maxX: number;
            maxY: number;
        }[];
        draw: (ctx: CanvasRenderingContext2D) => void;
    }[] | undefined;
}

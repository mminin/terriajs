import { GeomType } from "./tilecache";
import { CircleSymbolizer, LineSymbolizer, PolygonSymbolizer, } from "./symbolizer";
let xray_symbolizers = (dataSource, dataLayer, color) => {
    return [
        {
            dataSource: dataSource,
            dataLayer: dataLayer,
            symbolizer: new CircleSymbolizer({
                opacity: 0.2,
                fill: color,
                radius: 4,
            }),
            filter: (z, f) => {
                return f.geomType == GeomType.Point;
            },
        },
        {
            dataSource: dataSource,
            dataLayer: dataLayer,
            symbolizer: new LineSymbolizer({
                opacity: 0.2,
                color: color,
                width: 2,
            }),
            filter: (z, f) => {
                return f.geomType == GeomType.Line;
            },
        },
        {
            dataSource: dataSource,
            dataLayer: dataLayer,
            symbolizer: new PolygonSymbolizer({
                opacity: 0.2,
                fill: color,
                stroke: color,
                width: 1,
            }),
            filter: (z, f) => {
                return f.geomType == GeomType.Polygon;
            },
        },
    ];
};
export let xray_rules = (prepared_tilemap, xray // the highlighted layer
) => {
    var rules = [];
    for (var [dataSource, tiles] of prepared_tilemap) {
        for (var tile of tiles) {
            for (var dataLayer of tile.data.keys()) {
                if (dataSource === xray.dataSource && dataLayer === xray.dataLayer) {
                    // do nothing since the highlighted layer should go last
                }
                else {
                    rules = rules.concat(xray_symbolizers(dataSource, dataLayer, "steelblue"));
                }
            }
        }
    }
    // the highlighted layer
    rules = rules.concat(xray_symbolizers(xray.dataSource || "", xray.dataLayer, "red"));
    return rules;
};

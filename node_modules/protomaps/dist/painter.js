import Point from "@mapbox/point-geometry";
import { transformGeom } from "./view";
export function painter(ctx, z, prepared_tilemap, label_data, rules, bbox, origin, clip, debug) {
    let start = performance.now();
    ctx.save();
    ctx.miterLimit = 2;
    for (var rule of rules) {
        if (rule.minzoom && z < rule.minzoom)
            continue;
        if (rule.maxzoom && z > rule.maxzoom)
            continue;
        let prepared_tiles = prepared_tilemap.get(rule.dataSource || "");
        if (!prepared_tiles)
            continue;
        for (let prepared_tile of prepared_tiles) {
            var layer = prepared_tile.data.get(rule.dataLayer);
            if (layer === undefined)
                continue;
            if (rule.symbolizer.before)
                rule.symbolizer.before(ctx, prepared_tile.z);
            let po = prepared_tile.origin;
            let dim = prepared_tile.dim;
            let ps = prepared_tile.scale;
            ctx.save();
            // apply clipping to the tile
            // find the smallest of all the origins
            if (clip) {
                ctx.beginPath();
                let minX = Math.max(po.x - origin.x, bbox.minX - origin.x); // - 0.5;
                let minY = Math.max(po.y - origin.y, bbox.minY - origin.y); // - 0.5;
                let maxX = Math.min(po.x - origin.x + dim, bbox.maxX - origin.x); // + 0.5;
                let maxY = Math.min(po.y - origin.y + dim, bbox.maxY - origin.y); // + 0.5;
                ctx.rect(minX, minY, maxX - minX, maxY - minY);
                ctx.clip();
            }
            ctx.translate(po.x - origin.x, po.y - origin.y);
            // TODO fix seams in static mode
            // if (clip) {
            //     // small fudge factor in static mode to fix seams
            //     ctx.translate(dim / 2, dim / 2);
            //     ctx.scale(1 + 1 / dim, 1 + 1 / dim);
            //     ctx.translate(-dim / 2, -dim / 2);
            // }
            for (var feature of layer) {
                let geom = feature.geom;
                let fbox = feature.bbox;
                if (fbox.maxX * ps + po.x < bbox.minX ||
                    fbox.minX * ps + po.x > bbox.maxX ||
                    fbox.minY * ps + po.y > bbox.maxY ||
                    fbox.maxY * ps + po.y < bbox.minY) {
                    continue;
                }
                if (rule.filter && !rule.filter(prepared_tile.z, feature))
                    continue;
                if (ps != 1) {
                    geom = transformGeom(geom, ps, new Point(0, 0));
                }
                rule.symbolizer.draw(ctx, geom, prepared_tile.z, feature);
            }
            ctx.restore();
        }
    }
    if (clip) {
        ctx.beginPath();
        ctx.rect(bbox.minX - origin.x, bbox.minY - origin.y, bbox.maxX - bbox.minX, bbox.maxY - bbox.minY);
        ctx.clip();
    }
    if (label_data) {
        let matches = label_data.searchBbox(bbox, Infinity);
        for (var label of matches) {
            ctx.save();
            ctx.translate(label.anchor.x - origin.x, label.anchor.y - origin.y);
            label.draw(ctx);
            ctx.restore();
            if (debug) {
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = debug;
                ctx.fillStyle = debug;
                ctx.globalAlpha = 1;
                ctx.fillRect(label.anchor.x - origin.x - 2, label.anchor.y - origin.y - 2, 4, 4);
                for (let bbox of label.bboxes) {
                    ctx.strokeRect(bbox.minX - origin.x, bbox.minY - origin.y, bbox.maxX - bbox.minX, bbox.maxY - bbox.minY);
                }
            }
        }
    }
    ctx.restore();
    return performance.now() - start;
}

import { Rule } from "./painter";
import { PreparedTile } from "./view";
export interface XraySelection {
    dataSource?: string;
    dataLayer: string;
}
export declare let xray_rules: (prepared_tilemap: Map<string, PreparedTile[]>, xray: XraySelection) => Rule[];

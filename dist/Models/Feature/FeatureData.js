import { isJsonObject } from "../../Core/Json";
export function isTerriaFeatureData(data) {
    return (data &&
        isJsonObject(data, false) &&
        "type" in data &&
        data.type === "terriaFeatureData");
}
//# sourceMappingURL=FeatureData.js.map
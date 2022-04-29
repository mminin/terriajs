var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { action, observable, runInAction } from "mobx";
import defaultValue from "terriajs-cesium/Source/Core/defaultValue";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import isDefined from "../Core/isDefined";
import loadJson from "../Core/loadJson";
export default class RegionProvider {
    constructor(regionType, properties, corsProxy) {
        this._appliedReplacements = {
            serverReplacements: {},
            disambigServerReplacements: {},
            dataReplacements: {},
            disambigDataReplacements: {}
        };
        /**
         * Array of attributes of each region, once retrieved from the server.
         */
        this._regions = [];
        /**
         * Look-up table of attributes, for speed.
         */
        this._idIndex = {};
        /** Cache the loadRegionID promises so they are not regenerated each time until this._regions is defined. */
        this._loadRegionIDsPromises = undefined;
        /** Flag to indicate if loadRegionID has finished */
        this._loaded = false;
        this.regionType = regionType;
        this.corsProxy = corsProxy;
        this.regionProp = properties.regionProp;
        this.nameProp = properties.nameProp;
        this.description = properties.description;
        this.layerName = properties.layerName;
        this.server = properties.server;
        this.serverSubdomains = properties.serverSubdomains;
        this.serverMinZoom = defaultValue(properties.serverMinZoom, 0);
        this.serverMaxZoom = defaultValue(properties.serverMaxZoom, Infinity);
        this.serverMaxNativeZoom = defaultValue(properties.serverMaxNativeZoom, this.serverMaxZoom);
        this.bbox = properties.bbox;
        this.aliases = defaultValue(properties.aliases, [this.regionType]);
        this.serverReplacements =
            properties.serverReplacements instanceof Array
                ? properties.serverReplacements.map(function (r) {
                    return [
                        r[0],
                        r[1].toLowerCase(),
                        new RegExp(r[0].toLowerCase(), "gi")
                    ];
                })
                : [];
        this.dataReplacements =
            properties.dataReplacements instanceof Array
                ? properties.dataReplacements.map(function (r) {
                    return [
                        r[0],
                        r[1].toLowerCase(),
                        new RegExp(r[0].toLowerCase(), "gi")
                    ];
                })
                : [];
        this.disambigProp = properties.disambigProp;
        this.uniqueIdProp = defaultValue(properties.uniqueIdProp, "FID");
        this.textCodes = defaultValue(properties.textCodes, false); // yes, it's singular...
        this.regionIdsFile = properties.regionIdsFile;
        this.regionDisambigIdsFile = properties.regionDisambigIdsFile;
    }
    get regions() {
        return this._regions;
    }
    get loaded() {
        return this._loaded;
    }
    setDisambigProperties(dp) {
        this.disambigDataReplacements = dp === null || dp === void 0 ? void 0 : dp.dataReplacements;
        this.disambigServerReplacements = dp === null || dp === void 0 ? void 0 : dp.serverReplacements;
        this.disambigAliases = dp === null || dp === void 0 ? void 0 : dp.aliases;
    }
    /**
     * Given an entry from the region mapping config, load the IDs that correspond to it, and possibly the disambiguation properties.
     */
    async loadRegionIDs() {
        try {
            if (this._regions.length > 0) {
                return; // already loaded, so return insta-promise.
            }
            if (this.server === undefined) {
                // technically this may not be a problem yet, but it will be when we want to actually fetch tiles.
                throw new DeveloperError("No server for region mapping defined: " + this.regionType);
            }
            // Check for a pre-calculated promise (which may not have resolved yet), and returned that if it exists.
            if (!isDefined(this._loadRegionIDsPromises)) {
                const fetchAndProcess = async (idListFile, disambig) => {
                    if (!isDefined(idListFile)) {
                        return;
                    }
                    this.processRegionIds((await loadJson(idListFile)).values, disambig);
                };
                this._loadRegionIDsPromises = [
                    fetchAndProcess(this.regionIdsFile, false),
                    fetchAndProcess(this.regionDisambigIdsFile, true)
                ];
            }
            await Promise.all(this._loadRegionIDsPromises);
        }
        catch (e) {
            console.log(`Failed to load region IDS for ${this.regionType}`);
        }
        finally {
            runInAction(() => (this._loaded = true));
        }
    }
    /**
     * Returns the region variable of the given name, matching against the aliases provided.
     *
     * @param {string[]} varNames Array of variable names.
     * @returns {string} The name of the first column that matches any of the given aliases.
     */
    findRegionVariable(varNames) {
        return findVariableForAliases(varNames, [this.regionType, ...this.aliases]);
    }
    /**
     * If a disambiguation column is known for this provider, return a column matching its description.
     *
     * @param {string[]} varNames Array of variable names.
     * @returns {string} The name of the first column that matches any of the given disambiguation aliases.
     */
    findDisambigVariable(varNames) {
        if (!isDefined(this.disambigAliases) || this.disambigAliases.length === 0) {
            return undefined;
        }
        return findVariableForAliases(varNames, this.disambigAliases);
    }
    /**
     * Given a list of region IDs in feature ID order, apply server replacements if needed, and build the this._regions array.
     * If no propertyName is supplied, also builds this._idIndex (a lookup by attribute for performance).
     * @param {Array} values An array of string or numeric region IDs, eg. [10050, 10110, 10150, ...] or ['2060', '2061', '2062', ...]
     * @param {boolean} disambig True if processing region IDs for disambiguation
     */
    processRegionIds(values, disambig) {
        // There is also generally a `layer` and `property` property in this file, which we ignore for now.
        values.forEach((value, index) => {
            if (!isDefined(this._regions[index])) {
                this._regions[index] = {};
            }
            let valueAfterReplacement = value;
            if (typeof valueAfterReplacement === "string") {
                // we apply server-side replacements while loading. If it ever turns out we need
                // to store the un-regexed version, we should add a line here.
                valueAfterReplacement = this.applyReplacements(valueAfterReplacement.toLowerCase(), disambig ? "disambigServerReplacements" : "serverReplacements");
            }
            // If disambig IDS - only set this._regions properties - not this._index properties
            if (disambig) {
                this._regions[index].disambigProp = value;
                this._regions[index].disambigPropWithServerReplacement = valueAfterReplacement;
            }
            else {
                this._regions[index].regionProp = value;
                this._regions[index].regionPropWithServerReplacement = valueAfterReplacement;
                // store a lookup by attribute, for performance.
                // This is only used for region prop (not disambig prop)
                if (isDefined(value) && isDefined(valueAfterReplacement)) {
                    // If value is different after replacement, then also add original value for _index
                    if (value !== valueAfterReplacement) {
                        this._idIndex[value] = index;
                    }
                    if (!isDefined(this._idIndex[valueAfterReplacement])) {
                        this._idIndex[valueAfterReplacement] = index;
                    }
                    else {
                        // if we have already seen this value before, store an array of values, not one value.
                        if (Array.isArray(this._idIndex[valueAfterReplacement])) {
                            this._idIndex[valueAfterReplacement].push(index);
                        }
                        else {
                            this._idIndex[valueAfterReplacement] = [
                                this._idIndex[valueAfterReplacement],
                                index
                            ];
                        }
                    }
                    // Here we make a big assumption that every region has a unique identifier (probably called FID), that it counts from zero,
                    // and that regions are provided in sorted order from FID 0. We do this to avoid having to explicitly request
                    // the FID column, which would double the amount of traffic per region dataset.
                    // It is needed to simplify reverse lookups from complex matches (regexes and disambigs)
                    this._regions[index].fid = index;
                }
            }
        });
    }
    /**
     * Apply an array of regular expression replacements to a string. Also caches the applied replacements in regionProvider._appliedReplacements.
     * @param {String} s The string.
     * @param {String} replacementsProp Name of a property containing [ [ regex, replacement], ... ], where replacement is a string which can contain '$1' etc.
     */
    applyReplacements(s, replacementsProp) {
        let r;
        if (typeof s === "number") {
            r = String(s);
        }
        else {
            r = s.toLowerCase().trim();
        }
        let replacements = this[replacementsProp];
        if (replacements === undefined || replacements.length === 0) {
            return r;
        }
        if (this._appliedReplacements[replacementsProp][r] !== undefined) {
            return this._appliedReplacements[replacementsProp][r];
        }
        replacements.forEach(function (rep) {
            r = r.replace(rep[2], rep[1]);
        });
        this._appliedReplacements[replacementsProp][s] = r;
        return r;
    }
    /**
     * Given a region code, try to find a region that matches it, using replacements, disambiguation, indexes and other wizardry.
     * @param {string | number} code Code to search for. Falsy codes return -1.
     * @param {string | number | undefined} disambigCode Code to use if disambiguation is necessary
     * @returns {Number} Zero-based index in list of regions if successful, or -1.
     */
    findRegionIndex(code, disambigCode) {
        var _a;
        if (!isDefined(code) || code === "") {
            // Note a code of 0 is ok
            return -1;
        }
        const codeAfterReplacement = this.applyReplacements(code, "dataReplacements");
        let id = this._idIndex[code];
        let idAfterReplacement = this._idIndex[codeAfterReplacement];
        if (!isDefined(id) && !isDefined(idAfterReplacement)) {
            return -1;
        }
        if (typeof id === "number") {
            // found an unambiguous match (without replacement)
            return id;
        }
        else if (typeof idAfterReplacement === "number") {
            // found an unambiguous match (with replacement)
            return idAfterReplacement;
        }
        else {
            const ids = id !== null && id !== void 0 ? id : idAfterReplacement; // found an ambiguous match
            if (!isDefined(disambigCode)) {
                // we have an ambiguous value, but nothing with which to disambiguate. We pick the first, warn.
                console.warn((_a = "Ambiguous value found in region mapping: " + codeAfterReplacement) !== null && _a !== void 0 ? _a : code);
                return ids[0];
            }
            if (this.disambigProp) {
                const processedDisambigCode = this.applyReplacements(disambigCode, "disambigDataReplacements");
                // Check out each of the matching IDs to see if the disambiguation field matches the one we have.
                for (let i = 0; i < ids.length; i++) {
                    if (this._regions[ids[i]].disambigProp === processedDisambigCode ||
                        this._regions[ids[i]].disambigPropWithServerReplacement ===
                            processedDisambigCode) {
                        return ids[i];
                    }
                }
            }
        }
        return -1;
    }
}
__decorate([
    observable
], RegionProvider.prototype, "_loaded", void 0);
__decorate([
    action
], RegionProvider.prototype, "loadRegionIDs", null);
function findVariableForAliases(varNames, aliases) {
    for (let j = 0; j < aliases.length; j++) {
        const re = new RegExp("^" + aliases[j] + "$", "i");
        for (let i = 0; i < varNames.length; i++) {
            if (re.test(varNames[i])) {
                return varNames[i];
            }
        }
    }
    return undefined;
}
//# sourceMappingURL=RegionProvider.js.map
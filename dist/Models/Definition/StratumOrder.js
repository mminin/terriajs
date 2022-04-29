import { ObservableMap } from "mobx";
import DeveloperError from "terriajs-cesium/Source/Core/DeveloperError";
import CommonStrata from "./CommonStrata";
const million = 1000000;
/**
 * Defines the relative ordering of strata.
 */
export default class StratumOrder {
    constructor() {
        /**
         * The priorities of each named stratum. Stata with higher priority values are "above" and override
         * strata with lower priority values.
         */
        this.priorities = new ObservableMap();
        /**
         * The next priority to assign to a default stratum.
         */
        this.nextDefault = 1 * million;
        /**
         * The next priority to assign to a load stratum.
         */
        this.nextLoad = 2 * million;
        /**
         * The next priority to assign to a definition stratum.
         */
        this.nextDefinition = 3 * million;
        /**
         * The next priority to assign to a user stratum.
         */
        this.nextUser = 4 * million;
        this.addDefaultStratum(CommonStrata.defaults);
        this.addDefinitionStratum(CommonStrata.underride);
        this.addDefinitionStratum(CommonStrata.definition);
        this.addDefinitionStratum(CommonStrata.override);
        this.addUserStratum(CommonStrata.user);
    }
    /**
     * Assigns a priority to a default stratum. If the stratum already has a priority, this function does nothing.
     * @param id The ID of the stratum.
     */
    addDefaultStratum(id) {
        if (this.priorities.get(id) === undefined) {
            this.priorities.set(id, this.nextDefault);
            this.nextDefault += 10;
        }
    }
    /**
     * Assigns a priority to a load stratum. If the stratum already has a priority, this function does nothing.
     * @param id The ID of the stratum.
     */
    addLoadStratum(id) {
        if (this.priorities.get(id) === undefined) {
            this.priorities.set(id, this.nextLoad);
            this.nextLoad += 10;
        }
    }
    /**
     * Assigns a priority to a definition stratum. If the stratum already has a priority, this function does nothing.
     * @param id The ID of the stratum.
     */
    addDefinitionStratum(id) {
        if (this.priorities.get(id) === undefined) {
            this.priorities.set(id, this.nextDefinition);
            this.nextDefinition += 10;
        }
    }
    /**
     * Assigns a priority to a user stratum. If the stratum already has a priority, this function does nothing.
     * @param id The ID of the stratum.
     */
    addUserStratum(id) {
        if (this.priorities.get(id) === undefined) {
            this.priorities.set(id, this.nextUser);
            this.nextUser += 10;
        }
    }
    /**
     * Sorts the given strata in top-to-bottom order so that strata with a higher priority value occur
     * earlier in the returned array.
     * @param strata The strata to sort.
     * @returns The strata sorted top-to-bottom.
     */
    sortTopToBottom(strata) {
        return this.sort(strata, (a, b) => {
            const aId = a[0];
            const bId = b[0];
            if (aId === "top" && bId === "bottom") {
                return -1;
            }
            else if (aId === "bottom" && bId === "top") {
                return 1;
            }
            const aPriority = this.priorities.get(aId);
            if (aPriority === undefined) {
                throw new DeveloperError(`Stratum ${aId} does not exist in StratumOrder.`);
            }
            const bPriority = this.priorities.get(bId);
            if (bPriority === undefined) {
                throw new DeveloperError(`Stratum ${bId} does not exist in StratumOrder.`);
            }
            return bPriority - aPriority;
        });
    }
    /**
     * Sorts the given strata in top-to-bottom order so that strata with a higher priority value occur
     * later in the returned array.
     * @param strata The strata to sort.
     * @returns The strata sorted bottom-to-top.
     */
    sortBottomToTop(strata) {
        return this.sort(strata, (a, b) => {
            const aId = a[0];
            const bId = b[0];
            if (aId === "top" && bId === "bottom") {
                return 1;
            }
            else if (aId === "bottom" && bId === "top") {
                return -1;
            }
            const aPriority = this.priorities.get(aId);
            if (aPriority === undefined) {
                throw new DeveloperError(`Stratum ${aId} does not exist in StratumOrder.`);
            }
            const bPriority = this.priorities.get(bId);
            if (bPriority === undefined) {
                throw new DeveloperError(`Stratum ${bId} does not exist in StratumOrder.`);
            }
            return aPriority - bPriority;
        });
    }
    sort(strata, sortFunction) {
        return new Map(Array.from(strata.entries()).sort(sortFunction));
    }
    /**
     * Assigns a priority to a default stratum. If the stratum already has a priority, this function does nothing.
     * @param id The ID of the stratum.
     */
    static addDefaultStratum(id) {
        StratumOrder.instance.addDefaultStratum(id);
    }
    /**
     * Assigns a priority to a load stratum. If the stratum already has a priority, this function does nothing.
     * @param id The ID of the stratum.
     */
    static addLoadStratum(id) {
        StratumOrder.instance.addLoadStratum(id);
    }
    /**
     * Assigns a priority to a definition stratum. If the stratum already has a priority, this function does nothing.
     * @param id The ID of the stratum.
     */
    static addDefinitionStratum(id) {
        StratumOrder.instance.addDefinitionStratum(id);
    }
    /**
     * Assigns a priority to a user stratum. If the stratum already has a priority, this function does nothing.
     * @param id The ID of the stratum.
     */
    static addUserStratum(id) {
        StratumOrder.instance.addUserStratum(id);
    }
    /**
     * Sorts the given strata in top-to-bottom order so that strata with a higher priority value occur
     * earlier in the returned array.
     * @param strata The strata to sort.
     * @returns The strata sorted top-to-bottom.
     */
    static sortTopToBottom(strata) {
        return StratumOrder.instance.sortTopToBottom(strata);
    }
    /**
     * Sorts the given strata in top-to-bottom order so that strata with a higher priority value occur
     * later in the returned array.
     * @param strata The strata to sort.
     * @returns The strata sorted bottom-to-top.
     */
    static sortBottomToTop(strata) {
        return StratumOrder.instance.sortBottomToTop(strata);
    }
}
StratumOrder.instance = new StratumOrder();
//# sourceMappingURL=StratumOrder.js.map
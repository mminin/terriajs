import { runInAction } from "mobx";
import runLater from "../../../Core/runLater";
import CatalogMemberMixin from "../../../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../../../ModelMixins/GroupMixin";
import UrlMixin from "../../../ModelMixins/UrlMixin";
import SdmxCatalogGroupTraits from "../../../Traits/TraitsClasses/SdmxCatalogGroupTraits";
import CreateModel from "../../Definition/CreateModel";
import { SdmxServerStratum } from "./SdmxJsonServerStratum";
export default class SdmxCatalogGroup extends UrlMixin(GroupMixin(CatalogMemberMixin(CreateModel(SdmxCatalogGroupTraits)))) {
    get type() {
        return SdmxCatalogGroup.type;
    }
    async forceLoadMetadata() {
        if (!this.strata.has(SdmxServerStratum.stratumName)) {
            const stratum = await SdmxServerStratum.load(this);
            runInAction(() => {
                this.strata.set(SdmxServerStratum.stratumName, stratum);
            });
        }
    }
    async forceLoadMembers() {
        const sdmxServerStratum = (this.strata.get(SdmxServerStratum.stratumName));
        if (sdmxServerStratum) {
            await runLater(() => sdmxServerStratum.createMembers());
        }
    }
}
SdmxCatalogGroup.type = "sdmx-group";
//# sourceMappingURL=SdmxJsonCatalogGroup.js.map
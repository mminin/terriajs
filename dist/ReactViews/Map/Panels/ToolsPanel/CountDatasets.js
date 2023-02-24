"use strict";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { applyTranslationIfExists, TRANSLATE_KEY_PREFIX } from "../../../../Language/languageHelpers";
import CatalogMemberMixin from "../../../../ModelMixins/CatalogMemberMixin";
import GroupMixin from "../../../../ModelMixins/GroupMixin";
import ReferenceMixin from "../../../../ModelMixins/ReferenceMixin";
import Loader from "../../../Loader";
import { useViewState } from "../../../StandardUserInterface/ViewStateContext";
import Styles from "./tools-panel.scss";
const CountDatasets = observer((props) => {
    const [btnStringOrComponent, setBtnStringOrComponent] = useState(`${TRANSLATE_KEY_PREFIX}countDatasets.btnText`);
    const { t, i18n } = useTranslation();
    const viewState = useViewState();
    const countDatasets = () => {
        const totals = {
            name: undefined,
            groups: 0,
            members: 0,
            messages: [],
            subTotals: [],
            showResults: false
        };
        function counter(group, stats, path) {
            stats.name = group.name;
            const promises = group.memberModels.map(async (model) => {
                // Not pure - updates stats object & path
                let member = model;
                if (ReferenceMixin.isMixedInto(member)) {
                    (await member.loadReference()).ignoreError();
                    if (!member.target) {
                        return;
                    }
                    member = member.target;
                }
                if (!CatalogMemberMixin.isMixedInto(member))
                    return;
                // if (member.countValue === countValue) {
                //   continue;
                // }
                // member.countValue = countValue;
                if (GroupMixin.isMixedInto(member)) {
                    const childStats = {
                        name: undefined,
                        groups: 0,
                        members: 0,
                        messages: [],
                        subTotals: []
                    };
                    path.push(member.name);
                    const loadPromise = member.loadMembers();
                    let countPromise = member.isLoading
                        ? loadPromise
                            .then((result) => result.throwIfError())
                            .then(recurseAndUpdateTotals.bind(undefined, member, stats, childStats, path.slice()))
                            .catch(reportLoadError.bind(undefined, member, stats, path.slice()))
                        : recurseAndUpdateTotals(member, stats, childStats, path);
                    path.pop();
                    return countPromise;
                }
                else {
                    ++stats.members;
                }
            });
            return Promise.all(promises).then(() => { });
        }
        function recurseAndUpdateTotals(member, stats, childStats, path) {
            const promise = counter(member, childStats, path).then(function () {
                stats.groups += childStats.groups + 1;
                stats.members += childStats.members;
                stats.messages.push.apply(stats.messages, childStats.messages);
                stats.subTotals.push(childStats);
            });
            return promise;
        }
        function reportLoadError(member, stats, path) {
            stats.messages.push(path.join(" -> ") + t("countDatasets.loadError"));
        }
        setBtnStringOrComponent(React.createElement(Loader, { message: t("countDatasets.countingMessage") }));
        // ++countValue;
        const root = viewState.terria.catalog.group;
        counter(root, totals, []).then(function () {
            let info = t("countDatasets.totals", {
                items: totals.members,
                groups: totals.groups
            });
            props.updateResults(info);
            let i;
            const subTotals = totals.subTotals;
            for (i = 0; i < subTotals.length; ++i) {
                info += t("countDatasets.subTotals", {
                    name: subTotals[i].name,
                    items: subTotals[i].members,
                    groups: subTotals[i].groups
                });
            }
            info += "<div>&nbsp;</div>";
            const messages = totals.messages;
            for (i = 0; i < messages.length; ++i) {
                info += "<div>" + messages[i] + "</div>";
            }
            setBtnStringOrComponent(`${TRANSLATE_KEY_PREFIX}countDatasets.recount`);
            props.updateResults(info);
        });
    };
    return (React.createElement("form", null,
        t("countDatasets.title"),
        React.createElement("button", { className: Styles.submit, onClick: countDatasets, type: "button", value: t("countDatasets.btnCount") }, typeof btnStringOrComponent === "string"
            ? applyTranslationIfExists(btnStringOrComponent, i18n)
            : btnStringOrComponent)));
});
export default CountDatasets;
//# sourceMappingURL=CountDatasets.js.map
import createReactClass from "create-react-class";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";
import React from "react";
import { withTranslation } from "react-i18next";
import getPath from "../../Core/getPath";
import BadgeBar from "../BadgeBar";
import Icon from "../../Styled/Icon";
import Styles from "./workbench.scss";
import WorkbenchList from "./WorkbenchList";
import { Category, DataSourceAction } from "../../Core/AnalyticEvents/analyticEvents";
/**
 * @typedef {object} Props
 * @prop {Terria} terria
 * @prop {ViewState} viewState
 * @prop {function} t
 *
 * @extends {React.Component<Props>}
 */
const Workbench = observer(createReactClass({
    displayName: "Workbench",
    propTypes: {
        terria: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        t: PropTypes.func.isRequired
    },
    collapseAll() {
        runInAction(() => {
            this.props.terria.workbench.collapseAll();
        });
    },
    expandAll() {
        runInAction(() => {
            this.props.terria.workbench.expandAll();
        });
    },
    removeAll() {
        this.props.terria.workbench.items.forEach(item => {
            var _a;
            (_a = this.props.terria.analytics) === null || _a === void 0 ? void 0 : _a.logEvent(Category.dataSource, DataSourceAction.removeAllFromWorkbench, getPath(item));
        });
        runInAction(() => {
            this.props.terria.workbench.removeAll();
            this.props.terria.timelineStack.items.clear();
        });
    },
    render() {
        const { t } = this.props;
        const shouldExpandAll = this.props.terria.workbench.shouldExpandAll;
        return (React.createElement("div", { className: Styles.workbench },
            React.createElement(BadgeBar, { label: t("workbench.label"), badge: this.props.terria.workbench.items.length },
                React.createElement("button", { type: "button", onClick: this.removeAll, className: Styles.removeButton },
                    React.createElement(Icon, { glyph: Icon.GLYPHS.remove }),
                    " ",
                    t("workbench.removeAll")),
                shouldExpandAll ? (React.createElement("button", { type: "button", onClick: this.expandAll, className: Styles.removeButton }, t("workbench.expandAll"))) : (React.createElement("button", { type: "button", onClick: this.collapseAll, className: Styles.removeButton }, t("workbench.collapseAll")))),
            React.createElement(WorkbenchList, { viewState: this.props.viewState, terria: this.props.terria })));
    }
}));
export default withTranslation()(Workbench);
//# sourceMappingURL=Workbench.js.map
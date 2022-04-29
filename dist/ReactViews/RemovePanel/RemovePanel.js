import React from "react";
import ObserveModelMixin from "../ObserveModelMixin";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import Styles from "./remove-panel.scss";
import classNames from "classnames";
import { withTranslation } from "react-i18next";
const RemoveStoryPanel = createReactClass({
    displayName: "NotificationWindow",
    mixins: [ObserveModelMixin],
    propTypes: {
        removeText: PropTypes.string,
        onConfirm: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        confirmButtonTitle: PropTypes.string,
        cancelButtonTitle: PropTypes.string,
        t: PropTypes.func.isRequired
    },
    render() {
        const { t } = this.props;
        return (React.createElement("div", { className: Styles.outerDiv },
            React.createElement("div", { className: Styles.popup },
                React.createElement("div", { className: Styles.inner },
                    React.createElement("p", { className: Styles.title },
                        React.createElement("strong", null, this.props.removeText)),
                    React.createElement("div", { className: Styles.footer },
                        React.createElement("button", { className: classNames(Styles.btn, Styles.delete), onClick: this.props.onConfirm, type: "button" }, this.props.confirmButtonTitle || t("general.delete")),
                        React.createElement("button", { className: classNames(Styles.btn, Styles.cancel), onClick: this.props.onCancel, type: "button" }, this.props.cancelButtonTitle || t("general.cancel")))))));
    }
});
module.exports = withTranslation()(RemoveStoryPanel);
//# sourceMappingURL=RemovePanel.js.map
// proptypes are in mixin.
/* eslint react/prop-types:0*/
import React from "react";
import createReactClass from "create-react-class";
import MobileMenuItem from "../../Mobile/MobileMenuItem";
import BaseOuterPanel from "./BaseOuterPanel";
import InnerPanel from "./InnerPanel";
import Styles from "./panel.scss";
const MobilePanel = createReactClass({
    displayName: "MobilePanel",
    mixins: [BaseOuterPanel],
    getInitialState() {
        return {
            localIsOpen: false
        };
    },
    render() {
        return (React.createElement("div", null,
            React.createElement(MobileMenuItem, { onClick: this.openPanel, caption: this.props.btnText, icon: this.props.mobileIcon }),
            React.createElement(If, { condition: this.isOpen() },
                React.createElement("div", { className: Styles.overlay }),
                React.createElement(InnerPanel, { theme: this.props.theme, caretOffset: "15px", doNotCloseFlag: this.getDoNotCloseFlag(), onDismissed: this.onDismissed }, this.props.children))));
    }
});
export default MobilePanel;
//# sourceMappingURL=MobilePanel.js.map
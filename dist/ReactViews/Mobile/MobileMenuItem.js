import React from "react";
import Icon from "../../Styled/Icon";
import Styles from "./mobile-menu-item.scss";
export default (props) => (React.createElement("div", { className: Styles.root }, props.href ? (React.createElement("a", { href: props.href, target: "_blank", rel: "noopener noreferrer", onClick: props.onClick, className: Styles.link },
    props.caption,
    props.href !== "#" && React.createElement(Icon, { glyph: Icon.GLYPHS.externalLink }))) : (React.createElement("button", { onClick: props.onClick, className: Styles.link },
    props.icon && React.createElement(Icon, { className: Styles.icon, glyph: props.icon }),
    props.caption))));
//# sourceMappingURL=MobileMenuItem.js.map
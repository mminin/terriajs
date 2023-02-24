import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Styles from "./explorer-window.scss";
const SLIDE_DURATION = 300;
const ModalPopup = (props) => {
    const { t } = useTranslation();
    const [inTransition, setInTransition] = useState(false);
    const animationTimeout = useRef(null);
    function slideIn() {
        var _a;
        (_a = props.onStartAnimatingIn) === null || _a === void 0 ? void 0 : _a.call(props);
        setInTransition(true);
        animationTimeout.current = setTimeout(() => {
            setInTransition(false);
            setTimeout(() => {
                var _a;
                (_a = props.onDoneAnimatingIn) === null || _a === void 0 ? void 0 : _a.call(props);
            }, SLIDE_DURATION);
        });
    }
    function slideOut() {
        setInTransition(true);
        animationTimeout.current = setTimeout(() => {
            setInTransition(false);
        }, SLIDE_DURATION);
    }
    useEffect(() => {
        // Clear previous timeout
        if (animationTimeout.current !== null) {
            clearTimeout(animationTimeout.current);
            animationTimeout.current = null;
        }
        if (props.isVisible) {
            slideIn();
        }
        else {
            slideOut();
        }
    }, [props.isVisible]);
    useEffect(() => {
        const escKeyListener = (e) => {
            // Only explicitly check share modal state, move to levels/"layers of modals" logic if we need to go any deeper
            if (e.key === "Escape" && !props.viewState.shareModalIsVisible) {
                props.onClose();
            }
        };
        window.addEventListener("keydown", escKeyListener, true);
    });
    // Render explorer panel when explorer panel should be visible
    //  or when sliding out (animation)
    const renderUi = props.isVisible || inTransition;
    return renderUi ? (React.createElement("div", { className: classNames(Styles.modalWrapper, props.isTopElement ? "top-element" : ""), id: "explorer-panel-wrapper", "aria-hidden": !props.isVisible },
        React.createElement("div", { onClick: props.onClose, id: "modal-overlay", className: Styles.modalOverlay, tabIndex: -1 }),
        React.createElement("div", { id: "explorer-panel", className: classNames(Styles.explorerPanel, {
                [Styles.isMounted]: props.isVisible && !inTransition
            }), "aria-labelledby": "modalTitle", "aria-describedby": "modalDescription", role: "dialog" },
            React.createElement("button", { type: "button", onClick: props.onClose, className: Styles.btnCloseModal, title: t("addData.closeDataPanel"), "data-target": "close-modal" }, t("addData.done")),
            props.children))) : null;
};
export default ModalPopup;
//# sourceMappingURL=ModalPopup.js.map
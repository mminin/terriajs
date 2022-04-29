import i18next from "i18next";
import isDefined from "../Core/isDefined";
import loadWithXhr from "../Core/loadWithXhr";
import TerriaError from "../Core/TerriaError";
import { buildShareLink, buildShortShareLink, canShorten } from "../ReactViews/Map/Panels/SharePanel/BuildShareLink";
export default function sendFeedback(options) {
    if (!isDefined(options) || !isDefined(options.terria)) {
        throw TerriaError.from("options.terria is required.");
    }
    const terria = options.terria;
    if (!isDefined(terria.configParameters.feedbackUrl)) {
        raiseError(terria, "`terria.configParameters.feedbackUrl` is not defined");
        return;
    }
    const shareLinkPromise = options.sendShareURL
        ? canShorten(terria)
            ? buildShortShareLink(terria)
            : Promise.resolve(buildShareLink(terria))
        : Promise.resolve("Not shared");
    return shareLinkPromise
        .then(shareLink => {
        const feedbackData = {
            title: options.title,
            name: options.name,
            email: options.email,
            shareLink: shareLink,
            comment: options.comment
        };
        if (options.additionalParameters &&
            terria.serverConfig.config &&
            terria.serverConfig.config.additionalFeedbackParameters) {
            terria.serverConfig.config.additionalFeedbackParameters.forEach(({ name }) => {
                var _a;
                feedbackData[name] = (_a = options.additionalParameters) === null || _a === void 0 ? void 0 : _a[name];
            });
        }
        return loadWithXhr({
            url: terria.configParameters.feedbackUrl,
            responseType: "json",
            method: "POST",
            data: JSON.stringify(feedbackData),
            headers: {
                "Content-Type": "application/json"
            }
        });
    })
        .then(function (json) {
        if (json instanceof String) {
            json = JSON.parse(json.toString());
        }
        if (typeof json === "string") {
            json = JSON.parse(json);
        }
        if (!json || !json.result || json.result !== "SUCCESS") {
            raiseError(terria, `Failed to parse response from server: \`${JSON.stringify(json)}\``);
            return false;
        }
        else {
            terria.notificationState.addNotificationToQueue({
                title: i18next.t("models.feedback.thanksTitle"),
                message: i18next.t("models.feedback.thanksMessage", {
                    appName: terria.appName
                })
            });
            return true;
        }
    })
        .catch(function (e) {
        raiseError(terria, e);
        return false;
    });
}
function raiseError(terria, error) {
    terria.raiseErrorToUser(TerriaError.from(error, {
        title: i18next.t("models.feedback.unableToSendTitle"),
        message: i18next.t("models.feedback.unableToSendTitle")
    }));
}
//# sourceMappingURL=sendFeedback.js.map
export const getUriWithoutPath = (anyUri) => {
    if (!anyUri) {
        return undefined;
    }
    const port = anyUri.port();
    const portToConcat = port ? `:${port}` : "";
    const uriWithoutPath = `${anyUri.protocol()}://${anyUri.hostname()}${portToConcat}/`;
    return uriWithoutPath;
};
//# sourceMappingURL=uriHelpers.js.map
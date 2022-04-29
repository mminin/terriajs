/**
 * Returns a promise that resolves when the given dataSource finishes loading
 */
export default function waitForDataSourceToLoad(dataSource) {
    if (dataSource.isLoading && dataSource.loadingEvent) {
        return new Promise(resolve => {
            const removeEventListener = dataSource.loadingEvent.addEventListener(() => {
                removeEventListener();
                resolve();
            });
        });
    }
    return Promise.resolve();
}
//# sourceMappingURL=waitForDataSourceToLoad.js.map
var ModelReference;
(function (ModelReference) {
    function isRemoved(reference) {
        return reference
            ? reference.removed !== undefined
            : false;
    }
    ModelReference.isRemoved = isRemoved;
})(ModelReference || (ModelReference = {}));
export default ModelReference;
//# sourceMappingURL=ModelReference.js.map
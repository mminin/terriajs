export class BaseModel {
    constructor(uniqueId, terria, 
    /**
     * The model whose {@link ReferenceMixin} references this model.
     * This instance will also be that model's {@link ReferenceMixin#target}
     * property. If undefined, this model is not the target of a reference.
     */
    sourceReference) {
        this.uniqueId = uniqueId;
        this.terria = terria;
        this.sourceReference = sourceReference;
    }
    dispose() { }
}
//# sourceMappingURL=Model.js.map
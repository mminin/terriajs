/**
 * A custom component type, e.g. `<chart>`.
 */
export default class CustomComponent {
    /**
     * Determine if a given DOM node should be processed by this component. By
     * default, this method returns `true` if the node name matches the
     * {@link CustomComponent#name} property. If this method returns `true`,
     * {@link CustomComponent#processNode} will be called.
     *
     * @param context The context for the custom component
     * @param node The node that should possibly be processed.
     */
    shouldProcessNode(context, node) {
        return this.name === node.name;
    }
    /**
     * Registers a custom component.
     * @param component The component to register.
     */
    static register(component) {
        this._types.set(component.name, component);
    }
    /**
     * Checks if a custom component with a given name is registered.
     * @param name The name of the custom component.
     * @returns True if the custom component is registered, otherwise false.
     */
    static isRegistered(name) {
        return this._types.has(name);
    }
    /**
     * Gets the names of the registered custom components.
     */
    static get names() {
        return Array.from(this._types.keys());
    }
    /**
     * Gets the registered custom components.
     */
    static get values() {
        return Array.from(this._types.values());
    }
    /**
     * Gets all attributes of all custom components.
     */
    static get attributes() {
        return this.values.reduce((p, c) => p.concat(c.attributes), []);
    }
}
CustomComponent._types = new Map();
//# sourceMappingURL=CustomComponent.js.map
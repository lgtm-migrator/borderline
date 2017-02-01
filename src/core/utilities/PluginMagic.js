class PluginMagic {

    constructor() {
        this.internalKeys = {};
    }

    newKey() {
        let key = Symbol('ExtensionKey');
        this.internalKeys[key] = {};
        return key;
    }
}

const pluginMagic = new PluginMagic();
export default pluginMagic;

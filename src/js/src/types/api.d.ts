declare class ELGSDPlugin {
    test: Set<any>;
    on: (name: any, fn: any) => any;
    emit: (name: any, data: any) => any;
    localizationLoaded: boolean;
    set language(value: string);
    get language(): string;
    set localization(value: any);
    get localization(): any;
    get __filename(): any;
    get __dirname(): any;
    get __folderpath(): any;
    get __folderroot(): any;
    get data(): {};
    /**
    * Finds the original key of the string value
    * Note: This is used by the localization UI to find the original key (not used here)
    * @param {string} str
    * @returns {string}
    */
    localizedString(str: string): string;
    /**
   * Returns the localized string or the original string if not found
   * @param {string} str
   * @returns {string}
   */
    localize(s: any): string;
    /**
    * Searches the document tree to find elements with data-localize attributes
    * and replaces their values with the localized string
    * @returns {<void>}
    */
    localizeUI: () => () => void;
    /**
     * Fetches the specified language json file
     * @param {string} pathPrefix
     * @returns {Promise<void>}
     */
    loadLocalization(pathPrefix: string): Promise<void>;
    /**
     *
     * @param {string} path
     * @returns {Promise<any>} json
     */
    readJson(path: string): Promise<any>;
    #private;
}
declare class ELGSDApi extends ELGSDPlugin {
    port: any;
    uuid: any;
    messageType: any;
    actionInfo: any;
    websocket: any;
    appInfo: any;
    /**
     * Connect to Stream Deck
     * @param {string} port
     * @param {string} uuid
     * @param {string} messageType
     * @param {string} appInfoString
     * @param {string} actionString
     */
    connect(port: string, uuid: string, messageType: string, appInfoString: string, actionString: string): void;
    /**
     * Write to log file
     * @param {string} message
     */
    logMessage(message: string): void;
    /**
     * Send JSON payload to StreamDeck
     * @param {string} context
     * @param {string} event
     * @param {object} [payload]
     */
    send(context: string, event: string, payload?: object): void;
    /**
     * Save the plugin's persistent data
     * @param {object} payload
     */
    setGlobalSettings(payload: object): void;
    /**
     * Request the plugin's persistent data. StreamDeck does not return the data, but trigger the plugin/property inspectors didReceiveGlobalSettings event
     */
    getGlobalSettings(): void;
    /**
     * Opens a URL in the default web browser
     * @param {string} url
     */
    openUrl(url: string): void;
    /**
     * Registers a callback function for when Stream Deck is connected
     * @param {function} fn
     * @returns ELGSDStreamDeck
     */
    onConnected(fn: Function): this;
    /**
     * Registers a callback function for the didReceiveGlobalSettings event, which fires when calling getGlobalSettings
     * @param {function} fn
     */
    onDidReceiveGlobalSettings(fn: Function): this;
    /**
     * Registers a callback function for the didReceiveSettings event, which fires when calling getSettings
     * @param {string} action
     * @param {function} fn
     */
    onDidReceiveSettings(action: string, fn: Function): this;
    #private;
}

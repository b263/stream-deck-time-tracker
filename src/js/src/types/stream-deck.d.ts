declare function connectElgatoStreamDeckSocket(port: string, uuid: string, messageType: string, appInfoString: string, actionInfo: string): void;
/**
 * connectElgatoStreamDeckSocket
 * This is the first function StreamDeck Software calls, when
 * establishing the connection to the plugin or the Property Inspector
 * @param {string} port - The socket's port to communicate with StreamDeck software.
 * @param {string} uuid - A unique identifier, which StreamDeck uses to communicate with the plugin
 * @param {string} messageType - Identifies, if the event is meant for the property inspector or the plugin.
 * @param {string} appInfoString - Information about the host (StreamDeck) application
 * @param {string} actionInfo - Context is an internal identifier used to communicate to the host application.
 */
declare function connectElgatoStreamDeckSocket(port: string, uuid: string, messageType: string, appInfoString: string, actionInfo: string): void;
declare var $localizedStrings: {};
/**
 * @class StreamDeck
 * StreamDeck object containing all required code to establish
 * communication with SD-Software and the Property Inspector
 */
declare class ELGSDStreamDeck extends ELGSDApi {
    /**
     * Display alert triangle on actions key
     * @param {string} context
     */
    showAlert(context: string): void;
    /**
     * Display ok check mark on actions key
     * @param {string} context
     */
    showOk(context: string): void;
    /**
     * Save the actions's persistent data.
     * @param context
     * @param {object} payload
     */
    setSettings(context: any, payload: object): void;
    /**
     * Request the actions's persistent data. StreamDeck does not return the data, but trigger the actions's didReceiveSettings event
     * @param {string} [context]
     */
    getSettings(context?: string): void;
    /**
     * Set the state of the actions
     * @param {string} context
     * @param {number} [state]
     */
    setState(context: string, state?: number): void;
    /**
     * Set the title of the action's key
     * @param {string} context
     * @param {string} title
     * @param [target]
     */
    setTitle(context: string, title?: string, target?: number): void;
    /**
     *
     * @param {string} context
     * @param {number} [target]
     */
    clearTitle(context: string, target?: number): void;
    /**
     * Send payload to property inspector
     * @param {string} context
     * @param {object} payload
     * @param {string} [action]
     */
    sendToPropertyInspector(context: string, payload?: object, action?: string): void;
    /**
     * Set the actions key image
     * @param {string} context
     * @param {string} [image]
     * @param {number} [state]
     * @param {number} [target]
     */
    setImage(context: string, image?: string, state?: number, target?: number): void;
    /**
     * Set the properties of the layout on the Stream Deck + touch display
     * @param {*} context
     * @param {*} payload
     */
    setFeedback(context: any, payload: any): void;
    /**
     * Set the active layout by ID or path for the Stream Deck + touch display
     * @param {*} context
     * @param {*} layout
     */
    setFeedbackLayout(context: any, layout: any): void;
    /**
     * Registers a callback function for the deviceDidConnect event, which fires when a device is plugged in
     * @param {function} fn
     * @returns ELGSDStreamDeck
     */
    onDeviceDidConnect(fn: Function): this;
    /**
     * Registers a callback function for the deviceDidDisconnect event, which fires when a device is unplugged
     * @param {function} fn
     * @returns ELGSDStreamDeck
     */
    onDeviceDidDisconnect(fn: Function): this;
    /**
     * Registers a callback function for the applicationDidLaunch event, which fires when the application starts
     * @param {function} fn
     * @returns ELGSDStreamDeck
     */
    onApplicationDidLaunch(fn: Function): this;
    /**
     * Registers a callback function for the applicationDidTerminate event, which fires when the application exits
     * @param {function} fn
     * @returns ELGSDStreamDeck
     */
    onApplicationDidTerminate(fn: Function): this;
    /**
     * Registers a callback function for the systemDidWakeUp event, which fires when the computer wakes
     * @param {function} fn
     * @returns ELGSDStreamDeck
     */
    onSystemDidWakeUp(fn: Function): this;
    /**
     * Switches to a readonly profile or returns to previous profile
     * @param {string} device
     * @param {string} [profile]
     */
    switchToProfile(device: string, profile?: string): void;
}
declare const $SD: ELGSDStreamDeck;

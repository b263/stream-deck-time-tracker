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
declare function connectElgatoStreamDeckSocket(port: string, uuid: string, messageType: string, appInfoString: string, actionInfo: string): void;
declare class ELGSDPropertyInspector extends ELGSDApi {
    /**
     * Registers a callback function for when Stream Deck sends data to the property inspector
     * @param {string} actionUUID
     * @param {function} fn
     * @returns ELGSDStreamDeck
     */
    onSendToPropertyInspector(actionUUID: string, fn: Function): this;
    /**
     * Send payload from the property inspector to the plugin
     * @param {object} payload
     */
    sendToPlugin(payload: object): void;
    /**
     * Save the actions's persistent data.
     * @param {object} payload
     */
    setSettings(payload: object): void;
    /**
     * Request the actions's persistent data. StreamDeck does not return the data, but trigger the actions's didReceiveSettings event
     */
    getSettings(): void;
}
declare const $PI: ELGSDPropertyInspector;

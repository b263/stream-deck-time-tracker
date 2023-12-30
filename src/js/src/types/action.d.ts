/**
 * @class Action
 * A Stream Deck plugin action, where you can register callback functions for different events
 */
declare class ELGSDAction {
    constructor(UUID: any);
    UUID: any;
    on: (name: any, fn: any) => any;
    emit: (name: any, data: any) => any;
    /**
     * Registers a callback function for the didReceiveSettings event, which fires when calling getSettings
     * @param {function} fn
     */
    onDidReceiveSettings(fn: Function): this;
    /**
     * Registers a callback function for the keyDown event, which fires when pressing a key down
     * @param {function} fn
     */
    onKeyDown(fn: Function): this;
    /**
     * Registers a callback function for the keyUp event, which fires when releasing a key
     * @param {function} fn
     */
    onKeyUp(fn: Function): this;
    /**
     * Registers a callback function for the willAppear event, which fires when an action appears on the canvas
     * @param {function} fn
     */
    onWillAppear(fn: Function): this;
    /**
     * Registers a callback function for the willAppear event, which fires when an action disappears on the canvas
     * @param {function} fn
     */
    onWillDisappear(fn: Function): this;
    /**
     * Registers a callback function for the titleParametersDidChange event, which fires when a user changes the key title
     * @param {function} fn
     */
    onTitleParametersDidChange(fn: Function): this;
    /**
     * Registers a callback function for the propertyInspectorDidAppear event, which fires when the property inspector is displayed
     * @param {function} fn
     */
    onPropertyInspectorDidAppear(fn: Function): this;
    /**
     * Registers a callback function for the propertyInspectorDidDisappear event, which fires when the property inspector is closed
     * @param {function} fn
     */
    onPropertyInspectorDidDisappear(fn: Function): this;
    /**
     * Registers a callback function for the sendToPlugin event, which fires when the property inspector uses the sendToPlugin api
     * @param {function} fn
     */
    onSendToPlugin(fn: Function): this;
    /**
     * Registers a callback function for the onDialRotate event, which fires when a SD+ dial was rotated
     * @param {function} fn
     */
    onDialRotate(fn: Function): this;
    /**
     * Registers a callback function for the dialPress event, which fires when a SD+ dial was pressed or released
     * @deprecated Use onDialUp and onDialDown instead
     */
    onDialPress(fn: any): this;
    /**
     * Registers a callback function for the dialDown event, which fires when a SD+ dial was pressed
     * @param {function} fn
     */
    onDialDown(fn: Function): this;
    /**
     * Registers a callback function for the dialUp event, which fires when a pressed SD+ dial was released
     * @param {function} fn
     */
    onDialUp(fn: Function): this;
    /**
     * Registers a callback function for the touchTap event, which fires when a SD+ touch panel was touched quickly
     * @param {function} fn
     */
    onTouchTap(fn: Function): this;
}
declare const Action: typeof ELGSDAction;

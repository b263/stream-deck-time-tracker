/**
 * Errors received from WebSocket
 */
declare const SocketErrors: {
    0: string;
    1: string;
    2: string;
    3: string;
    1000: string;
    1001: string;
    1002: string;
    1003: string;
    1004: string;
    1005: string;
    1006: string;
    1007: string;
    1008: string;
    1009: string;
    1010: string;
    1011: string;
    1015: string;
};
declare namespace Events {
    let didReceiveSettings: string;
    let didReceiveGlobalSettings: string;
    let keyDown: string;
    let keyUp: string;
    let willAppear: string;
    let willDisappear: string;
    let titleParametersDidChange: string;
    let deviceDidConnect: string;
    let deviceDidDisconnect: string;
    let applicationDidLaunch: string;
    let applicationDidTerminate: string;
    let systemDidWakeUp: string;
    let propertyInspectorDidAppear: string;
    let propertyInspectorDidDisappear: string;
    let sendToPlugin: string;
    let sendToPropertyInspector: string;
    let connected: string;
    let setImage: string;
    let setXYWHImage: string;
    let setTitle: string;
    let setState: string;
    let showOk: string;
    let showAlert: string;
    let openUrl: string;
    let setGlobalSettings: string;
    let getGlobalSettings: string;
    let setSettings: string;
    let getSettings: string;
    let registerPropertyInspector: string;
    let registerPlugin: string;
    let logMessage: string;
    let switchToProfile: string;
    let dialRotate: string;
    let dialPress: string;
    let dialDown: string;
    let dialUp: string;
    let touchTap: string;
    let setFeedback: string;
    let setFeedbackLayout: string;
}
declare namespace Constants {
    let dataLocalize: string;
    let hardwareAndSoftware: number;
    let hardwareOnly: number;
    let softwareOnly: number;
}
declare namespace DestinationEnum {
    let HARDWARE_AND_SOFTWARE: number;
    let HARDWARE_ONLY: number;
    let SOFTWARE_ONLY: number;
}

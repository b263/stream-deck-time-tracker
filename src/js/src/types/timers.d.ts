declare function _setTimer(callback: any, delay: any, type: any, params: any): number;
declare function _setTimeoutESD(...args: any[]): number;
declare function _setIntervalESD(...args: any[]): number;
declare function _clearTimeoutESD(id: any): void;
/** This is our worker-code
 *  It is executed in it's own (global) scope
 *  which is wrapped above @ `let ESDTimerWorker`
 */
declare function timerFn(): void;
declare let ESDTimerWorker: Worker;
declare namespace ESDDefaultTimeouts {
    let timeout: number;
    let interval: number;
}

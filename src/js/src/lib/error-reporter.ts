import { SDConnectionInfo } from "./types";

export function registerGlobalErrorReporter(info: SDConnectionInfo) {
  window.addEventListener("error", ({ error }: ErrorEvent) => {
    const message = `Error in ${info?.appInfo?.plugin?.uuid} (${info?.appInfo?.plugin?.version}): ${error?.message}\n${error?.stack}`;
    console.log("Writing error log:", message);
    $SD.logMessage(message);
  });
}

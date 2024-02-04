import { initTrackerAction } from "./lib/action/tracker-action";
import { KimaiApi } from "./lib/api/kimai-api";
import { AppEvent, StateKey } from "./lib/constants";
import { registerGlobalErrorReporter } from "./lib/error-reporter";
import { Store } from "./lib/store/store";
import { AppState, GlobalSettings, SDConnectionInfo } from "./lib/types";

const store = new Store<AppState>();

$SD.onConnected((args: SDConnectionInfo) => {
  registerGlobalErrorReporter(args);
  $SD.getGlobalSettings();
  $SD.onDidReceiveGlobalSettings(
    (event: { payload: { settings: GlobalSettings } }) => {
      console.log("$SD.onDidReceiveGlobalSettings(event)", { event });
      const {
        payload: { settings },
      } = event;
      store.patchState({
        [StateKey.globalSettings]: settings,
      });
      // Initial settings are undefined
      if (settings?.backendProviderConfig?.["kimai"]) {
        KimaiApi.config(settings.backendProviderConfig["kimai"]);
      }
    }
  );
  // setTimeout(() => {
  //   throw new Error("test error " + new Date().toISOString());
  // }, 1000);
});

EventEmitter.on(AppEvent.actionSuccess, (context: string) =>
  $SD.showOk(context)
);

EventEmitter.on(AppEvent.actionAlert, (context: string) =>
  $SD.showAlert(context)
);

initTrackerAction(store);

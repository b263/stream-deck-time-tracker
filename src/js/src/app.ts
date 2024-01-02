import { initTrackerAction } from "./lib/action/tracker-action";
import { KimaiApi } from "./lib/api/kimai-api";
import { AppEvent, StateKey } from "./lib/constants";
import { Store } from "./lib/store/store";
import { AppState, GlobalSettings } from "./lib/types";

const store = Store.get<AppState>();

$SD.onConnected(() => {
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
      KimaiApi.config(settings.backendProviderConfig["kimai"]);
    }
  );
});

EventEmitter.on(AppEvent.actionSuccess, (context: string) =>
  $SD.showOk(context)
);

EventEmitter.on(AppEvent.actionAlert, (context: string) =>
  $SD.showAlert(context)
);

initTrackerAction();

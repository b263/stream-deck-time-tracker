import { initTrackerAction } from "./lib/action/tracker-action";
import { AppEvent, StateKey } from "./lib/constants";
import { Store } from "./lib/store/store";
import { AppState } from "./lib/types";

const store = Store.get<AppState>();

$SD.onConnected(() => {
  $SD.getGlobalSettings();
  $SD.onDidReceiveGlobalSettings((event: any) => {
    console.log("$SD.onDidReceiveGlobalSettings(event)", { event });
    const {
      payload: { settings },
    } = event;
    void store.patchState({
      [StateKey.globalSettings]: settings,
    });
  });
});

EventEmitter.on(AppEvent.actionSuccess, (context: string) =>
  $SD.showOk(context)
);

EventEmitter.on(AppEvent.actionAlert, (context: string) =>
  $SD.showAlert(context)
);

initTrackerAction();

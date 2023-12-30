import { KimaiApi } from "./lib/api/kimai-api";
import { KimaiApiTrackerConnector } from "./lib/api/kimai-api-tracker-connector";
import { BackendProvider, StateKey } from "./lib/constants";
import { Store } from "./lib/store/store";
import { Tracker } from "./lib/tracker";
import { AppState } from "./lib/types";

/**
 * GLOBAL STATE
 */

const store = new Store<AppState>();

/**
 * MAIN
 */

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

/**
 * ACTION: TIME TRACKER
 */

const trackerAction = new Action("dev.b263.time-tracker.track");

trackerAction.onDidReceiveSettings(
  ({ context, payload: { settings } }: any) => {
    if (!Tracker.has(context)) {
      return console.warn("Tracker not found", { context });
    }
    Tracker.get(context)!.settings = settings;
  }
);

trackerAction.onWillAppear(async ({ context }: any) => {
  if (!Tracker.has(context)) {
    const tracker = Tracker.create(context, false);
    const api = await getApi();
    new KimaiApiTrackerConnector(api, store).connect(tracker);
    $SD.getSettings(context);
  }
});

trackerAction.onKeyUp(({ context }: any) => {
  const tracker = Tracker.get(context)!;
  if (tracker.running) {
    tracker.stop();
  } else {
    tracker.start();
  }
});

/**
 * Utility functions
 */

async function getApi() {
  const {
    backendProviderConfig: {
      [BackendProvider.kimai]: { url, user, password },
    },
  } = await store.once(StateKey.globalSettings);
  return new KimaiApi(url, user, password);
}

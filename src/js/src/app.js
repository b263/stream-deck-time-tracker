/// <reference path="../../dev.b263.time-tracker.sdPlugin/libs/js/action.js" />
/// <reference path="../../dev.b263.time-tracker.sdPlugin/libs/js/stream-deck.js" />

import { Store } from "./lib/store/store.js";
import { StateKey, BackendProvider } from "./lib/constants.js";
import { Tracker } from "./lib/tracker.js";
import { KimaiApi } from "./lib/api/kimai-api.js";
import { KimaiApiTrackerConnector } from "./lib/api/kimai-api-tracker-connector.js";

/**
 * GLOBAL STATE
 */

const store = new Store();

/**
 * MAIN
 */

$SD.onConnected(() => {
  $SD.getGlobalSettings();
  $SD.onDidReceiveGlobalSettings(({ payload: { settings } }) =>
    store.patchState({
      [StateKey.globalSettings]: settings,
    })
  );
});

/**
 * ACTION: TIME TRACKER
 */

const trackerAction = new Action("dev.b263.time-tracker.track");

trackerAction.onWillAppear(({ context }) => {
  $SD.getSettings(context);
});

trackerAction.onDidReceiveSettings(({ context, payload: { settings } }) => {
  if (!Tracker.has(context)) {
    return console.warn("Tracker not found", { context });
  }
  Tracker.get(context).settings = settings;
});

trackerAction.onWillAppear(async ({ context }) => {
  if (!Tracker.has(context)) {
    const tracker = Tracker.create(context, false);
    const api = await getApi();
    new KimaiApiTrackerConnector(api, store).connect(tracker);
  }
});

trackerAction.onKeyUp(({ context }) => {
  const tracker = Tracker.get(context);
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

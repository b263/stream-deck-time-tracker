import { KimaiApi } from "../api/kimai-api";
import { KimaiApiTrackerConnector } from "../api/kimai-api-tracker-connector";
import { ActionKey, StateKey } from "../constants";
import { Store } from "../store/store";
import { Tracker, TrackerEvent } from "../tracker";
import { AppState } from "../types";

export function initTrackerAction() {
  const store = Store.get<AppState>();

  const trackerAction = new Action(ActionKey.track);

  trackerAction.onDidReceiveSettings(
    ({ context, payload: { settings } }: any) => {
      if (!Tracker.has(context)) {
        return console.warn("Tracker not found", { context });
      }
      const tracker = Tracker.get(context)!;
      tracker.settings = settings;
      tracker.dispatchEvent(new Event(TrackerEvent.requestWorkedToday));
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

  async function getApi() {
    const {
      backendProviderConfig: {
        ["kimai"]: { url, user, token },
      },
    } = await store.once(StateKey.globalSettings);
    return KimaiApi.config({ url, user, token }).get();
  }
}

import { KimaiApi } from "../api/kimai-api";
import { KimaiApiTrackerConnector } from "../api/kimai-api-tracker-connector";
import { BackendProvider, StateKey } from "../constants";
import { Store } from "../store/store";
import { Tracker } from "../tracker";
import { AppState } from "../types";

export function initTrackerAction() {
  const store = Store.get<AppState>();

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

  async function getApi() {
    const {
      backendProviderConfig: {
        [BackendProvider.kimai]: { url, user, password },
      },
    } = await store.once(StateKey.globalSettings);
    return new KimaiApi(url, user, password);
  }
}

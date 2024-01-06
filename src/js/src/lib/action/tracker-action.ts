import { ApiTrackerConnector } from "../api/api";
import { KimaiApi } from "../api/kimai-api";
import { KimaiApiTrackerConnector } from "../api/kimai-api-tracker-connector";
import { ActionKey, StateKey } from "../constants";
import { Store } from "../store/store";
import { Tracker } from "../tracker";
import { AppState } from "../types";

const connectors = new Map<string, ApiTrackerConnector>();

export function initTrackerAction(store: Store<AppState>) {
  const trackerAction = new Action(ActionKey.track);

  trackerAction.onDidReceiveSettings(
    ({ context, payload: { settings } }: any) => {
      if (!Tracker.has(context)) {
        return console.warn("Tracker not found", { context });
      }
      const tracker = Tracker.get(context)!;
      tracker.settings = settings;
      // When the backend provider can be changed:
      // - Disconnect the current connector from the tracker
      // - Create a new connector with the correct API
      // - Update the connectors Map
      tracker.update();
    }
  );

  trackerAction.onWillAppear(async ({ context }: any) => {
    if (!Tracker.has(context)) {
      const tracker = Tracker.create(context, false);
      const api = await getApi();
      const connector = new KimaiApiTrackerConnector(api, store).connect(
        tracker
      );
      connectors.set(context, connector);
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
    const globalSettings = await store.once(StateKey.globalSettings);
    const apiConfig =
      globalSettings?.backendProviderConfig?.["kimai"] ?? KimaiApi.emptyConfig;
    return KimaiApi.config(apiConfig).get();
  }
}

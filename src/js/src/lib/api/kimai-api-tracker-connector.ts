import { StateKey } from "../constants";
import { Store } from "../store/store";
import { Tracker, TrackerEvent, TrackerSettingsValue } from "../tracker";
import { AppState } from "../types";
import { KimaiApi } from "./kimai-api";

export class KimaiApiTrackerConnector {
  #api: KimaiApi;
  #store: Store<AppState>;

  constructor(api: KimaiApi, store: Store<AppState>) {
    this.#api = api;
    this.#store = store;
  }

  connect(tracker: Tracker) {
    tracker.addEventListener(TrackerEvent.start, async () => {
      const response = await this.#api.startTracking(this.settings(tracker)!);
      if (!response.success) {
        console.error("Could not start tracking");
        return;
      }
      this.#store.patchState({
        [StateKey.currentEvent]: response.body,
      });
    });

    tracker.addEventListener(TrackerEvent.stop, async () => {
      const event = await this.#store.once(StateKey.currentEvent);
      if (typeof event?.id === "number") {
        await this.#api.stopTracking(event?.id);
        tracker.dispatchEvent(new Event(TrackerEvent.requestWorkedToday)); // Prevent inconsistencies between local and persisted data
      } else {
        throw new Error("Cannot stop tracker. ID is undefined");
      }
      tracker.reset();
    });

    tracker.addEventListener(TrackerEvent.requestWorkedToday, async () => {
      tracker.workedToday = await this.getWorkedToday({
        projectId: this.settings(tracker)!.projectId,
        activityId: this.settings(tracker)!.activityId,
      });
      tracker.render();
    });
  }

  settings(tracker: Tracker): TrackerSettingsValue | undefined {
    return tracker.settings?.value;
  }

  async getWorkedToday({ projectId, activityId }: TrackerSettingsValue) {
    const result = await this.#api.listTodaysTimeEntries(projectId, activityId);
    if (!result.success) {
      return 0;
    }
    console.log("getWorkedToday", result, projectId, activityId);
    return result.body.reduce(
      (acc: number, item: { duration: number }) => acc + item.duration,
      0
    );
  }
}

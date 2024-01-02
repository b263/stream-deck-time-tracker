import { AppEvent, StateKey } from "../constants";
import { Store } from "../store/store";
import { Tracker, TrackerEvent } from "../tracker";
import { AppState, KimaiBackendProviderPluginConfig } from "../types";
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
        EventEmitter.emit(AppEvent.actionAlert, tracker.context);
        console.error("Could not start tracking");
        return;
      }
      EventEmitter.emit(AppEvent.actionSuccess, tracker.context);
      this.#store.patchState({
        [StateKey.currentEvent]: response.body,
      });
    });

    tracker.addEventListener(TrackerEvent.stop, async () => {
      const event = await this.#store.once(StateKey.currentEvent);
      if (typeof event?.id === "number") {
        const response = await this.#api.stopTracking(event?.id);
        if (!response.success) {
          EventEmitter.emit(AppEvent.actionAlert, tracker.context);
          console.error("Could not stop tracking");
          return;
        }
        EventEmitter.emit(AppEvent.actionSuccess, tracker.context);
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

  settings(tracker: Tracker): KimaiBackendProviderPluginConfig | undefined {
    return tracker.settings?.["kimai"];
  }

  async getWorkedToday({
    projectId,
    activityId,
  }: KimaiBackendProviderPluginConfig) {
    const result = await this.#api.listTodaysTimeEntries(projectId, activityId);
    if (!result.success) {
      return 0;
    }
    return result.body.reduce(
      (acc: number, item: { duration: number }) => acc + item.duration,
      0
    );
  }
}

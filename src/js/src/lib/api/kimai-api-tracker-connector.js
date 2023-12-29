import { TrackerEvent } from "../tracker.js";
import { StateKey } from "../constants.js";

export class KimaiApiTrackerConnector {
  #api;
  #store;

  constructor(api, store) {
    this.#api = api;
    this.#store = store;
  }

  connect(tracker) {
    tracker.addEventListener(TrackerEvent.start, async () => {
      const response = await this.#api.startTracking(this.settings(tracker));
      this.#store.patchState({
        [StateKey.currentEvent]: response,
      });
    });

    tracker.addEventListener(TrackerEvent.stop, async () => {
      const event = await this.#store.once(StateKey.currentEvent);
      await this.#api.stopTracking(event?.id);
      tracker.reset();
    });

    tracker.addEventListener(TrackerEvent.requestWorkedToday, async () => {
      tracker.workedToday = await this.getWorkedToday({
        projectId: this.settings(tracker).projectId,
        activityId: this.settings(tracker).activityId,
      });
      tracker.render();
    });
  }

  settings(tracker) {
    return tracker.settings?.value;
  }

  async getWorkedToday({ projectId, activityId }) {
    // TODO: Filter for current user
    // const { userId } = await this.#store.once(StateKey.globalSettings);
    const result = await this.#api.listTodaysTimeEntries(projectId, activityId);
    console.log("getWorkedToday", result, projectId, activityId);
    return result.reduce((acc, item) => acc + item.duration, 0);
  }
}

import { parse } from "date-fns";
import { AppEvent, StateKey } from "../constants";
import { Store } from "../store/store";
import { Tracker, TrackerEvent } from "../tracker";
import { AppState, KimaiBackendProviderPluginConfig } from "../types";
import { ApiTrackerConnector } from "./api";
import { KimaiApi, kimaiDateFormatTz } from "./kimai-api";

export class KimaiApiTrackerConnector implements ApiTrackerConnector {
  #api: KimaiApi;
  #store: Store<AppState>;
  #tracker!: Tracker;
  #bound = {
    onStart: this.onStart.bind(this),
    onStop: this.onStop.bind(this),
    onRequestWorkedToday: this.onRequestWorkedToday.bind(this),
    onCheckIfCurrentlyActive: this.onCheckIfCurrentlyActive.bind(this),
  };

  backendProvider = "kimai" as const;

  constructor(api: KimaiApi, store: Store<AppState>) {
    this.#api = api;
    this.#store = store;
  }

  async onStart() {
    const response = await this.#api.startTracking(
      this.settings(this.#tracker)!
    );
    if (!response.success) {
      EventEmitter.emit(AppEvent.actionAlert, this.#tracker.context);
      console.error("Could not start tracking");
      return;
    }
    EventEmitter.emit(AppEvent.actionSuccess, this.#tracker.context);
    this.#store.patchState({
      [StateKey.currentEvent]: response.body,
    });
  }

  async onStop() {
    const event = await this.#store.once(StateKey.currentEvent);
    if (typeof event?.id === "number") {
      const response = await this.#api.stopTracking(event?.id);
      if (!response.success) {
        EventEmitter.emit(AppEvent.actionAlert, this.#tracker.context);
        console.error("Could not stop tracking");
        return;
      }
      EventEmitter.emit(AppEvent.actionSuccess, this.#tracker.context);
      this.#tracker.update(); // Prevent inconsistencies between local and persisted data
    } else {
      throw new Error("Cannot stop tracker. ID is undefined");
    }
    this.#tracker.reset();
  }

  async onRequestWorkedToday() {
    const projectId = this.settings(this.#tracker)?.projectId;
    const activityId = this.settings(this.#tracker)?.activityId;
    if (projectId && activityId) {
      try {
        this.#tracker.workedToday = await this.getWorkedToday({
          projectId,
          activityId,
        });
        this.#tracker.render();
      } catch (e) {
        /* empty */
      }
    }
  }

  async onCheckIfCurrentlyActive() {
    console.log(
      "KimaiApiTrackerConnector.onCheckIfCurrentlyActive()",
      this.settings(this.#tracker)
    );
    const projectId = this.settings(this.#tracker)?.projectId;
    const activityId = this.settings(this.#tracker)?.activityId;
    if (this.#tracker.running) {
      throw new Error(
        "Tracker has already been started in Stream Deck. Check if there's an active event in the backend is too late."
      );
    }
    if (projectId && activityId) {
      const event = await this.#api.getCurrentlyActive(projectId, activityId);
      if (event) {
        this.#store.patchState({
          [StateKey.currentEvent]: event,
        });
        const startTime = parse(event.begin, kimaiDateFormatTz, new Date());
        this.#tracker.start(startTime);
      }
    }
  }

  connect(tracker: Tracker) {
    this.#tracker = tracker;

    tracker.addEventListener(TrackerEvent.start, this.#bound.onStart);
    tracker.addEventListener(TrackerEvent.stop, this.#bound.onStop);
    tracker.addEventListener(
      TrackerEvent.requestWorkedToday,
      this.#bound.onRequestWorkedToday
    );
    tracker.addEventListener(
      TrackerEvent.checkIfCurrentlyActive,
      this.#bound.onCheckIfCurrentlyActive
    );

    return this;
  }

  disconnect() {
    this.#tracker.removeEventListener(TrackerEvent.start, this.#bound.onStart);
    this.#tracker.removeEventListener(TrackerEvent.stop, this.#bound.onStop);
    this.#tracker.removeEventListener(
      TrackerEvent.requestWorkedToday,
      this.#bound.onRequestWorkedToday
    );
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

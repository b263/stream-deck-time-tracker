import { Icons } from "./icons.js";

export const TrackerEvent = {
  start: "start",
  stop: "stop",
  requestWorkedToday: "requestWorkedToday",
};

export class Tracker extends EventTarget {
  static instances = new Map();

  static create(context, running) {
    const tracker = new Tracker(context, running);
    Tracker.instances.set(context, tracker);
    tracker.render();
    return tracker;
  }

  static has(context) {
    return Tracker.instances.has(context);
  }

  static get(context) {
    return Tracker.instances.get(context);
  }

  static pauseOtherTrackers({ context }) {
    Tracker.instances.forEach((tracker) => {
      if (tracker.context === context) return;
      if (tracker.running === false) return;
      tracker.stop(false);
    });
  }

  constructor(context, running) {
    super();
    this.startTime = null;
    this.context = context;
    this.running = running;
    this.workedToday = null;
    this.interval = null;
  }

  #settings = {};
  set settings(settings) {
    console.log("Tracker set settings", settings);
    this.#settings = settings;
    if (this.workedToday === null) {
      this.dispatchEvent(new Event(TrackerEvent.requestWorkedToday));
    }
  }
  get settings() {
    return this.#settings;
  }

  get timeElapsed() {
    if (!this.startTime) return 0;
    return Math.floor((new Date().getTime() - this.startTime?.getTime()) / 1e3);
  }

  start() {
    this.running = true;
    this.startTime = new Date();
    this.render();
    Tracker.pauseOtherTrackers(this);
    this.dispatchEvent(new Event(TrackerEvent.requestWorkedToday));
    this.dispatchEvent(new Event(TrackerEvent.start));
    this.interval = window.setInterval(this.tick(), 6e4);
  }

  tick() {
    return () => this.render();
  }

  stop() {
    clearInterval(this.interval);
    this.running = false;
    this.workedToday += this.timeElapsed;
    this.render();
    this.dispatchEvent(new Event(TrackerEvent.stop));
  }

  reset() {
    this.startTime = null;
  }

  render() {
    console.log("Render tracking icon", this);
    if (this.running) {
      const sum = this.formatTime(this.workedToday + this.timeElapsed);
      const cur = this.formatTime(this.timeElapsed);
      $SD.setImage(this.context, this.getInlineSvg("pause", { sum, cur }));
    } else {
      $SD.setImage(
        this.context,
        this.getInlineSvg("play", {
          workedToday: this.formatTime(this.workedToday),
        })
      );
    }
  }

  getInlineSvg(key, data) {
    return `data:image/svg+xml;charset=utf8,${Icons.get(key)(data)}`;
  }

  formatTime(time) {
    const hrs = Math.floor(time / 3_600);
    let min = Math.floor(time / 60) % 60;
    if (min < 10) {
      min = `0${min}`;
    }
    return `${hrs}:${min}`;
  }
}

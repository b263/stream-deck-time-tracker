import { IconKeys, Icons } from "./icons";
import { PluginSettings } from "./types";

export const TrackerEvent = {
  start: "start",
  stop: "stop",
  requestWorkedToday: "requestWorkedToday",
} as const;

export class Tracker extends EventTarget {
  static instances = new Map<string, Tracker>();

  static create(context: string, running: boolean) {
    const tracker = new Tracker(context, running);
    Tracker.instances.set(context, tracker);
    tracker.render();
    return tracker;
  }

  static has(context: string) {
    return Tracker.instances.has(context);
  }

  static get(context: string) {
    return Tracker.instances.get(context);
  }

  static pauseOtherTrackers({ context }: Tracker) {
    Tracker.instances.forEach((tracker) => {
      if (tracker.context === context || tracker.running === false) return;
      tracker.stop();
    });
  }

  private startTime: Date | undefined;
  public readonly context: string;
  public running: boolean = false;
  public workedToday: number | undefined;
  private interval: number | undefined;

  constructor(context: string, running: boolean) {
    console.log("Tracker.constructor(context, running)", { context, running });
    super();
    this.context = context;
    this.running = running;
  }

  #settings: PluginSettings | undefined;
  public set settings(settings: PluginSettings) {
    console.log("Tracker set settings", settings);
    this.#settings = settings;
    if (typeof this.workedToday !== "number") {
      this.dispatchEvent(new Event(TrackerEvent.requestWorkedToday));
    }
  }
  public get settings(): PluginSettings | undefined {
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
    this.workedToday! += this.timeElapsed;
    this.render();
    this.dispatchEvent(new Event(TrackerEvent.stop));
  }

  reset() {
    this.startTime = undefined;
  }

  render() {
    console.log("Render tracking icon", this);
    if (this.running) {
      const sum = this.formatTime((this.workedToday ?? 0) + this.timeElapsed);
      const cur = this.formatTime(this.timeElapsed);
      $SD.setImage(this.context, this.getInlineSvg("pause", { sum, cur }));
    } else {
      $SD.setImage(
        this.context,
        this.getInlineSvg("play", {
          workedToday: this.formatTime(this.workedToday ?? 0),
        })
      );
    }
  }

  getInlineSvg(key: IconKeys, data: any) {
    return `data:image/svg+xml;charset=utf8,${Icons.get(key)!(data)}`;
  }

  formatTime(time: number) {
    const hrs = Math.floor(time / 3_600);
    let min: number | string = Math.floor(time / 60) % 60;
    if (min < 10) {
      min = `0${min}`;
    }
    return `${hrs}:${min}`;
  }
}

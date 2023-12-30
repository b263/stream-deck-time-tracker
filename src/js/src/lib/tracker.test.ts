import { Icons } from "./icons";
import { Tracker, TrackerEvent } from "./tracker";
import { jest } from "@jest/globals";

describe("Tracker", () => {
  beforeEach(() => {
    Tracker.instances.clear();
    (global as any).$SD = {
      setImage: jest.fn(),
    };
    jest
      .spyOn(Icons, "get")
      .mockImplementation((key) => (data) => `${key}:${JSON.stringify(data)}`);
  });

  describe("static create()", () => {
    test("Tracker is created", () => {
      const tracker = Tracker.create("ctx", false);
      expect(tracker).toBeInstanceOf(Tracker);
      expect(tracker.context).toBe("ctx");
      expect(tracker.running).toBeFalsy();
    });

    test("Tracker instances are added to the static Map", () => {
      Tracker.create("ctx", false);
      expect(Tracker.instances.size).toBe(1);
      expect((Tracker.instances.get("ctx") as any).context).toBe("ctx");
    });

    test("Tracker is rendering upon creation", () => {
      Tracker.create("ctx", false);
      expect((global as any).$SD.setImage).toHaveBeenCalledTimes(1);
      expect((global as any).$SD.setImage).toHaveBeenCalledWith(
        "ctx",
        'data:image/svg+xml;charset=utf8,play:{"workedToday":"0:00"}'
      );
    });

    test("Tracker is rendering as started upon creation", () => {
      Tracker.create("ctx", true);
      expect((global as any).$SD.setImage).toHaveBeenCalledTimes(1);
      expect((global as any).$SD.setImage).toHaveBeenCalledWith(
        "ctx",
        'data:image/svg+xml;charset=utf8,pause:{"sum":"0:00","cur":"0:00"}'
      );
    });
  });

  describe("static pauseOtherTrackers()", () => {
    test("Other trackers should be paused", () => {
      const a = Tracker.create("A", true);
      const b = Tracker.create("B", true);
      Tracker.pauseOtherTrackers(a);
      expect(a.running).toBeTruthy();
      expect(b.running).toBeFalsy();
    });
  });

  describe("set settings()", () => {
    test("Settings should be set", () => {
      const tracker = Tracker.create("A", false);
      tracker.settings = {
        backendProvider: "kimai",
        value: {
          projectId: 1,
          activityId: 2,
        },
      };
      expect(tracker.settings).toStrictEqual({
        backendProvider: "kimai",
        value: {
          projectId: 1,
          activityId: 2,
        },
      });
    });

    test("RequestWorkedToday event should be triggered", () => {
      const spy = jest.spyOn(Tracker.prototype, "dispatchEvent");
      const tracker = Tracker.create("ctx", false);
      tracker.settings = {
        backendProvider: "kimai",
        value: { projectId: 0, activityId: 0 },
      };
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: TrackerEvent.requestWorkedToday,
        })
      );
    });
  });

  describe("get timeElapsed()", () => {
    test("Should be 0 if startTime is not set", () => {
      const tracker = Tracker.create("A", false);
      expect(tracker.timeElapsed).toBe(0);
    });

    test("Elapsed time should be calculated correctly", () => {
      const tracker = Tracker.create("A", false);
      jest.useFakeTimers().setSystemTime(new Date(0));
      tracker.start();
      expect((tracker as any).startTime.getTime()).toBe(0);
      jest.useFakeTimers().setSystemTime(new Date(2000));
      expect(tracker.timeElapsed).toBe(2);
      clearInterval((tracker as any).interval);
    });
  });

  describe("start()", () => {
    test("Should set running to true", () => {
      jest.spyOn(Tracker, "pauseOtherTrackers");
      const tracker = Tracker.create("A", false);
      tracker.start();
      expect(tracker.running).toBeTruthy();
      clearInterval((tracker as any).interval);
    });

    test("Should set startTime", () => {
      const tracker = Tracker.create("A", false);
      jest.useFakeTimers().setSystemTime(new Date(2000));
      tracker.start();
      expect((tracker as any).startTime.getTime()).toBe(2000);
      clearInterval((tracker as any).interval);
    });

    test("Should call render()", () => {
      const tracker = Tracker.create("A", false);
      jest.spyOn(tracker, "render");
      tracker.start();
      expect(tracker.render).toHaveBeenCalled();
      clearInterval((tracker as any).interval);
    });

    test("Should pause other trackers", () => {
      jest.spyOn(Tracker, "pauseOtherTrackers");
      const tracker = Tracker.create("A", false);
      tracker.start();
      expect(Tracker.pauseOtherTrackers).toHaveBeenCalled();
      clearInterval((tracker as any).interval);
    });

    test("RequestWorkedToday event should be triggered", () => {
      const spy = jest.spyOn(Tracker.prototype, "dispatchEvent");
      const tracker = Tracker.create("ctx", false);
      tracker.start();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: TrackerEvent.requestWorkedToday,
        })
      );
      clearInterval((tracker as any).interval);
    });

    test("Start event should be triggered", () => {
      const spy = jest.spyOn(Tracker.prototype, "dispatchEvent");
      const tracker = Tracker.create("ctx", false);
      tracker.start();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: TrackerEvent.start,
        })
      );
      clearInterval((tracker as any).interval);
    });

    test("Should start the tick interval", () => {
      jest.useFakeTimers();
      jest.spyOn(window, "setInterval");
      const tracker = Tracker.create("ctx", false);
      jest.spyOn(tracker, "tick");
      tracker.start();
      expect(tracker.tick).toHaveBeenCalled();
      expect(window.setInterval).toHaveBeenCalledWith(
        expect.anything(),
        60_000
      );
      clearInterval((tracker as any).interval);
    });
  });
});

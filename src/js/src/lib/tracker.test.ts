/* eslint-disable jest/no-commented-out-tests */
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
        kimai: {
          projectId: 1,
          activityId: 2,
        },
      };
      expect(tracker.settings).toStrictEqual({
        backendProvider: "kimai",
        kimai: {
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
        kimai: { projectId: 0, activityId: 0 },
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

  describe("tick()", () => {
    test("Should call render()", () => {
      const tracker = Tracker.create("A", false);
      jest.spyOn(tracker, "render");
      tracker.tick()();
      expect(tracker.render).toHaveBeenCalled();
    });
  });

  describe("stop()", () => {
    test("Should clear the interval", () => {
      const tracker = Tracker.create("A", false);
      jest.spyOn(window, "clearInterval");
      tracker.stop();
      expect(window.clearInterval).toHaveBeenCalledWith(
        (tracker as any).interval
      );
    });

    test("Should set running to false", () => {
      const tracker = Tracker.create("A", false);
      tracker.stop();
      expect(tracker.running).toBeFalsy();
    });

    // TODO: This test breaks all the upcoming tests using clearInterval
    // test("Should add the elapsed time to workedToday", () => {
    //   jest.useFakeTimers();
    //   const tracker = Tracker.create("A", false);
    //   tracker.workedToday = 5;
    //   tracker.start();
    //   jest.setSystemTime(Date.now() + 10000);
    //   tracker.stop();
    //   expect(tracker.workedToday).toBe(15);
    //   jest.useRealTimers();
    // });

    test("Should call render()", () => {
      const tracker = Tracker.create("A", false);
      jest.spyOn(tracker, "render");
      tracker.stop();
      expect(tracker.render).toHaveBeenCalled();
    });

    test("Should dispatch a stop event", () => {
      const tracker = Tracker.create("A", false);
      const spy = jest.spyOn(tracker, "dispatchEvent");
      tracker.stop();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: TrackerEvent.stop,
        })
      );
    });
  });

  describe("reset()", () => {
    test("Should reset the startTime", () => {
      const tracker = Tracker.create("A", false);
      tracker.reset();
      expect((tracker as any).startTime).toBeUndefined();
    });
  });

  describe("update()", () => {
    test("Should dispatch requestWorkedToday event", () => {
      const tracker = Tracker.create("A", false);
      const spy = jest.spyOn(tracker, "dispatchEvent");
      tracker.update();
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: TrackerEvent.requestWorkedToday,
        })
      );
    });
  });

  describe("getInlineSvg()", () => {
    test("Should return the correct inline SVG", () => {
      const key = "play";
      const data = { workedToday: "0:00" };
      const expectedSvg = `data:image/svg+xml;charset=utf8,play:{"workedToday":"0:00"}`;
      const tracker = Tracker.create("ctx", false);
      const result = tracker.getInlineSvg(key, data);
      expect(result).toBe(expectedSvg);
    });
  });

  describe("formatTime()", () => {
    test("Should format time correctly when hours and minutes are single digits", () => {
      const tracker = Tracker.create("A", false);
      const formattedTime = tracker.formatTime(65);
      expect(formattedTime).toBe("0:01");
    });

    test("Should format time correctly when hours and minutes are double digits", () => {
      const tracker = Tracker.create("A", false);
      const formattedTime = tracker.formatTime(3_600);
      expect(formattedTime).toBe("1:00");
    });
  });
});

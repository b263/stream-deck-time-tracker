import { Icons } from "./icons";
import { Tracker, TrackerEvent } from "./tracker.js";
import jest from "jest-mock";

describe("tracker", () => {
  beforeEach(() => {
    Tracker.instances.clear();
    global.$SD = {
      setImage: jest.fn(),
    };
    jest
      .spyOn(Icons, "get")
      .mockImplementation((key) => (data) => `${key}:${JSON.stringify(data)}`);
  });

  test("Tracker is created", () => {
    const tracker = Tracker.create("ctx", false);
    expect(tracker).toBeInstanceOf(Tracker);
  });

  test("Tracker instances are added to the static Map", () => {
    Tracker.create("ctx", false);
    expect(Tracker.instances.size).toBe(1);
    expect(Tracker.instances.get("ctx").context).toBe("ctx");
  });

  test("Tracker is rendering upon creation", () => {
    Tracker.create("ctx", false);
    expect(global.$SD.setImage).toHaveBeenCalledTimes(1);
    expect(global.$SD.setImage).toHaveBeenCalledWith(
      "ctx",
      'data:image/svg+xml;charset=utf8,play:{"workedToday":"0:00"}'
    );
  });

  test("Tracker is rendering as started upon creation", () => {
    Tracker.create("ctx", true);
    expect(global.$SD.setImage).toHaveBeenCalledTimes(1);
    expect(global.$SD.setImage).toHaveBeenCalledWith(
      "ctx",
      'data:image/svg+xml;charset=utf8,pause:{"sum":"0:00","cur":"0:00"}'
    );
  });

  test("When setting settings, todays worked hours should be requested", () => {
    const spy = jest.spyOn(Tracker.prototype, "dispatchEvent");
    const tracker = Tracker.create("ctx", false);
    tracker.settings = {};
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TrackerEvent.requestWorkedToday,
      })
    );
  });
});

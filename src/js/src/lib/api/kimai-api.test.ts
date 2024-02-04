import { format } from "date-fns";
import { KimaiApi, ApiConfig, kimaiDateFormat } from "./kimai-api";
import { KimaiBackendProviderPluginConfig } from "../types";

describe("KimaiApi", () => {
  let api: KimaiApi;
  let config: ApiConfig;

  beforeEach(() => {
    KimaiApi.instance = null;
    api = KimaiApi.get();
    config = {
      url: "https://www.example.com",
      user: "user",
      token: "token",
    };
  });

  test("config() should set the config if provided", () => {
    KimaiApi.config(config);
    expect(api.config).toEqual(config);
  });

  test("config() should set the config to emptyConfig if null is provided", () => {
    KimaiApi.config(null as unknown as ApiConfig);
    expect(api.config).toEqual(KimaiApi.emptyConfig);
  });

  describe("get()", () => {
    test("should return an instance of KimaiApi", () => {
      const instance = KimaiApi.get();
      expect(instance).toBeInstanceOf(KimaiApi);
    });

    test("should always return the same instance", () => {
      const instance1 = KimaiApi.get();
      const instance2 = KimaiApi.get();
      expect(instance1).toBe(instance2);
    });

    test("should create a new instance if one does not already exist", () => {
      const instance = KimaiApi.get();
      expect(instance).toBeInstanceOf(KimaiApi);
    });
  });

  test("getCurrentUser() should fetch the current user data", async () => {
    const baseUrl = "https://www.example.com/";
    const user = "user";
    const token = "token";
    const expectedUrl = `${baseUrl}api/users/me`;
    const expectedHeaders = {
      "X-AUTH-USER": user,
      "X-AUTH-TOKEN": token,
    };
    const expectedResponse = { name: "John Doe", email: "john@example.com" };
    const mockFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(expectedResponse),
    });
    global.fetch = mockFetch;
    const result = await KimaiApi.getCurrentUser(baseUrl, user, token);
    expect(mockFetch).toHaveBeenCalledWith(expectedUrl, {
      headers: expectedHeaders,
    });
    expect(result).toEqual(expectedResponse);
  });

  test("getCurrentUser() should return null if an error occurs", async () => {
    const baseUrl = "https://www.example.com/";
    const user = "user";
    const token = "token";
    const expectedUrl = `${baseUrl}api/users/me`;
    const mockFetch = jest.fn().mockRejectedValue(new Error("Network error"));
    global.fetch = mockFetch;
    const result = await KimaiApi.getCurrentUser(baseUrl, user, token);
    expect(mockFetch).toHaveBeenCalledWith(expectedUrl, {
      headers: {
        "X-AUTH-USER": user,
        "X-AUTH-TOKEN": token,
      },
    });
    expect(result).toBeNull();
  });

  test("config setter should correctly set the config", () => {
    const config = {
      url: "https://www.example.com/",
      user: "user",
      token: "token",
    };
    api.config = config;
    expect(api.config).toEqual(config);
  });

  test("config getter should correctly get the config", () => {
    const config = {
      url: "https://www.example.com/",
      user: "user",
      token: "token",
    };
    api.config = config;
    const retrievedConfig = api.config;
    expect(retrievedConfig).toEqual(config);
  });

  test("config getter should return default values when config is not set", () => {
    const defaultConfig = { url: "", user: "", token: "" };
    expect(api.config).toEqual(defaultConfig);
  });

  test("fetchOptions should return correct headers", () => {
    const config = {
      url: "https://www.example.com/",
      user: "user",
      token: "token",
    };
    api.config = config;
    const expectedHeaders = {
      "X-AUTH-USER": config.user,
      "X-AUTH-TOKEN": config.token,
      "Content-Type": "application/json",
    };
    expect(api.fetchOptions).toEqual({ headers: expectedHeaders });
  });

  test("assertValidConfig should throw error when user is not set", () => {
    const config = {
      url: "https://www.example.com/",
      user: "",
      token: "token",
    };
    api.config = config;
    expect(() => api.assertValidConfig()).toThrow(
      "Invalid config. User must not be empty."
    );
  });

  test("assertValidConfig should throw error when baseUrl is not set", () => {
    const config = { url: "", user: "user", token: "token" };
    api.config = config;
    expect(() => api.assertValidConfig()).toThrow(
      "Invalid config. BaseUrl must not be empty."
    );
  });

  test("assertValidConfig should throw error when token is not set", () => {
    const config = { url: "https://www.example.com/", user: "user", token: "" };
    api.config = config;
    expect(() => api.assertValidConfig()).toThrow(
      "Invalid config. Token must not be empty."
    );
  });

  test("startTracking should send a POST request with correct parameters", async () => {
    const config = {
      url: "https://www.example.com/",
      user: "user",
      token: "token",
    };
    api.config = config;
    const mockFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });
    global.fetch = mockFetch;
    const trackingConfig = { projectId: 1, activityId: 2 };
    await api.startTracking(trackingConfig as KimaiBackendProviderPluginConfig);
    const expectedUrl = `${config.url}api/timesheets`;
    const expectedOptions = {
      headers: {
        "X-AUTH-USER": config.user,
        "X-AUTH-TOKEN": config.token,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        begin: format(new Date(), kimaiDateFormat),
        project: trackingConfig.projectId,
        activity: trackingConfig.activityId,
        description: "",
      }),
    };
    expect(mockFetch).toHaveBeenCalledWith(expectedUrl, expectedOptions);
  });
});

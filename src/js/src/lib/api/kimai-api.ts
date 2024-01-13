import { format, startOfToday } from "date-fns";
import { ApiResponse, Category, TrackingItem, tryFetch } from "./api";
import { KimaiBackendProviderPluginConfig } from "../types";

type ApiConfig = {
  url: string;
  user: string;
  token: string;
};

export const kimaiDateFormat = "yyyy-MM-dd'T'HH:mm:ss";
export const kimaiDateFormatTz = "yyyy-MM-dd'T'HH:mm:ssxx";

export class KimaiApi {
  static instance: KimaiApi | null = null;

  static emptyConfig = {
    url: "",
    user: "",
    token: "",
  };

  static config(c: ApiConfig) {
    KimaiApi.get().config = c ?? KimaiApi.emptyConfig;
    return KimaiApi;
  }

  static get() {
    if (!KimaiApi.instance) KimaiApi.instance = new KimaiApi();
    return KimaiApi.instance;
  }

  static async getCurrentUser(baseUrl: string, user: string, token: string) {
    const url = `${baseUrl}api/users/me`;
    try {
      const response = await fetch(url, {
        headers: {
          "X-AUTH-USER": user,
          "X-AUTH-TOKEN": token,
        },
      });
      return response.json();
    } catch (e) {
      return Promise.resolve(null);
    }
  }

  #baseUrl: string | undefined;
  #user: string | undefined;
  #token: string | undefined;

  set config({ url, user, token }: ApiConfig) {
    this.#baseUrl = url;
    this.#user = user;
    this.#token = token;
  }

  get fetchOptions() {
    return {
      headers: {
        "X-AUTH-USER": this.#user,
        "X-AUTH-TOKEN": this.#token,
        "Content-Type": "application/json",
      },
    } as RequestInit; // eslint-disable-line
  }

  assertValidConfig() {
    if (!this.#user) {
      throw new Error("Invalid config. User must not be empty.");
    }
    if (!this.#baseUrl) {
      throw new Error("Invalid config. BaseUrl must not be empty.");
    }
    if (!this.#token) {
      throw new Error("Invalid config. Token must not be empty.");
    }
  }

  async startTracking({
    projectId,
    activityId,
  }: KimaiBackendProviderPluginConfig): Promise<ApiResponse<TrackingItem>> {
    this.assertValidConfig();
    const url = `${this.#baseUrl}api/timesheets`;
    const body = {
      begin: format(new Date(), kimaiDateFormat),
      project: projectId,
      activity: activityId,
      description: "",
    };
    const options = {
      ...this.fetchOptions,
      method: "POST",
      body: JSON.stringify(body),
    };
    return tryFetch<TrackingItem>(url, options);
  }

  async stopTracking(id: number) {
    this.assertValidConfig();
    const url = `${this.#baseUrl}api/timesheets/${id}/stop`;
    const options = {
      ...this.fetchOptions,
      method: "PATCH",
    };
    return tryFetch<any>(url, options);
  }

  async getCurrentlyActive(projectId: number, activityId: number) {
    this.assertValidConfig();
    const params = new URLSearchParams({
      active: "1",
      project: String(projectId),
      activity: String(activityId),
    });
    const url = `${this.#baseUrl}api/timesheets?${params.toString()}`;
    const response = await tryFetch<TrackingItem[]>(url, this.fetchOptions);
    if (!response.success) return null;
    return response.body.length ? response.body[0] : null;
  }

  async getProjects() {
    this.assertValidConfig();
    const url = `${this.#baseUrl}api/projects`;
    return tryFetch<Category[]>(url, this.fetchOptions);
  }

  async getActivities(projectId: number) {
    this.assertValidConfig();
    const params = new URLSearchParams({
      project: String(projectId),
    });
    const url = `${this.#baseUrl}api/activities?${params.toString()}`;
    return tryFetch<Category[]>(url, this.fetchOptions);
  }

  async listTodaysTimeEntries(
    projectId: number,
    activityId: number
  ): Promise<ApiResponse<TrackingItem[]>> {
    this.assertValidConfig();
    if (!projectId || !activityId) {
      return {
        success: false,
        error: `projectId and activityId must be defined. Current values: ${JSON.stringify(
          { projectId, activityId }
        )}`,
      };
    }
    const params = new URLSearchParams({
      begin: format(startOfToday(), kimaiDateFormat),
      "projects[]": String(projectId),
      "activities[]": String(activityId),
    });
    const url = `${this.#baseUrl}api/timesheets?${params.toString()}`;
    return tryFetch<TrackingItem[]>(url, this.fetchOptions);
  }
}

import { format, startOfToday } from "date-fns";
import { TrackerSettingsValue } from "../tracker";
import {
  ApiResponse,
  Category,
  TimeEntry,
  TrackingItem,
  tryFetch,
} from "./api";

export class KimaiApi {
  static instance: KimaiApi | null = null;

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

  constructor(url: string, user: string, token: string) {
    if (KimaiApi.instance) return KimaiApi.instance;
    this.#baseUrl = url;
    this.#user = user;
    this.#token = token;
    KimaiApi.instance = this;
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

  async startTracking({
    projectId,
    activityId,
  }: TrackerSettingsValue): Promise<ApiResponse<TrackingItem>> {
    const url = `${this.#baseUrl}api/timesheets`;
    const body = {
      begin: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
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
    const url = `${this.#baseUrl}api/timesheets/${id}/stop`;
    const options = {
      ...this.fetchOptions,
      method: "PATCH",
    };
    return tryFetch<any>(url, options);
  }

  async getProjects() {
    const url = `${this.#baseUrl}api/projects`;
    return tryFetch<Category[]>(url, this.fetchOptions);
  }

  async getActivities(projectId: number) {
    const params = new URLSearchParams({
      project: String(projectId),
    });
    const url = `${this.#baseUrl}api/activities?${params.toString()}`;
    return tryFetch<Category[]>(url, this.fetchOptions);
  }

  async listTodaysTimeEntries(
    projectId: number,
    activityId: number
  ): Promise<ApiResponse<TimeEntry[]>> {
    if (!projectId || !activityId) {
      return {
        success: false,
        error: `projectId and activityId must be defined. Current values: ${JSON.stringify(
          { projectId, activityId }
        )}`,
      };
    }
    const params = new URLSearchParams({
      begin: format(startOfToday(), "yyyy-MM-dd'T'HH:mm:ss"),
      "projects[]": String(projectId),
      "activities[]": String(activityId),
    });
    const url = `${this.#baseUrl}api/timesheets?${params.toString()}`;
    return tryFetch<TimeEntry[]>(url, this.fetchOptions);
  }
}

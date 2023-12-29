import { format, startOfToday } from "date-fns";

export class KimaiApi {
  static instance = null;

  static async ping(baseUrl, user, token) {
    const url = `${baseUrl}api/ping`;
    const response = await fetch(url, {
      headers: {
        "X-AUTH-USER": user,
        "X-AUTH-TOKEN": token,
      },
    });
    return response.json();
  }

  #baseUrl;
  #user;
  #token;

  constructor(url, user, token) {
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
    };
  }

  async startTracking({ projectId, activityId }) {
    const url = `${this.#baseUrl}api/timesheets`;
    const body = {
      begin: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      project: projectId,
      activity: activityId,
      description: "",
    };
    const response = await fetch(url, {
      ...this.fetchOptions,
      method: "POST",
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async stopTracking(id) {
    const url = `${this.#baseUrl}api/timesheets/${id}/stop`;
    const response = await fetch(url, {
      ...this.fetchOptions,
      method: "PATCH",
    });
    return response.json();
  }

  async getProjects() {
    const url = `${this.#baseUrl}api/projects`;
    const response = await fetch(url, this.fetchOptions);
    return response.json();
  }

  async getActivities(projectId) {
    const params = new URLSearchParams({
      project: projectId,
    });
    const url = `${this.#baseUrl}api/activities?${params.toString()}`;
    const response = await fetch(url, this.fetchOptions);
    return response.json();
  }

  async listTodaysTimeEntries(projectId, activityId) {
    if (!projectId || !activityId) {
      return Promise.resolve([]);
    }
    const params = new URLSearchParams({
      begin: format(startOfToday(), "yyyy-MM-dd'T'HH:mm:ss"),
      "projects[]": projectId,
      "activities[]": activityId,
    });
    const url = `${this.#baseUrl}api/timesheets?${params.toString()}`;
    const response = await fetch(url, this.fetchOptions);
    return response.json();
  }
}

import { KimaiApi } from "./lib/api/kimai-api";
import {
  AuthenticationState,
  BackendProvider,
  StateKey,
} from "./lib/constants";
import { TrackerSettings, TrackerSettingsValue } from "./lib/tracker";
import { BackendProviders, GlobalSettings } from "./lib/types";

declare const $PI: any;
declare const Utils: any;

const State = new Map();

$PI.onConnected(
  ({ actionInfo, appInfo, connection, messageType, port, uuid }: any) => {
    console.log("onConnected", {
      actionInfo,
      appInfo,
      connection,
      messageType,
      port,
      uuid,
    });

    const {
      payload: { settings }, // eslint-disable-line
      action,
      context, // eslint-disable-line
    } = actionInfo;

    $PI.getSettings();
    $PI.getGlobalSettings();

    $PI.onDidReceiveSettings(action, ({ payload: { settings } }: any) =>
      onSettingsReceived(settings)
    );

    $PI.onDidReceiveGlobalSettings(({ payload: { settings } }: any) =>
      onGlobalSettingsReceived(settings)
    );

    const onFormChangeDebounced = Utils.debounce(100, async () => {
      const settings = await getFormValue();
      if (
        settings.projectId != State.get(StateKey.settings)?.value?.projectId
      ) {
        loadActivities(settings.projectId);
        settings.activityId = null;
      }
      $PI.setSettings(
        settingsByProvider(BackendProvider.kimai, {
          projectId: +settings.projectId,
          activityId: +settings.activityId,
        })
      );
      $PI.getSettings();
    });

    document.querySelectorAll("input, select").forEach((node) => {
      node.addEventListener("keyup", onFormChangeDebounced);
      node.addEventListener("change", onFormChangeDebounced);
    });
  }
);

document.getElementById("settings")!.addEventListener("click", () => {
  const external = window.open("../../../external.html")!;
  external.addEventListener("load", () => {
    external.postMessage(State.get(StateKey.globalSettings));
  });
  State.set(StateKey.externalWindow, external);
});

async function onSettingsReceived(settings: TrackerSettings) {
  State.set(StateKey.settings, settings);
}

function onGlobalSettingsReceived(settings: GlobalSettings) {
  console.log("onGlobalSettingsReceived", settings);
  State.set(StateKey.globalSettings, settings);
  if (
    settings.backendProviderConfig?.[BackendProvider.kimai]
      ?.authenticationState === AuthenticationState.loggedIn
  ) {
    loadProjects();
  }
}

async function loadProjects() {
  const response = await getApi().getProjects();
  if (!response.success) {
    console.error("Could not load projects");
    return;
  }
  const projects = response.body;
  const projectId = State.get(StateKey.settings)?.value?.projectId;
  const options = [
    '<option value="">Select project</option>',
    ...projects.map((project) => {
      const selected = projectId == project.id ? "selected" : "";
      return `<option ${selected} value="${project.id}">${project.name}</option>`;
    }),
  ];
  document.querySelector("[name='projectId']")!.innerHTML = options.join("");
  if (typeof projectId === "number") {
    loadActivities(projectId);
  }
}

async function loadActivities(projectId: number) {
  const response = await getApi().getActivities(projectId);
  if (!response.success) {
    console.error("Could not load activities");
    return;
  }
  const activities = response.body;
  const activityId = State.get(StateKey.settings)?.value?.activityId;
  resetActivityIfNotInProject(activities, activityId);
  const options = [
    '<option value="">Select activity</option>',
    ...activities.map((activity) => {
      const selected = activityId == activity.id ? "selected" : "";
      return `<option ${selected} value="${activity.id}">${activity.name}</option>`;
    }),
  ];
  document.querySelector("[name='activityId']")!.innerHTML = options.join("");
}

function resetActivityIfNotInProject(activities: any[], activityId: any) {
  if (!activities.map((a) => a.id).includes(+activityId)) {
    const settings = {
      ...(State.get(StateKey.settings)?.value ?? {}),
      activityId: null,
    };
    $PI.setSettings(settingsByProvider(BackendProvider.kimai, settings));
    $PI.getSettings();
  }
}

function getApi() {
  const { url, user, password } = State.get(StateKey.globalSettings)
    .backendProviderConfig[BackendProvider.kimai];
  return new KimaiApi(url, user, password);
}

async function getForm() {
  return new Promise((resolve) => {
    const tryGetForm = () => {
      const form = document.getElementById("property-inspector");
      if (form) {
        resolve(form);
      } else {
        window.setTimeout(tryGetForm, 10);
      }
    };
    tryGetForm();
  });
}

async function getFormValue() {
  const form = await getForm();
  return {
    projectId: "",
    activityId: "",
    ...Utils.getFormValue(form),
  };
}

function settingsByProvider(
  provider: BackendProviders,
  settings: TrackerSettingsValue
) {
  switch (provider) {
    case BackendProvider.kimai:
      return {
        backendProvider: BackendProvider.kimai,
        value: settings,
      };
    default:
      throw new Error(`Unknown provider ${provider}`);
  }
}

window.addEventListener("message", ({ data }) => {
  State.get(StateKey.externalWindow)?.close();
  State.set(StateKey.externalWindow, null);
  $PI.setGlobalSettings(data);
  $PI.getGlobalSettings();
});

/// <reference path="../../dev.b263.time-tracker.sdPlugin/libs/js/property-inspector.js" />
/// <reference path="../../dev.b263.time-tracker.sdPlugin/libs/js/utils.js" />

import { KimaiApi } from "./lib/api/kimai-api.js";
import { BackendProvider, StateKey } from "./lib/constants.js";

const State = new Map();

$PI.onConnected(
  ({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
    console.log("onConnected", {
      actionInfo,
      appInfo,
      connection,
      messageType,
      port,
      uuid,
    });

    const {
      // eslint-disable-next-line no-unused-vars
      payload: { settings },
      action,
      // eslint-disable-next-line no-unused-vars
      context,
    } = actionInfo;

    $PI.getSettings();
    $PI.getGlobalSettings();

    $PI.onDidReceiveSettings(action, ({ payload: { settings } }) =>
      onSettingsReceived(settings)
    );

    $PI.onDidReceiveGlobalSettings(({ payload: { settings } }) =>
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

document.getElementById("sign-in").addEventListener("click", () => {
  State.set(StateKey.externalWindow, window.open("./external.html"));
});

document.getElementById("sign-out").addEventListener("click", () => {
  const globalSettings = {
    ...State.get(StateKey.globalSettings),
    backendProviderConfig: {
      [BackendProvider.kimai]: null,
    },
  };
  $PI.setGlobalSettings(globalSettings);
  $PI.getGlobalSettings();
});

async function onSettingsReceived(settings) {
  State.set(StateKey.settings, settings);
}

function onGlobalSettingsReceived(settings) {
  console.log("onGlobalSettingsReceived", settings);
  State.set(StateKey.globalSettings, settings);
  if (settings.backendProviderConfig?.[BackendProvider.kimai]) {
    document.getElementById("sign-in").style.display = "none";
    document.getElementById("sign-out").style.display = "block";
    loadProjects();
  } else {
    document.getElementById("sign-in").style.display = "block";
    document.getElementById("sign-out").style.display = "none";
  }
}

async function loadProjects() {
  const projects = await getApi().getProjects();
  const projectId = State.get(StateKey.settings)?.value?.projectId;
  const options = [
    '<option value="">Select project</option>',
    ...projects.map((project) => {
      const selected = projectId == project.id ? "selected" : "";
      return `<option ${selected} value="${project.id}">${project.name}</option>`;
    }),
  ];
  document.querySelector("[name='projectId']").innerHTML = options.join("");
  if (typeof projectId === "number") {
    loadActivities(projectId);
  }
}

async function loadActivities(projectId) {
  const activities = await getApi().getActivities(projectId);
  const activityId = State.get(StateKey.settings)?.value?.activityId;
  resetActivityIfNotInProject(activities, activityId);
  const options = [
    '<option value="">Select activity</option>',
    ...activities.map((activity) => {
      const selected = activityId == activity.id ? "selected" : "";
      return `<option ${selected} value="${activity.id}">${activity.name}</option>`;
    }),
  ];
  document.querySelector("[name='activityId']").innerHTML = options.join("");
}

function resetActivityIfNotInProject(activities, activityId) {
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

function settingsByProvider(provider, settings) {
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
  const state = State.get(StateKey.globalSettings);
  const globalSettings = {
    ...(state ?? {}),
    backendProviderConfig: {
      ...(state?.backendProviderConfig ?? {}),
      [BackendProvider.kimai]: data,
    },
  };
  $PI.setGlobalSettings(globalSettings);
  $PI.getGlobalSettings();
});

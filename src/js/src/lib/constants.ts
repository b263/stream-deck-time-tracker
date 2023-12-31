export const StateKey = {
  currentEvent: "currentEvent",
  settings: "settings",
  globalSettings: "globalSettings",
  externalWindow: "externalWindow",
} as const;

export const BackendProvider = {
  kimai: "kimai",
} as const;

export const AuthenticationState = {
  none: "none",
  loggedIn: "loggedIn",
  error: "error",
} as const;

export const AppEvent = {
  actionSuccess: "actionSuccess",
  actionAlert: "actionAlert",
} as const;

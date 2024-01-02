import { TrackingItem } from "./api/api";
import { AuthenticationState } from "./constants";

export type BackendProvider = "kimai";

export type BackendProviderConfig = {
  kimai: {
    url: string;
    user: string;
    token: string;
    userId?: number; // TODO: Currently unused. Remove?
    authenticationState?: (typeof AuthenticationState)[keyof typeof AuthenticationState];
  };
};

export type GlobalSettings = {
  backendProviderConfig: {
    [K in BackendProvider]: BackendProviderConfig[K];
  };
};

export type KimaiBackendProviderPluginConfig = {
  projectId: number;
  activityId: number;
};

export type BackendProviderPluginConfig = {
  kimai: KimaiBackendProviderPluginConfig;
};

export type PluginSettings = {
  backendProvider: BackendProvider;
} & {
  [K in BackendProvider]: BackendProviderPluginConfig[K];
};

export type AppState = {
  externalWindow: Window | null;
  settings: PluginSettings;
  currentEvent: TrackingItem;
  globalSettings: GlobalSettings;
};

export type SDConnectionInfo = {
  actionInfo: {
    action: string;
    context: string;
    device: string;
    payload: {
      controller: string;
      coordinates: {
        column: number;
        row: number;
      };
      settings: any;
    };
  };
  appInfo: {
    plugin: {
      uuid: string;
      version: string;
    };
  };
};

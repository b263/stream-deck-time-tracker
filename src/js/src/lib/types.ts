import { TrackingItem } from "./api/api";
import { KimaiApi } from "./api/kimai-api";
import { LocalApi } from "./api/local-api";
import { AuthenticationState } from "./constants";

export type BackendProvider = "local" | "kimai";

export type BackendProviderConfig = {
  local: any;
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

export type LocalBackendProviderPluginConfig = {
  task: string;
};

export type KimaiBackendProviderPluginConfig = {
  projectId: number;
  activityId: number;
};

export type BackendProviderPluginConfig = {
  local: LocalBackendProviderPluginConfig;
  kimai: KimaiBackendProviderPluginConfig;
};

export type PluginSettings = {
  backendProvider: BackendProvider;
} & {
  [K in BackendProvider]?: BackendProviderPluginConfig[K];
};

export type BackendProviderApi = {
  local: LocalApi;
  kimai: KimaiApi;
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

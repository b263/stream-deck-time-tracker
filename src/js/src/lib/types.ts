import { TrackingItem } from "./api/api";
import { AuthenticationState } from "./constants";

export type BackendProviders = "kimai";

export type BackendProviderConfig = {
  kimai: {
    url: string;
    user: string;
    password: string;
    userId?: number;
    authenticationState?: (typeof AuthenticationState)[keyof typeof AuthenticationState];
  };
};

export type GlobalSettings = {
  backendProviderConfig: {
    [K in BackendProviders]: BackendProviderConfig[K];
  };
};

export type AppState = {
  externalWindow: any;
  currentEvent: TrackingItem;
  globalSettings: GlobalSettings;
};

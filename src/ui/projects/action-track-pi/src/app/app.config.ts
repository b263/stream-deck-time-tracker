import { APP_BASE_HREF } from '@angular/common';
import { ApplicationConfig, InjectionToken } from '@angular/core';
import { AppState } from '../../../../../js/src/lib/types';
import { Store } from '../../../../../js/src/lib/store/store';

declare var $SD: any;
declare var $PI: any;
declare var Utils: any;

export const STORE = new InjectionToken<Store<AppState>>('App state');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: STORE, useValue: new Store<AppState>() },
    {
      provide: APP_BASE_HREF,
      useValue: window.location.pathname.replace('index.html', ''),
    },
  ],
};

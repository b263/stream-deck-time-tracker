import { APP_BASE_HREF } from '@angular/common';
import { ApplicationConfig, InjectionToken } from '@angular/core';
import { AppState } from '../../../../../js/src/lib/types';

declare var $SD: any;
declare var $PI: any;
declare var Utils: any;

export const STATE = new InjectionToken<AppState>('App state');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: STATE, useValue: {} },
    {
      provide: APP_BASE_HREF,
      useValue: window.location.pathname.replace('index.html', ''),
    },
  ],
};

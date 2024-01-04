import { APP_BASE_HREF } from '@angular/common';
import { ApplicationConfig, InjectionToken } from '@angular/core';
import { GlobalSettings } from '../../../../../js/src/lib/types';
import { BehaviorSubject } from 'rxjs';

export const INITIAL_GLOBAL_SETTINGS = new InjectionToken<
  BehaviorSubject<GlobalSettings>
>('Initial global settings');
const initialGlobalSettings$ = new BehaviorSubject<GlobalSettings | null>(null);

window.addEventListener('message', ({ data }) =>
  initialGlobalSettings$.next(data)
);

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: window.location.pathname.replace('index.html', ''),
    },
    {
      provide: INITIAL_GLOBAL_SETTINGS,
      useValue: initialGlobalSettings$,
    },
  ],
};

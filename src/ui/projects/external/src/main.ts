import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

declare var $SD: any;
declare var $PI: any;
declare var Utils: any;

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AuthenticationState,
  StateKey,
} from '../../../../../js/src/lib/constants';
import {
  PluginSettings,
  SDConnectionInfo,
} from '../../../../../js/src/lib/types';
import { STORE } from './app.config';
import { KimaiComponent } from './kimai/kimai.component';

export const DEFAULT_SETTINGS: PluginSettings = {
  backendProvider: 'kimai',
  kimai: {
    projectId: 0,
    activityId: 0,
  },
};

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, KimaiComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly store = inject(STORE);
  private readonly cdr = inject(ChangeDetectorRef);

  public isKimaiAuthenticated = false;

  @ViewChild(KimaiComponent)
  private kimaiComponent!: KimaiComponent;

  constructor() {
    $PI.onConnected((connectionInfo: SDConnectionInfo) => {
      console.log('$PI.onConnected(connectionInfo)', { connectionInfo });

      const {
        actionInfo: { action },
      } = connectionInfo;

      $PI.getSettings();
      $PI.getGlobalSettings();

      $PI.onDidReceiveSettings(action, ({ payload: { settings } }: any) => {
        settings = {
          ...DEFAULT_SETTINGS,
          ...(settings ?? {}),
        };
        console.log('$PI.onDidReceiveSettings', settings);
        this.store.patchState({ [StateKey.settings]: settings });
      });

      $PI.onDidReceiveGlobalSettings(({ payload: { settings } }: any) => {
        console.log('$PI.onGlobalSettingsReceived', settings);
        this.store.patchState({ [StateKey.globalSettings]: settings });
        if (
          settings.backendProviderConfig?.['kimai']?.authenticationState ===
          AuthenticationState.loggedIn
        ) {
          this.isKimaiAuthenticated = true;
          this.kimaiComponent.loadProjects();
        } else {
          this.isKimaiAuthenticated = false;
        }
        this.cdr.detectChanges();
      });
    });

    window.addEventListener('message', async ({ data }) => {
      (await this.store.once(StateKey.externalWindow))?.close();
      this.store.patchState({ [StateKey.externalWindow]: null });
      $PI.setGlobalSettings(data);
      $PI.getGlobalSettings();
    });
  }

  openExternalSettings() {
    const external = window.open('../../../external/index.html')!;
    external.addEventListener('load', async () => {
      const globalSettings = await this.store.once(StateKey.globalSettings);
      external.postMessage(globalSettings);
    });
    this.store.patchState({ [StateKey.externalWindow]: external });
  }
}

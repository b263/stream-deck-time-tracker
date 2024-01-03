import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { filter, tap } from 'rxjs/operators';
import { KimaiApi } from '../../../../../js/src/lib/api/kimai-api';
import { AuthenticationState } from '../../../../../js/src/lib/constants';
import { INITIAL_GLOBAL_SETTINGS } from './app.config';
import { GlobalSettings } from '../../../../../js/src/lib/types';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private initialGlobalSettings$ = inject(INITIAL_GLOBAL_SETTINGS);
  private cdr = inject(ChangeDetectorRef);

  form = new FormGroup({
    backendProviderConfig: new FormGroup({
      local: new FormControl({}),
      kimai: new FormGroup({
        authenticationState: new FormControl<keyof typeof AuthenticationState>(
          AuthenticationState.none
        ),
        url: new FormControl(''),
        user: new FormControl(''),
        token: new FormControl(''),
        userId: new FormControl(0),
      }),
    }),
  });

  constructor() {
    this.initialGlobalSettings$
      .pipe(
        filter((settings) => !!settings),
        tap((settings) => console.log('Initial global settings', { settings })),
        takeUntilDestroyed()
      )
      .subscribe((settings) => {
        this.form.patchValue(settings);
        this.cdr.detectChanges();
      });
  }

  async onKimaiLogin() {
    let authenticationState: keyof typeof AuthenticationState =
      AuthenticationState.error;
    const { url, user, token } =
      this.patchedFormValue.backendProviderConfig!.kimai!;
    try {
      const response = await KimaiApi.getCurrentUser(url!, user!, token!);
      authenticationState = response?.id
        ? AuthenticationState.loggedIn
        : AuthenticationState.error;
      console.log('getCurrentUser', response, authenticationState);
    } catch (e) {
      console.error('Error signing in', e);
    }
    this.form
      .get(['backendProviderConfig', 'kimai', 'authenticationState'] as const)
      ?.setValue(authenticationState);
    this.cdr.detectChanges();
  }

  onSave() {
    window.opener.postMessage(this.patchedFormValue);
  }

  onReset() {
    this.form.reset();
  }

  get patchedFormValue() {
    const value = JSON.parse(JSON.stringify(this.form.value)) as GlobalSettings;
    value.backendProviderConfig.kimai.url =
      value.backendProviderConfig.kimai.url.replace(/\/(api)?$/, '') + '/';
    return value;
  }
}

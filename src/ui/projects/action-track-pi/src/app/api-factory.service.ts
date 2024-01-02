import { Injectable, inject } from '@angular/core';
import {
  BackendProvider,
  BackendProviderApi,
} from '../../../../../js/src/lib/types';
import { KimaiApi } from '../../../../../js/src/lib/api/kimai-api';
import { StateKey } from '../../../../../js/src/lib/constants';
import { STATE } from './app.config';
import { LocalApi } from '../../../../../js/src/lib/api/local-api';

@Injectable({ providedIn: 'root' })
export class ApiFactoryService {
  private readonly state = inject(STATE);

  get<T extends BackendProvider>(backendProvider: T): BackendProviderApi[T] {
    switch (backendProvider) {
      case 'kimai':
        const { url, user, token } =
          this.state[StateKey.globalSettings].backendProviderConfig['kimai'];
        if (!url || !user || !token) {
          console.error('Missing settings for provider kimai');
        }
        return KimaiApi.config({
          url,
          user,
          token,
        }).get() as BackendProviderApi[T];
    }
    return new LocalApi() as BackendProviderApi[T];
  }
}

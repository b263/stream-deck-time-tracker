import { Injectable, inject } from '@angular/core';
import {
  BackendProvider,
  BackendProviderApi,
} from '../../../../../js/src/lib/types';
import { KimaiApi } from '../../../../../js/src/lib/api/kimai-api';
import { StateKey } from '../../../../../js/src/lib/constants';
import { STORE } from './app.config';
import { LocalApi } from '../../../../../js/src/lib/api/local-api';

@Injectable({ providedIn: 'root' })
export class ApiFactoryService {
  private readonly store = inject(STORE);

  async get<T extends BackendProvider>(
    backendProvider: T
  ): Promise<BackendProviderApi[T]> {
    switch (backendProvider) {
      case 'kimai':
        const kimaiConfig = (await this.store.once(StateKey.globalSettings))
          ?.backendProviderConfig?.['kimai'];
        if (!kimaiConfig.url || !kimaiConfig.user || !kimaiConfig.token) {
          console.error('Missing settings for provider kimai');
        }
        return KimaiApi.config(kimaiConfig).get() as BackendProviderApi[T];
    }
    return new LocalApi() as BackendProviderApi[T];
  }
}

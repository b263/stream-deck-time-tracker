import { JsonListComponent } from './json-list.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { STORE } from '../app.config';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [JsonListComponent, AsyncPipe],
  template: `<app-jsonlist [data]="store.state$ | async"></app-jsonlist>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugComponent {
  public readonly store = inject(STORE);
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'type',
  standalone: true,
})
export class TypePipe implements PipeTransform {
  transform(value: any): string {
    return typeof value;
  }
}

@Component({
  selector: 'app-jsonlist',
  standalone: true,
  imports: [CommonModule, TypePipe],
  template: `
    <ng-container [ngSwitch]="data | type">
      <ng-container *ngSwitchCase="'object'">
        <ul>
          <li *ngFor="let item of data | keyvalue">
            <span>{{ item.key }}:</span>
            <app-jsonlist
              *ngIf="item.key !== 'externalWindow'; else hidden"
              [data]="item.value"
              [key]="item.key"
            ></app-jsonlist>
          </li>
        </ul>
      </ng-container>
      <ng-container *ngSwitchDefault>
        <ng-container [ngSwitch]="key">
          <ng-container *ngSwitchCase="'token'"> (redacted)</ng-container>
          <ng-container *ngSwitchDefault>
            <strong> {{ data }}</strong>
          </ng-container>
        </ng-container>
      </ng-container>
    </ng-container>
    <ng-template #hidden> (hidden)</ng-template>
  `,
  styles: [
    'ul { max-height: max-content!important; overflow: auto!important; margin: 0 !important; padding-left: 1.3em !important; }',
    'li { background-color: transparent !important; }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonListComponent {
  @Input()
  public data: any;

  @Input()
  public key: any;
}

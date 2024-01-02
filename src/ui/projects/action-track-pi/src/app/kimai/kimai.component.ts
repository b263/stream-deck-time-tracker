import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  NgZone,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Category } from '../../../../../../js/src/lib/api/api';
import { StateKey } from '../../../../../../js/src/lib/constants';
import {
  KimaiBackendProviderPluginConfig,
  PluginSettings,
} from '../../../../../../js/src/lib/types';
import { ApiFactoryService } from '../api-factory.service';
import { DEFAULT_SETTINGS } from '../app.component';
import { STATE } from '../app.config';

const backendProvider = 'kimai' as const;

@Component({
  selector: 'app-kimai',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './kimai.component.html',
})
export class KimaiComponent {
  private readonly state = inject(STATE);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);
  private readonly api = inject(ApiFactoryService);

  public readonly form = new FormGroup({
    projectId: new FormControl(0),
    activityId: new FormControl(0),
  });

  public projects$ = new BehaviorSubject<Category[]>([]);
  public activities$ = new BehaviorSubject<Category[]>([]);

  public loadingProjects$ = new BehaviorSubject<boolean>(true);
  public loadingActivities$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.form.valueChanges
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        if (value.projectId != this.settings.kimai!.projectId) {
          this.loadActivities(+value.projectId!);
          value.activityId = 0;
          this.form.get('activityId')?.patchValue(0);
          this.zone.run(() => this.activities$.next([]));
        }
        $PI.setSettings(
          this.patchSettings({
            projectId: +value.projectId!,
            activityId: +value.activityId!,
          })
        );
        $PI.getSettings();
      });
  }

  async loadProjects() {
    this.zone.run(() => this.loadingProjects$.next(true));
    const response = await this.getApi()!.getProjects();
    if (!response.success) {
      console.error('Could not load projects');
      return;
    }
    const projectId = this.settings.kimai!.projectId;
    const projects = response.body;
    this.form.get('projectId')?.patchValue(projectId, { emitEvent: false });
    console.log('projects', projects);
    this.projects$.next(projects);
    this.zone.run(() => this.loadingProjects$.next(false));
    if (projectId > 0) {
      this.loadActivities(projectId);
    }
  }

  async loadActivities(projectId: number) {
    if (projectId == 0) return;
    this.zone.run(() => this.loadingActivities$.next(true));
    const response = await this.getApi()!.getActivities(projectId);
    if (!response.success) {
      console.error('Could not load activities');
      return;
    }
    const activities = response.body;
    const activityId = this.settings.kimai!.activityId;
    this.form.get('activityId')?.patchValue(activityId, { emitEvent: false });
    this.resetActivityIfNotInProject(activities, activityId);
    this.activities$.next(activities);
    this.zone.run(() => this.loadingActivities$.next(false));
  }

  private get settings(): PluginSettings {
    return this.state[StateKey.settings] ?? DEFAULT_SETTINGS;
  }

  resetActivityIfNotInProject(activities: any[], activityId: number) {
    if (activityId > 0 && !activities.map((a) => a.id).includes(activityId)) {
      const settings = this.patchSettings({
        activityId: 0,
      });
      $PI.setSettings(settings);
      $PI.getSettings();
    }
  }

  patchSettings(
    updated: Partial<KimaiBackendProviderPluginConfig>
  ): PluginSettings {
    return {
      ...this.settings,
      kimai: {
        ...this.settings.kimai!,
        ...updated,
      },
    };
  }

  getApi() {
    return this.api.get<typeof backendProvider>(backendProvider);
  }
}

import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { cacheBuster, Catalog } from '../../catalog/catalog';
import { ReleasesFile } from '../../catalog/catalog.models';
import { FileSizePipe } from '../../catalog/file-size-pipe';

@Component({
  selector: 'app-app-detail-page',
  imports: [DatePipe, FileSizePipe, MatButtonModule, MatCardModule, MatProgressBar, RouterLink],
  templateUrl: './app-detail-page.html',
  styleUrl: './app-detail-page.scss',
})
export class AppDetailPage {
  /** Bound from the `:id` route parameter. */
  readonly id = input('');

  protected readonly catalog = inject(Catalog);
  protected readonly app = computed(() => this.catalog.apps().find((app) => app.id === this.id()));

  protected readonly releasesFile = httpResource<ReleasesFile>(() =>
    this.id()
      ? { url: `data/releases/${this.id()}.json`, params: { t: cacheBuster() } }
      : undefined,
  );
  protected readonly releases = computed(() =>
    this.releasesFile.hasValue() ? this.releasesFile.value().releases : [],
  );

  constructor() {
    const title = inject(Title);
    effect(() => {
      const app = this.app();
      title.setTitle(app ? `${app.name} · APK Hub` : 'APK Hub');
    });
  }
}

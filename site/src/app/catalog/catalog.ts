import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { AppsFile } from './catalog.models';

/** Loads the app list once and shares it between pages. */
@Injectable({ providedIn: 'root' })
export class Catalog {
  // Relative URL so it resolves against <base href> (/apk-hub/ on GitHub Pages).
  readonly appsFile = httpResource<AppsFile>(() => 'data/apps.json');

  readonly apps = computed(() => (this.appsFile.hasValue() ? this.appsFile.value().apps : []));
}

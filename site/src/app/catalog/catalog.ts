import { httpResource } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { AppsFile } from './catalog.models';

/**
 * GitHub Pages and its CDN cache every file for up to 10 minutes, and the data files keep the
 * same URL on every deploy. A unique query string makes each load fetch the current data.
 */
export function cacheBuster(): string {
  return Date.now().toString();
}

/** Loads the app list once and shares it between pages. */
@Injectable({ providedIn: 'root' })
export class Catalog {
  // Relative URL so it resolves against <base href> (/apk-hub/ on GitHub Pages).
  readonly appsFile = httpResource<AppsFile>(() => ({
    url: 'data/apps.json',
    params: { t: cacheBuster() },
  }));

  readonly apps = computed(() => (this.appsFile.hasValue() ? this.appsFile.value().apps : []));
}

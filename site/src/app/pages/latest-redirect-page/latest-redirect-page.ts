import { Component, computed, effect, inject, InjectionToken, input } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { Catalog } from '../../catalog/catalog';

/** Sends the browser to a URL. A token so tests can check the redirect without leaving the page. */
export const REDIRECT = new InjectionToken<(url: string) => void>('REDIRECT', {
  providedIn: 'root',
  factory: () => (url: string) => window.location.replace(url),
});

/**
 * Behind the permanent link /apps/<id>/latest: starts the download of the newest APK, so one
 * link can be shared and never goes out of date.
 */
@Component({
  selector: 'app-latest-redirect-page',
  imports: [MatProgressBar, RouterLink],
  template: `
    <section class="block">
      @if (app(); as app) {
        @if (app.latest; as latest) {
          <h1>Downloading {{ app.name }} {{ latest.version }}</h1>
          <p>Your download should start in a moment.</p>
          <p class="actions">
            <a class="btn btn-accent" [href]="latest.apkUrl">Download didn't start? Tap here</a>
            <a class="btn" [routerLink]="['/apps', app.id]">Install help</a>
          </p>
        } @else {
          <h1>{{ app.name }}</h1>
          <p>No builds yet. <a [routerLink]="['/apps', app.id]">See the game's page</a>.</p>
        }
      } @else if (catalog.appsFile.hasValue()) {
        <h1>Game not found</h1>
        <p>There's no game called "{{ id() }}". <a routerLink="/">See all games</a>.</p>
      } @else if (catalog.appsFile.error()) {
        <p class="error">Couldn't load the game list. Try refreshing the page.</p>
      } @else {
        <h1>Finding the latest build…</h1>
        <mat-progress-bar mode="indeterminate" />
      }
    </section>
  `,
  styles: `
    h1 {
      font-size: clamp(22px, 4vw, 32px);
      margin-bottom: 12px;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 20px;
    }
  `,
})
export class LatestRedirectPage {
  /** Bound from the `:id` route parameter. */
  readonly id = input('');

  protected readonly catalog = inject(Catalog);
  protected readonly app = computed(() => this.catalog.apps().find((app) => app.id === this.id()));

  constructor() {
    const redirect = inject(REDIRECT);
    let redirected = false;
    effect(() => {
      const url = this.app()?.latest?.apkUrl;
      if (url && !redirected) {
        redirected = true;
        redirect(url);
      }
    });
  }
}

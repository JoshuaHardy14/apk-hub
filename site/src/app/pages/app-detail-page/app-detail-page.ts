import { DatePipe, DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { cacheBuster, Catalog } from '../../catalog/catalog';
import { ReleasesFile } from '../../catalog/catalog.models';
import { FileSizePipe } from '../../catalog/file-size-pipe';
import { Links } from '../../catalog/links';
import { AppHero } from '../../components/app-hero/app-hero';
import { InstallHelp } from '../../components/install-help/install-help';
import { QrCode } from '../../components/qr-code/qr-code';
import { ReleaseNotes } from '../../components/release-notes/release-notes';

@Component({
  selector: 'app-app-detail-page',
  imports: [
    AppHero,
    DatePipe,
    DecimalPipe,
    FileSizePipe,
    InstallHelp,
    MatProgressBar,
    QrCode,
    ReleaseNotes,
    RouterLink,
  ],
  templateUrl: './app-detail-page.html',
  styleUrl: './app-detail-page.scss',
})
export class AppDetailPage {
  /** Bound from the `:id` route parameter. */
  readonly id = input('');

  protected readonly catalog = inject(Catalog);
  private readonly links = inject(Links);

  protected readonly app = computed(() => this.catalog.apps().find((app) => app.id === this.id()));

  protected readonly releasesFile = httpResource<ReleasesFile>(() =>
    this.id()
      ? { url: `data/releases/${this.id()}.json`, params: { t: cacheBuster() } }
      : undefined,
  );
  protected readonly releases = computed(() =>
    this.releasesFile.hasValue() ? this.releasesFile.value().releases : [],
  );

  protected readonly pageUrl = computed(() => this.links.appPage(this.id()));
  protected readonly latestUrl = computed(() => this.links.latestDownload(this.id()));
  protected readonly copied = signal(false);

  constructor() {
    const title = inject(Title);
    effect(() => {
      const app = this.app();
      title.setTitle(app ? `${app.name} · APK Hub` : 'APK Hub');
    });
  }

  protected async copyLatestLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.latestUrl());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard access can be refused; the link is still shown on screen to copy by hand.
    }
  }
}

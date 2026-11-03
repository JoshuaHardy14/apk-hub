import { DOCUMENT, inject, Injectable } from '@angular/core';

/** Absolute links to the site's pages, resolved against <base href> (/apk-hub/ on GitHub Pages). */
@Injectable({ providedIn: 'root' })
export class Links {
  private readonly document = inject(DOCUMENT);

  /** The app's own page, where the download button and install help are. */
  appPage(appId: string): string {
    return new URL(`apps/${appId}`, this.document.baseURI).href;
  }

  /** A permanent link that always downloads the newest APK. */
  latestDownload(appId: string): string {
    return new URL(`apps/${appId}/latest`, this.document.baseURI).href;
  }
}

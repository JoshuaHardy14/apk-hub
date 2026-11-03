import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppEntry } from '../../catalog/catalog.models';
import { FileSizePipe } from '../../catalog/file-size-pipe';

/** The big banner for one app: icon, name, pitch, key numbers and the download button. */
@Component({
  selector: 'app-app-hero',
  imports: [DatePipe, DecimalPipe, FileSizePipe, RouterLink],
  templateUrl: './app-hero.html',
  styleUrl: './app-hero.scss',
})
export class AppHero {
  readonly app = input.required<AppEntry>();
  /** The home page links to the app page; the app page itself doesn't. */
  readonly showDetailsLink = input(false);
  /** h1 on the app's own page, h2 where it is one app among the page's content. */
  readonly headingLevel = input<1 | 2>(1);
}

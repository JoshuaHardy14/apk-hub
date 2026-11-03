import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { Catalog } from '../../catalog/catalog';
import { AppHero } from '../../components/app-hero/app-hero';

@Component({
  selector: 'app-home-page',
  imports: [AppHero, DecimalPipe, MatProgressBar, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly catalog = inject(Catalog);
  /** The first app in the catalog gets the big banner; the rest are listed below it. */
  protected readonly featured = computed(() => this.catalog.apps()[0]);
  protected readonly others = computed(() => this.catalog.apps().slice(1));
}

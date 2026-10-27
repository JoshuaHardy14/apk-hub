import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { Catalog } from '../../catalog/catalog';
import { FileSizePipe } from '../../catalog/file-size-pipe';

@Component({
  selector: 'app-home-page',
  imports: [DatePipe, FileSizePipe, MatButtonModule, MatCardModule, MatProgressBar, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly catalog = inject(Catalog);
}

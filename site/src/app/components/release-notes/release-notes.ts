import { Component, computed, input } from '@angular/core';

/** Turns release notes written as "- item" lines into a list; other lines stay as text. */
export function noteLines(notes: string): string[] {
  return notes
    .split('\n')
    .map((line) => line.trim().replace(/^[-*•]\s+/, ''))
    .filter((line) => line.length > 0);
}

@Component({
  selector: 'app-release-notes',
  template: `
    @if (lines().length > 0) {
      <ul class="notes">
        @for (line of lines(); track $index) {
          <li>{{ line }}</li>
        }
      </ul>
    } @else {
      <p class="muted">Bug fixes and improvements.</p>
    }
  `,
  styles: `
    .notes {
      display: grid;
      gap: 8px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .notes li {
      padding-left: 22px;
      position: relative;
    }

    // A small square bullet, matching the blocky style.
    .notes li::before {
      background: var(--accent);
      border: 2px solid var(--edge);
      content: '';
      height: 6px;
      left: 0;
      position: absolute;
      top: 0.55em;
      width: 6px;
    }
  `,
})
export class ReleaseNotes {
  readonly notes = input.required<string>();
  protected readonly lines = computed(() => noteLines(this.notes()));
}

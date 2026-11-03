import { Component } from '@angular/core';

/** Step-by-step help for installing an APK, which most people haven't done before. */
@Component({
  selector: 'app-install-help',
  template: `
    <h2>How to install</h2>
    <ol class="steps">
      <li>
        <span>Tap <strong>Download</strong> on your Android phone and wait for it to finish.</span>
      </li>
      <li>
        <span
          >Open the downloaded file from the notification or your
          <strong>Downloads</strong> folder.</span
        >
      </li>
      <li>
        <span
          >If Android asks, allow your browser to <strong>install unknown apps</strong>, then go
          back.</span
        >
      </li>
      <li>
        <span>Tap <strong>Install</strong>, then <strong>Open</strong>.</span>
      </li>
    </ol>
    <p class="note">
      <strong>Updating?</strong> Install the new version over the old one. Your progress is kept.
    </p>
    <p class="note muted">
      Google Play Protect may warn you because the game isn't from the Play Store. Choose
      <strong>Install anyway</strong> to continue.
    </p>
  `,
  styles: `
    .steps {
      counter-reset: step;
      display: grid;
      gap: 12px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    // Each step's text is wrapped in one span so it stays a single grid cell beside its number.
    .steps li {
      align-items: center;
      counter-increment: step;
      display: grid;
      gap: 14px;
      grid-template-columns: 36px 1fr;
    }

    .steps li::before {
      align-items: center;
      background: var(--accent-deep);
      border: 3px solid var(--edge);
      border-radius: var(--radius);
      box-shadow: 0 3px 0 var(--edge);
      color: var(--edge);
      content: counter(step);
      display: flex;
      font: 700 16px/1 var(--pixel-font);
      height: 30px;
      justify-content: center;
    }

    .note {
      font-size: 14px;
      margin: 16px 0 0;
    }
  `,
})
export class InstallHelp {}

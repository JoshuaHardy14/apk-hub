import { Component, effect, input, signal } from '@angular/core';

/** A QR code for a URL, so someone on a computer can open the page on their phone. */
@Component({
  selector: 'app-qr-code',
  template: `
    @if (dataUrl(); as src) {
      <img class="pixelated" [src]="src" [alt]="label()" width="200" height="200" />
    } @else {
      <div class="placeholder" aria-hidden="true"></div>
    }
  `,
  styles: `
    :host {
      display: inline-block;
      line-height: 0;
    }

    img,
    .placeholder {
      background: var(--text);
      border: 3px solid var(--edge);
      border-radius: var(--radius);
      box-shadow: 0 4px 0 var(--edge);
      height: 200px;
      width: 200px;
    }
  `,
})
export class QrCode {
  readonly url = input.required<string>();
  readonly label = input('QR code');

  protected readonly dataUrl = signal<string | null>(null);

  constructor() {
    effect(async () => {
      const url = this.url();
      // Loaded on demand so the QR library isn't part of the first download. It is CommonJS, so
      // the bundler puts its exports under `default`.
      const module = await import('qrcode');
      const qrcode = (module as unknown as { default?: typeof module }).default ?? module;
      this.dataUrl.set(
        await qrcode.toDataURL(url, {
          margin: 2,
          scale: 8,
          color: { dark: '#0a0d12', light: '#f2f2fa' },
        }),
      );
    });
  }
}

import { HttpRequest, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppsFile } from '../../catalog/catalog.models';
import { HomePage } from './home-page';

const appsFile: AppsFile = {
  generatedAt: '2026-10-27T00:00:00Z',
  apps: [
    {
      id: 'mobfighter',
      name: 'MobFighter',
      description: 'A Unity game for Android.',
      icon: 'data/icons/mobfighter.svg',
      minAndroid: '7.1',
      releaseCount: 1,
      latest: {
        version: '1.2.3',
        tag: 'mobfighter-v1.2.3',
        publishedAt: '2026-10-20T00:00:00Z',
        notes: '',
        prerelease: false,
        apkName: 'mobfighter-1.2.3.apk',
        apkUrl: 'https://example.com/mobfighter-1.2.3.apk',
        sizeBytes: 48_000_000,
        sha256: null,
      },
    },
  ],
};

describe('HomePage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  async function render(respond: (http: HttpTestingController) => void): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(HomePage);
    TestBed.tick();
    respond(TestBed.inject(HttpTestingController));
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  // The URL carries a changing cache-busting query string, so match on the path only.
  const appsRequest = (request: HttpRequest<unknown>) => request.url === 'data/apps.json';

  it('lists apps with a download link to the latest APK', async () => {
    const element = await render((http) => http.expectOne(appsRequest).flush(appsFile));

    expect(element.textContent).toContain('MobFighter');
    expect(element.textContent).toContain('v1.2.3');
    const download = element.querySelector<HTMLAnchorElement>('a[download]');
    expect(download?.href).toBe('https://example.com/mobfighter-1.2.3.apk');
    expect(download?.textContent).toContain('45.8 MB');
  });

  it('shows an error when the app list fails to load', async () => {
    const element = await render((http) =>
      http.expectOne(appsRequest).flush('', { status: 404, statusText: 'Not Found' }),
    );

    expect(element.querySelector('.error')?.textContent).toContain("Couldn't load");
  });
});

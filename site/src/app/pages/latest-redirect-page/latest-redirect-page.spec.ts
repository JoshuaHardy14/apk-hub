import { HttpRequest, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppsFile } from '../../catalog/catalog.models';
import { LatestRedirectPage, REDIRECT } from './latest-redirect-page';

const appsFile: AppsFile = {
  generatedAt: '2026-11-03T00:00:00Z',
  apps: [
    {
      id: 'mobfighter',
      name: 'MobFighter',
      description: 'd',
      icon: 'data/icons/mobfighter.png',
      minAndroid: '7.1',
      releaseCount: 1,
      totalDownloads: 3,
      latest: {
        version: '1.0.18',
        tag: 'mobfighter-v1.0.18',
        publishedAt: '2026-11-02T00:00:00Z',
        notes: '',
        prerelease: false,
        apkName: 'mobfighter-1.0.18.apk',
        apkUrl: 'https://example.com/mobfighter-1.0.18.apk',
        sizeBytes: 1,
        downloads: 3,
        sha256: null,
      },
    },
  ],
};

describe('LatestRedirectPage', () => {
  async function render(id: string): Promise<{ element: HTMLElement; redirect: string[] }> {
    const redirect: string[] = [];
    TestBed.configureTestingModule({
      imports: [LatestRedirectPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: REDIRECT, useValue: (url: string) => redirect.push(url) },
      ],
    });
    const fixture = TestBed.createComponent(LatestRedirectPage);
    fixture.componentRef.setInput('id', id);
    TestBed.tick();
    TestBed.inject(HttpTestingController)
      .expectOne((request: HttpRequest<unknown>) => request.url === 'data/apps.json')
      .flush(appsFile);
    await fixture.whenStable();
    return { element: fixture.nativeElement as HTMLElement, redirect };
  }

  it('sends the browser to the newest APK once', async () => {
    const { element, redirect } = await render('mobfighter');
    expect(redirect).toEqual(['https://example.com/mobfighter-1.0.18.apk']);
    expect(element.textContent).toContain('Downloading MobFighter 1.0.18');
  });

  it('explains when the game does not exist', async () => {
    const { element, redirect } = await render('nope');
    expect(redirect).toEqual([]);
    expect(element.textContent).toContain('Game not found');
  });
});

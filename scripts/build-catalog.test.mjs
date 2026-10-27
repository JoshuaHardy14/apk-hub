import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { sortAndPickLatest, toRelease, validateCatalog } from './build-catalog.mjs';

function githubRelease(overrides = {}) {
  return {
    tag_name: 'mobfighter-v1.2.3',
    draft: false,
    prerelease: false,
    published_at: '2026-10-01T12:00:00Z',
    body: 'Notes',
    assets: [
      {
        name: 'mobfighter-1.2.3.apk',
        size: 1234,
        browser_download_url: 'https://example.com/mobfighter-1.2.3.apk',
        digest: 'sha256:abc123',
      },
    ],
    ...overrides,
  };
}

describe('toRelease', () => {
  it('maps a matching release', () => {
    assert.deepEqual(toRelease('mobfighter', githubRelease()), {
      version: '1.2.3',
      tag: 'mobfighter-v1.2.3',
      publishedAt: '2026-10-01T12:00:00Z',
      notes: 'Notes',
      prerelease: false,
      apkName: 'mobfighter-1.2.3.apk',
      apkUrl: 'https://example.com/mobfighter-1.2.3.apk',
      sizeBytes: 1234,
      sha256: 'abc123',
    });
  });

  it('ignores drafts, other apps and releases without an APK', () => {
    assert.equal(toRelease('mobfighter', githubRelease({ draft: true })), null);
    assert.equal(toRelease('otherapp', githubRelease()), null);
    assert.equal(toRelease('mobfighter', githubRelease({ assets: [] })), null);
  });

  it('does not match an app whose id is a prefix of another', () => {
    assert.equal(toRelease('mob', githubRelease()), null);
  });

  it('leaves sha256 empty when GitHub has no digest', () => {
    const release = githubRelease();
    delete release.assets[0].digest;
    assert.equal(toRelease('mobfighter', release).sha256, null);
  });
});

describe('sortAndPickLatest', () => {
  const older = { version: '1.0.0', publishedAt: '2026-01-01T00:00:00Z', prerelease: false };
  const newer = { version: '1.1.0', publishedAt: '2026-02-01T00:00:00Z', prerelease: false };
  const beta = { version: '1.2.0-beta', publishedAt: '2026-03-01T00:00:00Z', prerelease: true };

  it('sorts newest first and prefers stable releases for latest', () => {
    const { sorted, latest } = sortAndPickLatest([older, beta, newer]);
    assert.deepEqual(
      sorted.map((release) => release.version),
      ['1.2.0-beta', '1.1.0', '1.0.0'],
    );
    assert.equal(latest, newer);
  });

  it('falls back to a pre-release, then to null', () => {
    assert.equal(sortAndPickLatest([beta]).latest, beta);
    assert.equal(sortAndPickLatest([]).latest, null);
  });
});

describe('validateCatalog', () => {
  const app = {
    id: 'mobfighter',
    name: 'MobFighter',
    description: 'd',
    icon: 'icons/mobfighter.svg',
    minAndroid: '7.1',
  };

  it('accepts a valid catalog', () => {
    assert.doesNotThrow(() => validateCatalog([app]));
  });

  it('rejects bad ids, duplicates and missing fields', () => {
    assert.throws(() => validateCatalog([{ ...app, id: 'MobFighter' }]), /lowercase/);
    assert.throws(() => validateCatalog([app, app]), /Duplicate/);
    assert.throws(() => validateCatalog([{ ...app, name: '' }]), /missing "name"/);
  });
});

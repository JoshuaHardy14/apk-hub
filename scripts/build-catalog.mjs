// Generates the site's data files from catalog/apps.json and this repo's GitHub Releases.
//
// Output (site/public/data/):
//   apps.json                 every app plus its latest release
//   releases/<appId>.json     full release history for one app, newest first
//   icons/*                   copied from catalog/icons/
//
// Releases belong to an app by tag: "<appId>-v<version>", e.g. "mobfighter-v1.2.3".
//
// Usage:
//   node scripts/build-catalog.mjs            read releases from GitHub (GITHUB_TOKEN optional)
//   node scripts/build-catalog.mjs --sample   write fake releases for local development

import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogDir = path.join(rootDir, 'catalog');
const outDir = path.join(rootDir, 'site', 'public', 'data');
const defaultRepo = 'JoshuaHardy14/apk-hub';
const appIdPattern = /^[a-z0-9][a-z0-9-]*$/;

/** Throws if the catalog is malformed, so a bad edit fails the deploy instead of breaking the site. */
export function validateCatalog(apps) {
  if (!Array.isArray(apps)) {
    throw new Error('catalog/apps.json must be an array');
  }
  const seen = new Set();
  for (const app of apps) {
    for (const field of ['id', 'name', 'description', 'icon', 'minAndroid']) {
      if (typeof app[field] !== 'string' || app[field].length === 0) {
        throw new Error(`App ${JSON.stringify(app.id)} is missing "${field}"`);
      }
    }
    if (!appIdPattern.test(app.id)) {
      throw new Error(`App id "${app.id}" must be lowercase letters, digits and dashes`);
    }
    if (seen.has(app.id)) {
      throw new Error(`Duplicate app id "${app.id}"`);
    }
    seen.add(app.id);
  }
}

/**
 * Converts one GitHub release into the site's release shape, or returns null when the
 * release is a draft, belongs to another app, or has no APK attached.
 */
export function toRelease(appId, githubRelease) {
  const prefix = `${appId}-v`;
  if (githubRelease.draft || !githubRelease.tag_name.startsWith(prefix)) {
    return null;
  }
  const apk = githubRelease.assets.find((asset) => asset.name.endsWith('.apk'));
  if (!apk) {
    return null;
  }
  return {
    version: githubRelease.tag_name.slice(prefix.length),
    tag: githubRelease.tag_name,
    publishedAt: githubRelease.published_at,
    notes: githubRelease.body ?? '',
    prerelease: githubRelease.prerelease,
    apkName: apk.name,
    apkUrl: apk.browser_download_url,
    sizeBytes: apk.size,
    // GitHub computes a digest for newer uploads; older ones fall back to the .sha256 asset.
    sha256: apk.digest?.startsWith('sha256:') ? apk.digest.slice('sha256:'.length) : null,
  };
}

/** Newest first; the latest is the newest stable release, or the newest pre-release if none. */
export function sortAndPickLatest(releases) {
  const sorted = [...releases].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const latest = sorted.find((release) => !release.prerelease) ?? sorted[0] ?? null;
  return { sorted, latest };
}

async function fetchGithubReleases(repo, token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const releases = [];
  for (let page = 1; ; page++) {
    const url = `https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GET ${url} failed: ${response.status} ${await response.text()}`);
    }
    const batch = await response.json();
    releases.push(...batch);
    if (batch.length < 100) {
      return releases;
    }
  }
}

async function fillMissingSha256(release, githubRelease) {
  if (release.sha256) {
    return;
  }
  const shaAsset = githubRelease.assets.find((asset) => asset.name === `${release.apkName}.sha256`);
  if (!shaAsset) {
    return;
  }
  const response = await fetch(shaAsset.browser_download_url);
  if (response.ok) {
    release.sha256 = (await response.text()).trim().split(/\s+/)[0] || null;
  }
}

async function releasesFromGithub(app, githubReleases) {
  const releases = [];
  for (const githubRelease of githubReleases) {
    const release = toRelease(app.id, githubRelease);
    if (release) {
      await fillMissingSha256(release, githubRelease);
      releases.push(release);
    }
  }
  return releases;
}

function sampleReleases(app) {
  const versions = ['0.3.0', '0.2.1', '0.2.0'];
  return versions.map((version, index) => ({
    version,
    tag: `${app.id}-v${version}`,
    publishedAt: new Date(Date.UTC(2026, 9, 20 - index * 7)).toISOString(),
    notes: `Sample release notes for ${version}.\n- Fixed a bug\n- Improved performance`,
    prerelease: false,
    apkName: `${app.id}-${version}.apk`,
    apkUrl: '#sample-download',
    sizeBytes: 48_000_000 - index * 1_500_000,
    sha256: 'f'.repeat(64),
  }));
}

async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

async function main() {
  const sample = process.argv.includes('--sample');
  const apps = JSON.parse(await readFile(path.join(catalogDir, 'apps.json'), 'utf8'));
  validateCatalog(apps);

  const githubReleases = sample
    ? []
    : await fetchGithubReleases(
        process.env.GITHUB_REPOSITORY ?? defaultRepo,
        process.env.GITHUB_TOKEN,
      );

  await rm(outDir, { recursive: true, force: true });
  await mkdir(path.join(outDir, 'releases'), { recursive: true });
  await cp(path.join(catalogDir, 'icons'), path.join(outDir, 'icons'), { recursive: true });

  const appEntries = [];
  for (const app of apps) {
    const releases = sample ? sampleReleases(app) : await releasesFromGithub(app, githubReleases);
    const { sorted, latest } = sortAndPickLatest(releases);
    await writeJson(path.join(outDir, 'releases', `${app.id}.json`), {
      appId: app.id,
      releases: sorted,
    });
    appEntries.push({
      ...app,
      icon: `data/${app.icon}`,
      releaseCount: sorted.length,
      latest,
    });
    console.log(`${app.id}: ${sorted.length} release(s), latest ${latest?.version ?? 'none'}`);
  }

  await writeJson(path.join(outDir, 'apps.json'), {
    generatedAt: new Date().toISOString(),
    apps: appEntries,
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

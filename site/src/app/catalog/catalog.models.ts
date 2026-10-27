// Shapes of the JSON files written by scripts/build-catalog.mjs into public/data/.

/** One published build of an app. */
export interface Release {
  version: string;
  tag: string;
  publishedAt: string;
  notes: string;
  prerelease: boolean;
  apkName: string;
  apkUrl: string;
  sizeBytes: number;
  sha256: string | null;
}

/** An app listed on the site, with its newest release. */
export interface AppEntry {
  id: string;
  name: string;
  description: string;
  icon: string;
  minAndroid: string;
  releaseCount: number;
  latest: Release | null;
}

/** data/apps.json */
export interface AppsFile {
  generatedAt: string;
  apps: AppEntry[];
}

/** data/releases/<appId>.json */
export interface ReleasesFile {
  appId: string;
  releases: Release[];
}

# APK Hub

A download site for my Android apps: **https://joshuahardy14.github.io/apk-hub/**

- APKs are stored as **GitHub Releases** in this repo.
- The **Angular** site in `site/` lists every app and its versions.
- **GitHub Actions** rebuilds and redeploys the site to GitHub Pages from `main` whenever a release is published, edited or deleted, or `main` changes.

## How it fits together

```
app repo (e.g. ClaudeTest) ── push to main ──► build APK ──► gh release create mobfighter-v1.2.3 --repo JoshuaHardy14/apk-hub
                                                                              │
apk-hub ◄─────────────────────────────────────────────────────────────────────┘
  release event ──► release-redeploy.yml ──► deploy-site.yml on main
                   ──► scripts/build-catalog.mjs ──► site/public/data/*.json ──► ng build ──► GitHub Pages
```

### Release conventions

- Tag: `<appId>-v<version>`, e.g. `mobfighter-v1.2.3`
- Assets: one `.apk` (e.g. `mobfighter-1.2.3.apk`), plus an optional `<apk name>.sha256`
- The release body becomes "What's new" on the site
- Pre-releases are listed, but the "latest" download prefers the newest stable release

Releases must be created with a PAT or GitHub App token (not an app repo's own `GITHUB_TOKEN`), or the `release` event won't trigger a deploy.

Deploys always run from `main`. `release-redeploy.yml` reacts to the release and starts `deploy-site.yml` on `main`, because a Pages deployment made from a release's tag reports success but never becomes the live site.

## Adding an app

1. Add an entry to `catalog/apps.json`:
   ```json
   {
     "id": "myapp",
     "name": "My App",
     "description": "One line about the app.",
     "icon": "icons/myapp.svg",
     "minAndroid": "7.1"
   }
   ```
   `id` must be lowercase letters, digits and dashes.
2. Put the icon in `catalog/icons/` (SVG or PNG, square).
3. Have the app's build workflow publish releases here tagged `myapp-v<version>`.

## Local development

Requires Node 24.15+ (Angular 22).

```bash
node scripts/build-catalog.mjs --sample   # fake releases, no network needed
cd site
npm ci
npx ng serve                              # http://localhost:4200
```

Run `node scripts/build-catalog.mjs` without `--sample` to load the real releases. Set `GITHUB_TOKEN` to avoid GitHub's anonymous rate limit.

Tests:

```bash
node --test 'scripts/*.test.mjs'
cd site && npx ng test --watch=false
```

## One-time GitHub setup

- **Settings → Pages → Build and deployment → Source: GitHub Actions**
- The repo must stay **public** so Pages is free and APK downloads don't need a login.

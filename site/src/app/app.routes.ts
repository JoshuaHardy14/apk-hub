import { Routes } from '@angular/router';
import { AppDetailPage } from './pages/app-detail-page/app-detail-page';
import { HomePage } from './pages/home-page/home-page';
import { LatestRedirectPage } from './pages/latest-redirect-page/latest-redirect-page';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'APK Hub' },
  { path: 'apps/:id', component: AppDetailPage },
  // A permanent link that always downloads the newest APK of an app.
  { path: 'apps/:id/latest', component: LatestRedirectPage, title: 'Downloading… · APK Hub' },
  { path: '**', redirectTo: '' },
];

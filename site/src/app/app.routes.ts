import { Routes } from '@angular/router';
import { AppDetailPage } from './pages/app-detail-page/app-detail-page';
import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'APK Hub' },
  { path: 'apps/:id', component: AppDetailPage },
  { path: '**', redirectTo: '' },
];

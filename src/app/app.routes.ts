import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { UpcomingBookingPage } from './upcoming-booking/upcoming-booking.page';
import { authGuard, staffOnlyGuard, userOnlyGuard } from './guards/auth.guards';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login-form/login-form.component').then(
        (m) => m.LoginFormComponent
      ),
  },

  // utilisateur-only section
  {
    path: 'tabs',
    canActivate: [authGuard, userOnlyGuard],
    component: TabsPage,
    children: [
      {
        path: 'upcoming-booking',
        component: UpcomingBookingPage,
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile.page').then((m) => m.ProfilePage),
      },
      { path: '', redirectTo: 'upcoming-booking', pathMatch: 'full' },
    ],
  },

  // staff-only route
  {
    path: 'scanner',
    canActivate: [authGuard, staffOnlyGuard],
    loadComponent: () =>
      import('./scanner/scanner.page').then((m) => m.ScannerPage),
  },

  { path: '**', redirectTo: 'login' },
];

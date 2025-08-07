import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { UpcomingBookingPage } from './upcoming-booking/upcoming-booking.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login-form/login-form.component').then(
        (m) => m.LoginFormComponent
      ),
  },
  {
    path: 'tabs',
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
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.page').then((m) => m.ProfilePage),
  },
  // Optionally handle unknown routes
  // { path: '**', redirectTo: 'login' }
];

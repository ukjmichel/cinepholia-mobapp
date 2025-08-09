import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthFacade } from 'src/store/auth/auth.facade';

function isStaff(role?: string) {
  return role === 'employé' || role === 'administrateur';
}

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  return auth.isLogged() ? true : router.createUrlTree(['/login']);
};

export const userOnlyGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  if (!auth.isLogged()) return router.createUrlTree(['/login']);
  const role = auth.user()?.role;

  if (role === 'utilisateur') return true;
  return router.createUrlTree(['/scanner']); // send staff to scanner
};

export const staffOnlyGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  if (!auth.isLogged()) return router.createUrlTree(['/login']);
  const role = auth.user()?.role;

  if (isStaff(role)) return true;
  return router.createUrlTree(['/tabs']); // send utilisateur to their tabs
};

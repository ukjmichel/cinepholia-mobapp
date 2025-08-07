import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { environment } from '../../environments/environment';
import { AuthResponse } from 'src/app/models/auth.model';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /** Login effect */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) =>
        this.http
          .post<AuthResponse>(
            `${this.apiUrl}auth/login`,
            { emailOrUsername: email, password },
            { withCredentials: true }
          )
          .pipe(
            map((response) => AuthActions.loginSuccess(response)),
            catchError((error) =>
              of(
                AuthActions.loginFailure({
                  error:
                    error?.error?.message || error?.message || 'Login failed',
                })
              )
            )
          )
      )
    )
  );

  /** Register effect */
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ email, username, password, firstName, lastName }) =>
        this.http
          .post<AuthResponse>(
            `${this.apiUrl}auth/register`,
            { email, username, password, firstName, lastName },
            { withCredentials: true }
          )
          .pipe(
            map((response) => AuthActions.registerSuccess(response)),
            catchError((error) =>
              of(
                AuthActions.registerFailure({
                  error:
                    error?.error?.message ||
                    error?.message ||
                    'Registration failed',
                })
              )
            )
          )
      )
    )
  );

  /** Load current user (session check) effect */
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getUser),
      switchMap(() =>
        this.http
          .get<AuthResponse>(`${this.apiUrl}users/me`, {
            withCredentials: true,
          })
          .pipe(
            map((response) => AuthActions.getUserSuccess(response)),
            catchError((error) => {
              if (error.status === 401) {
                return of(AuthActions.refreshToken());
              }
              return of(
                AuthActions.getUserFailure({
                  error: 'Failed to fetch user data',
                })
              );
            })
          )
      )
    )
  );

  /**
   * Refresh token effect:
   * Calls /auth/refresh to get new tokens.
   * On success, tries to re-fetch current user info.
   * On failure, dispatches refreshTokenFailure.
   */
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() =>
        this.http
          .post(`${this.apiUrl}auth/refresh`, {}, { withCredentials: true })
          .pipe(
            tap((response) =>
              console.log('[AuthEffects] refreshToken response:', response)
            ),
            // On success, trigger a silent getUser (retries user fetch)
            map(() => AuthActions.getUser()),
            catchError((error) => {
              console.log('[AuthEffects] refreshToken error:', error);
              return of(AuthActions.refreshTokenFailure());
            })
          )
      )
    )
  );

  /**
   * Redirect after login or registration:
   * Navigates to returnUrl (or home) on successful login/registration.
   */
  redirectAfterAuth$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(() => {
          const returnUrl =
            this.router.routerState.snapshot.root.queryParamMap.get(
              'returnUrl'
            ) || '/';
          this.router.navigateByUrl(returnUrl);
        })
      ),
    { dispatch: false }
  );

  /**
   * Logout effect:
   * Calls logout API and navigates to login page.
   * Always redirects to /auth/login (even if API call fails).
   */
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() =>
          this.http
            .post(`${this.apiUrl}auth/logout`, {}, { withCredentials: true })
            .pipe(
              tap(() => this.router.navigate(['/auth/login'])),
              catchError(() => {
                this.router.navigate(['/auth/login']);
                return of();
              })
            )
        )
      ),
    { dispatch: false }
  );
}

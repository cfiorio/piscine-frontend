import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // inject() doit être au niveau racine de la fonction, dans le contexte d'injection
  const auth = inject(AuthService);

  const reqWithCredentials = req.clone({ withCredentials: true });

  return next(reqWithCredentials).pipe(
    catchError((error) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      // Ne pas tenter de refresh pour les routes d'authentification elles-mêmes
      if (req.url.includes('/auth/')) {
        return throwError(() => error);
      }

      // Tentative de refresh, puis retry de la requête originale
      return auth.refresh().pipe(
        switchMap(() => next(reqWithCredentials)),
        catchError((refreshError) => {
          auth.clearUser();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
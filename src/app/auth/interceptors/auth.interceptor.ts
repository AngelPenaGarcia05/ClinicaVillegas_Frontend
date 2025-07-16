import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import {
  catchError,
  switchMap,
  throwError,
  BehaviorSubject,
  filter,
  take,
  Observable
} from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const request = req.clone({
    withCredentials: true
  });

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const isLoginOrRefresh = req.url.endsWith('/auth/login') || req.url.endsWith('/auth/refresh');

      if (error.status === 401 && !isLoginOrRefresh) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(false);

          return authService.refreshAccessToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              refreshTokenSubject.next(true);
              return next(request.clone({ withCredentials: true }));
            }),
            catchError(refreshError => {
              isRefreshing = false;
              authService.logout();
              router.navigate(['/auth/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(success => success === true),
            take(1),
            switchMap(() => next(request.clone({ withCredentials: true })))
          );
        }
      }

      return throwError(() => error);
    })
  );
};

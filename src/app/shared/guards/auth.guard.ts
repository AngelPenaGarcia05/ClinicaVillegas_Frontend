import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles: string[] = route.data['roles'];

  return authService.fetchUser().pipe(
    map(user => {
      if (!user) {
        router.navigate(['/auth/login']);
        return false;
      }

      if (!allowedRoles || allowedRoles.length === 0) {
        return true;
      }

      const hasRole = allowedRoles.includes(user.rol);
      if (!hasRole) {
        router.navigate(['/403']);
      }
      return hasRole;
    }),
    catchError(() => {
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};

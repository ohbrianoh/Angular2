import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { UserService } from './user/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.user$.pipe(
    take(1), // Take the latest value and complete
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      }
      // Redirect to the login page if not logged in
      return router.createUrlTree(['/login']);
    })
  );
};

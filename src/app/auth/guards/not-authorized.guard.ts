import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../../services/user.service';

export const NotAuthorizedGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.userLoginData$.pipe(
    map((user) => {
      const isAuthorized = !!user

      if (!isAuthorized) {
        return router.createUrlTree(['auth']);
      }
      return true
    })
  );
};

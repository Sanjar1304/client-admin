import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { UserService } from '../services/user.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const userService = inject(UserService);
  const token = userService.getToken();

  if (token) request = request.clone({ headers: request.headers.set('x-auth-token', `${token}`) });
  return next(request);
};

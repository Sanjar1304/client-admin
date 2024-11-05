import {inject, Injectable} from '@angular/core';
import {UserService} from './user.service';

import {Observable, of} from 'rxjs';
import {spinnerState$$} from '../utils/spinner.util';
import {HttpErrorResponse} from '@angular/common/http';
import {BackendResponse} from '../types/response.type';
import {toast} from 'ngx-sonner';


@Injectable({
  providedIn: 'root'
})

export class HttpService {
  private _userService = inject(UserService);


  private showMessages(messages: string | string[]): void {
    if (typeof messages === 'string') {
      toast.error(messages || 'Что-то пошло не так...');
    } else if (Array.isArray(messages)) {
      messages.forEach(msg => toast.error(msg));
    }
  }

  handleResponse = <T>(response: BackendResponse<T>): T => {
    const { message } = response.result;

    if (message === 'Не авторизован' || response.result.code === 401) this._userService.logout();
    if (!response.success) this.showMessages(message);
    spinnerState$$.next(false);
    return response.result.data;
  };

  handleError = (err: HttpErrorResponse): Observable<null> => {
    this.showMessages(err.message);
    spinnerState$$.next(false);
    if (err.status === 401) this._userService.logout()
    return of(null);
  };
}

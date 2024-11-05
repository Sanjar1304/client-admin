import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {UserDataDto, UserInfoDto} from '../types/user.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userLoginData$$ = new BehaviorSubject<UserDataDto | null>(null);
  userInfo$$ = new BehaviorSubject<UserInfoDto | null>(null);
  userLoginData$ = this.userLoginData$$.asObservable();
  userInfo$ = this.userInfo$$.asObservable();

  constructor(private _router: Router) {}

  setUserData(data: any | null) {
    this.userLoginData$$.next(data.user);
    if (!data) return;
    this.setToken(data.access.accessToken);
    this.setUserLocalData(data.user);
    this._router.navigate(['loans']);
  }

  setToken = (token: string): void => {
    localStorage.setItem('token', token);
  };

  getToken(): string | null {
    return localStorage.getItem('token') || null;
  }

  setUserLocalData(data: UserDataDto): void {
    localStorage.setItem('user', JSON.stringify(data));
  }

  getUserLocalData(): string | null {
    return localStorage.getItem('user') || null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('x-fcm-token');
    localStorage.removeItem('user');
    this._router.navigate(['/auth']);
    this.userLoginData$$.next(null);
  }



}

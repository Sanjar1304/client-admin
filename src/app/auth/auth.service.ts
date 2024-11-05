import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, map, Observable} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {BackendResponse} from '../types/response.type';
import {HttpService} from '../services/https.service';
import {UserDataDto} from '../types/user.type';



@Injectable({
  providedIn: 'root',
})
export class AuthService {

private readonly API_URL = environment.API_BASE
  private _http = inject(HttpClient)
  private _https = inject(HttpService)
  userCheck(username: string): Observable<{ identity: string , message:string } | null> {
    return this._http.post<BackendResponse<{ identity: string , message:string }>>(`${this.API_URL}/auth/admin/sign/user/check`,{username}).pipe(
      map(this._https.handleResponse<{ identity: string , message:string }>),
      catchError(this._https.handleError)
    )
  }

  verifyUser(data:{identity: string; code: string}): Observable<{  identity: string , encryptKey: string ,isReg:boolean} | null> {
    return this._http.post<BackendResponse<{  identity: string , encryptKey: string ,isReg:boolean} >>(`${this.API_URL}/auth/admin/sign/user/verify`,data).pipe(
      map(this._https.handleResponse<{  identity: string , encryptKey: string ,isReg:boolean} >),
      catchError(this._https.handleError)
    )
  }
  signIn(obj:{password:string,identity:string}): Observable<UserDataDto | null> {
    return this._http.post<BackendResponse<UserDataDto>>(`${this.API_URL}/auth/admin/sign/in`, obj)
      .pipe(map(this._https.handleResponse<UserDataDto>),
        catchError(this._https.handleError)
      );
  }
}

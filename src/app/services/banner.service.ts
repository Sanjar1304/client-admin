import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpService} from './https.service';
import {catchError, map, Observable} from 'rxjs';
import {BackendResponse} from '../types/response.type';
import {environment} from '../../environments/environment.prod';
import {BannerCreateRequestDto, BannerDto, BannerList, BannerOneDto} from '../types/banner.type';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private readonly API_URL = environment.API_BASE
  private _http = inject(HttpClient)
  private _https = inject(HttpService)

  bannerList(page:number,size:number): Observable<BannerDto | null> {
    return this._http.post<BackendResponse<BannerDto>>(`${this.API_URL}/admin/banner/list`,{page,size}).pipe(
      map(this._https.handleResponse<BannerDto>),
      catchError(this._https.handleError)
    )
  }

  bannerCreate(payload:BannerCreateRequestDto): Observable<BannerDto | null> {
    return this._http.post<BackendResponse<BannerDto>>(`${this.API_URL}/admin/banner/create`,payload).pipe(
      map(this._https.handleResponse<BannerDto>),
      catchError(this._https.handleError)
    )
  }

  bannerUpdate(payload:BannerCreateRequestDto): Observable<BannerDto | null> {
    return this._http.post<BackendResponse<BannerDto>>(`${this.API_URL}/admin/banner/update`,payload).pipe(
      map(this._https.handleResponse<BannerDto>),
      catchError(this._https.handleError)
    )
  }
  bannerDelete(id:string): Observable< string | null> {
    return this._http.post<BackendResponse<string>>(`${this.API_URL}/admin/banner/delete`, {id}).pipe(
      map(this._https.handleResponse<string>),
      catchError(this._https.handleError)
    )
  }

  bannerOne(id:string): Observable< BannerOneDto | null> {
    return this._http.post<BackendResponse<BannerOneDto>>(`${this.API_URL}/admin/banner/one`, {id}).pipe(
      map(this._https.handleResponse<BannerOneDto>),
      catchError(this._https.handleError)
    )
  }
  getBannerType(): Observable<string[] | null> {
    return this._http.get<BackendResponse<string[]>>(`${this.API_URL}/admin/banner/type`).pipe(
      map(this._https.handleResponse<string[]>),
      catchError(this._https.handleError)
    )
  }
}

import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {HttpService} from './https.service';
import {catchError, map, Observable} from 'rxjs';
import {BannerDto} from '../types/banner.type';
import {BackendResponse} from '../types/response.type';
import {ProductListDto} from '../types/product.type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = environment.API_BASE
  private _http = inject(HttpClient)
  private _https = inject(HttpService)

  getProductType(type: string): Observable<string[] | null> {
    return this._http.get<BackendResponse<string[]>>(`${this.API_URL}/admin/product/${type}/type`).pipe(
      map(this._https.handleResponse<string[]>),
      catchError(this._https.handleError)
    )
  }
  productDelete(type: string,id:string): Observable<string | null> {
    return this._http.post<BackendResponse<string>>(`${this.API_URL}/admin/product/${type}/delete`,{id}).pipe(
      map(this._https.handleResponse<string>),
      catchError(this._https.handleError)
    )
  }

  productOne(type: string,id:string): Observable<string | null> {
    return this._http.post<BackendResponse<string>>(`${this.API_URL}/admin/product/${type}/one`,{id}).pipe(
      map(this._https.handleResponse<string>),
      catchError(this._https.handleError)
    )
  }

  productCreate(type: string, data: any): Observable<string[] | null> {
    return this._http.post<BackendResponse<string[]>>(`${this.API_URL}/admin/product/${type}/create`, data).pipe(
      map(this._https.handleResponse<string[]>),
      catchError(this._https.handleError)
    )
  }

  productList(type: string, page: number, size: number): Observable<ProductListDto | null> {
    return this._http.post<BackendResponse<ProductListDto>>(`${this.API_URL}/admin/product/${type}/list`, {
      page,
      size
    }).pipe(
      map(this._https.handleResponse<ProductListDto>),
      catchError(this._https.handleError)
    )
  }
}

import {inject, Injectable} from '@angular/core';
import {catchError, map, Observable} from 'rxjs';
import {BannerDto} from '../types/banner.type';
import {BackendResponse} from '../types/response.type';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {HttpService} from './https.service';
import {CarouselCreateDto, CarouselDto, CarouselOneDto, CarouselUpdateDto} from '../types/carousel.type';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private readonly API_URL = environment.API_BASE
  private _http = inject(HttpClient)
  private _https = inject(HttpService)

  carouselList(page: number, size: number): Observable<CarouselDto | null> {
    return this._http.post<BackendResponse<CarouselDto>>(`${this.API_URL}/admin/carousel/list`, {page, size}).pipe(
      map(this._https.handleResponse<CarouselDto>),
      catchError(this._https.handleError)
    )
  }

  getCarouselType(): Observable<string[] | null> {
    return this._http.get<BackendResponse<string[]>>(`${this.API_URL}/admin/carousel/type`).pipe(
      map(this._https.handleResponse<string[]>),
      catchError(this._https.handleError)
    )
  }

  carouselCreate(data: CarouselCreateDto): Observable<{ id: string } | null> {
    return this._http.post<BackendResponse<{ id: string }>>(`${this.API_URL}/admin/carousel/create`, data).pipe(
      map(this._https.handleResponse<{ id: string }>),
      catchError(this._https.handleError)
    )
  }

  carouselDelete(id: string): Observable<string | null> {
    return this._http.post<BackendResponse<string>>(`${this.API_URL}/admin/carousel/delete`, {id}).pipe(
      map(this._https.handleResponse<string>),
      catchError(this._https.handleError)
    )
  }

  carouselOne(id: string): Observable<CarouselOneDto | null> {
    return this._http.post<BackendResponse<CarouselOneDto>>(`${this.API_URL}/admin/carousel/one`, {id}).pipe(
      map(this._https.handleResponse<CarouselOneDto>),
      catchError(this._https.handleError)
    )
  }

  carouselUpdate(data: CarouselUpdateDto): Observable<{ id: string }  | null> {
    return this._http.post<BackendResponse<{ id: string } >>(`${this.API_URL}/admin/carousel/update`, data).pipe(
      map(this._https.handleResponse<{ id: string } >),
      catchError(this._https.handleError)
    )
  }

  getCarouselProductType(page: number, size: number, type: string | undefined): Observable<any | null> {
    return this._http.post<BackendResponse<any>>(`${this.API_URL}/admin/product/${type}/list`, {page, size}).pipe(
      map(this._https.handleResponse<any>),
      catchError(this._https.handleError)
    )
  }


}

import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {HttpService} from './https.service';
import {catchError, map, Observable} from 'rxjs';
import {BackendResponse} from '../types/response.type';
import {FaqCreateDto, FaqListDto, FaqOneDto} from '../types/faq.type';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private readonly API_URL = environment.API_BASE
  private _http = inject(HttpClient)
  private _https = inject(HttpService)

  faqList(page: number, size: number): Observable<FaqListDto | null> {
    return this._http.post<BackendResponse<FaqListDto>>(`${this.API_URL}/admin/faq/list`, {page, size}).pipe(
      map(this._https.handleResponse<FaqListDto>),
      catchError(this._https.handleError)
    )
  }

  faqDelete(id: string): Observable<string | null> {
    return this._http.post<BackendResponse<string>>(`${this.API_URL}/admin/faq/delete`, {id}).pipe(
      map(this._https.handleResponse<string>),
      catchError(this._https.handleError)
    )
  }

  faqOne(id: string): Observable<FaqOneDto | null> {
    return this._http.post<BackendResponse<FaqOneDto>>(`${this.API_URL}/admin/faq/one`, {id}).pipe(
      map(this._https.handleResponse<FaqOneDto>),
      catchError(this._https.handleError)
    )
  }

  faqCreate(data: FaqCreateDto): Observable<{ id: string } | null> {
    return this._http.post<BackendResponse<{ id: string }>>(`${this.API_URL}/admin/faq/create`, data).pipe(
      map(this._https.handleResponse<{ id: string }>),
      catchError(this._https.handleError)
    )
  }
  faqUpdate(data: FaqCreateDto): Observable<{ id: string } | null> {
    return this._http.post<BackendResponse<{ id: string }>>(`${this.API_URL}/admin/faq/update`, data).pipe(
      map(this._https.handleResponse<{ id: string }>),
      catchError(this._https.handleError)
    )
  }

  faqTypes(): Observable<string[] | null> {
    return this._http.get<BackendResponse<string[]>>(`${this.API_URL}/admin/faq/type`).pipe(
      map(this._https.handleResponse<string[]>),
      catchError(this._https.handleError)
    )
  }
}

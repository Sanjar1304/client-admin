import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {HttpService} from './https.service';
import {catchError, map, Observable} from 'rxjs';
import {BackendResponse} from '../types/response.type';
import {ReportDto, SectionOneDto, TopicDto} from '../types/report.type';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly API_URL = environment.API_BASE
  private _http = inject(HttpClient)
  private _https = inject(HttpService)

    sectionTopicDelete(type: string, id: string): Observable<string | null> {
    return this._http.post<BackendResponse<string>>(`${this.API_URL}/admin/report/${type}/delete`, {id}).pipe(
      map(this._https.handleResponse<string>),
      catchError(this._https.handleError)
    )
  }
  getSectionById(id: string): Observable<SectionOneDto | null> {
    return this._http.post<BackendResponse<SectionOneDto>>(`${this.API_URL}/admin/report/section/one`, {id}).pipe(
      map(this._https.handleResponse<SectionOneDto>),
      catchError(this._https.handleError)
    )
  }
  reportDelete(id: string): Observable<string | null> {
    return this._http.post<BackendResponse<string>>(`${this.API_URL}/admin/report/delete`, {id}).pipe(
      map(this._https.handleResponse<string>),
      catchError(this._https.handleError)
    )
  }

  topicCreate(data: any): Observable<{id:string,name:string} | null> {
    return this._http.post<BackendResponse<{id:string,name:string}>>(`${this.API_URL}/admin/report/topic/create`, data).pipe(
      map(this._https.handleResponse<{id:string,name:string}>),
      catchError(this._https.handleError)
    )
  }
  sectionCreate(data: any): Observable<{id:string} | null> {
    return this._http.post<BackendResponse<{id:string}>>(`${this.API_URL}/admin/report/section/create`, data).pipe(
      map(this._https.handleResponse<{id:string}>),
      catchError(this._https.handleError)
    )
  }
  sectionUpdate(data: any): Observable<{id:string} | null> {
    return this._http.post<BackendResponse<{id:string}>>(`${this.API_URL}/admin/report/section/update`, data).pipe(
      map(this._https.handleResponse<{id:string}>),
      catchError(this._https.handleError)
    )
  }
  reportCreate(data: any): Observable<{id:string,name:string} | null> {
    return this._http.post<BackendResponse<{id:string,name:string}>>(`${this.API_URL}/admin/report/create`, data).pipe(
      map(this._https.handleResponse<{id:string,name:string}>),
      catchError(this._https.handleError)
    )
  }


  reportList(page: number, size: number): Observable<ReportDto | null>  {
    return this._http.post<BackendResponse<ReportDto>>(`${this.API_URL}/admin/report/list`, {page, size}).pipe(
      map(this._https.handleResponse<ReportDto>),
      catchError(this._https.handleError)
    )
  }
  topicList(page: number, size: number): Observable<TopicDto | null>  {
    return this._http.post<BackendResponse<TopicDto>>(`${this.API_URL}/admin/report/topic/list`, {page, size}).pipe(
      map(this._https.handleResponse<TopicDto>),
      catchError(this._https.handleError)
    )
  }
}

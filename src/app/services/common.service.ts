import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpService} from './https.service';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {BackendResponse} from '../types/response.type';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private readonly API_URL = environment.API_BASE
  private _http = inject(HttpClient)
  private _https = inject(HttpService)

  fileUpload(file: FormData): Observable<{ url: string } | null> {

    return this._http.post<BackendResponse<{ url: string }>>(`https://store-api.madadinvestbank.uz/file/upload/general/web`, file,{
      headers:{
        "Authorization": "Basic bWFya2V0LWZyb250OjcwYXVLeE10UzZOSHhRQTQ="
      }
    }).pipe(
      map(this._https.handleResponse<{ url: string }>),
      catchError(this._https.handleError)
    )
  }
}

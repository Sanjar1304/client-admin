import {ApplicationConfig, provideExperimentalZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideNgxMask} from 'ngx-mask';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateService} from '@ngx-translate/core';
import {authInterceptor} from './interceptors/auth.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNgxMask(),
    {
      provide:TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
    TranslateService
  ]

};

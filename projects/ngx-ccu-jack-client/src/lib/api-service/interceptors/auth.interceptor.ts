import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CcuJackClientConfiguration } from './../../shared';
import { CcuJackClientConfigurationKey } from '../../shared/models.internal';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(@Inject(CcuJackClientConfigurationKey) private readonly configuration: CcuJackClientConfiguration) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.configuration.auth) {
      return next.handle(
        request.clone({
          headers: request.headers.set(
            'Authorization',
            'Basic ' + btoa(`${this.configuration.auth.user}:${this.configuration.auth.password}`)
          )
        })
      );
    }
    return next.handle(request);
  }
}

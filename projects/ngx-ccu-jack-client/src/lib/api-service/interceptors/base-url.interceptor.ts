import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CcuJackClientConfiguration } from './../../shared';
import { CcuJackClientConfigurationKey } from '../../shared/models.internal';

import { Observable } from 'rxjs';
@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor(@Inject(CcuJackClientConfigurationKey) private readonly configuration: CcuJackClientConfiguration) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const protocol = this.configuration.secureConnection ? 'https' : 'http';
    const requestUrl = `${protocol}://${this.configuration.hostnameOrIp}:${this.configuration.port}${request.url}`;
    request = request.clone({
      url: requestUrl
    });
    return next.handle(request);
  }
}

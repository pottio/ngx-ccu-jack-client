import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthInterceptor } from './api-service/interceptors/auth.interceptor';
import { BaseUrlInterceptor } from './api-service/interceptors/base-url.interceptor';
import { CcuJackClientConfiguration } from './shared';
import { CcuJackClientConfigurationKey } from './shared/models.internal';
import { MqttModule } from 'ngx-mqtt';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  exports: []
})
export class NgxCcuJackClientModule {
  static forRoot(configuration: CcuJackClientConfiguration): ModuleWithProviders<NgxCcuJackClientModule> {
    return {
      ngModule: NgxCcuJackClientModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BaseUrlInterceptor,
          multi: true
        },
        {
          provide: CcuJackClientConfigurationKey,
          useValue: configuration
        },
        ...(MqttModule.forRoot({
          hostname: configuration.hostnameOrIp,
          port: configuration.port,
          protocol: configuration.secureConnection ? 'wss' : 'ws',
          path: '/ws-mqtt',
          connectOnCreate: false
        }).providers ?? [])
      ]
    };
  }
}

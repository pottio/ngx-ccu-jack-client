<div align="center">
    <h1>ngx-ccu-jack-client</h1>
</div>

<p align="center">
This library offers the possibility to integrate a <a href="https://github.com/mdzio/ccu-jack">CCU-Jack</a> server quickly and easily into an <a href="https://angular.io/">Angular</a> application.
</p>

<p align="center">
  <a href="https://github.com/pottio/ngx-ccu-jack-client/actions/workflows/cd.yml"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/pottio/ngx-ccu-jack-client/CD?label=build%20%28CI%29"></a>
  <a href="https://github.com/pottio/ngx-ccu-jack-client/actions/workflows/ci.yml"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/pottio/ngx-ccu-jack-client/CI?label=deploy%20%28CD%29"></a>
  <a href="https://pottio.testspace.com/spaces/161106/"><img alt="Testspace tests" src="https://img.shields.io/testspace/tests/pottio/pottio:ngx-ccu-jack-client/master"></a>
  <a href="https://pottio.testspace.com/spaces/161106/current/Code%20Coverage?utm_campaign=badge&utm_medium=referral&utm_source=coverage"><img alt="Space Metric" src="https://pottio.testspace.com/spaces/161106/metrics/213108/badge?token=2c4e76925d37b20e82082a8d87a5dc5a1fa49049" /></a>
  <a href="https://www.npmjs.com/package/ngx-ccu-jack-client"><img alt="npm" src="https://img.shields.io/npm/v/ngx-ccu-jack-client"></a>
  <a href="https://github.com/pottio/ngx-ccu-jack-client/blob/master/LICENSE"><img alt="GitHub" src="https://img.shields.io/github/license/pottio/ngx-ccu-jack-client"></a>
</p>

<br/>

**Table of contents**

- [Requirements & Compatibility](#requirements--compatibility)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
  - [API](#api)
  - [MQTT](#mqtt)
  - [Sample Implementation](#sample-implementation)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Dependencies](#dependencies)

## Requirements & Compatibility

To connect `ngx-ccu-jack-client` with a backend a [CCU-Jack](https://github.com/mdzio/ccu-jack) server (installed as addon on a [CCU](https://homematic-ip.com/de/produkt/smart-home-zentrale-ccu3) or running as [Docker](https://www.docker.com/) container) is necessary. *Please make sure CCU-Jack and the CCU are [configured correctly](https://github.com/mdzio/ccu-jack#installation-als-add-on-auf-der-ccu).*

| ngx-ccu-jack-client |    Angular    |  CCU-Jack      |
| ------------------- | ------------- | -------------- |
| 1.0.x               | 13.x.x        | >= 2.0.26      |

## Getting Started

Install `ngx-ccu-jack-client` from npm:

``` bash
npm install ngx-ccu-jack-client --save
```

Import `NgxCcuJackClientModule` into `app.module.ts` and add your configuration:

```typescript
import { NgxCcuJackClientModule } from 'ngx-ccu-jack-client';
// imports ...

@NgModule({
  declarations: [
    AppComponent
    // components ...
  ],
  imports: [
    NgxCcuJackClientModule.forRoot({
      connectMqttOnInit: true,
      hostnameOrIp: 'your-hostname-or-ip',
      port: 2122,
      secureConnection: true,
      auth: { user: 'your-user', password: 'your-password' }
    })
    // modules ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Import `CcuJackApiService` and/or `CcuJackMqttService` in the needed component(s):

```typescript
import { CcuJackApiService, CcuJackMqttService } from 'ngx-ccu-jack-client';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private readonly ccuJackApiService: CcuJackApiService,
    private readonly ccuJackMqttService: CcuJackMqttService
  ) {}
}
```

## Documentation

### API

The `CcuJackApiService` is used to access the rest interface of [CCU-Jack](https://github.com/mdzio/ccu-jack). Master data of devices, rooms, functions, system variables and programs can be requested via this way. It is also possible to start a program and access and set the value of each data point. However, the `CcuJackMqttService` should be used to display the values of data points, as the values are immediately updated via this way if they are changed in the CCU.

[See detailed CcuJackApiService documentation](https://github.com/pottio/ngx-ccu-jack-client/blob/master/projects/ngx-ccu-jack-client/documentation-ccu-jack-api.md)

### MQTT

The `CcuJackMqttService` offers the possibility of a live connection of values of data points. In addition to that, values can be set and programs started.

[See detailed CcuJackMqttService documentation](https://github.com/pottio/ngx-ccu-jack-client/blob/master/projects/ngx-ccu-jack-client/documentation-ccu-jack-mqtt.md)

### Sample Implementation

[ngx-ccu-jack-client sample implementation](https://github.com/pottio/ngx-ccu-jack-client/tree/master/projects/sample-app)

## Troubleshooting

>I can not connect via ```MQTT``` due to SSL handshake error

In case of a self signed certificate make sure that your client has installed your root ca of the self signed certificate in the trusted root certificate store. In addition to that your self signed certificate should have the version 3 with subject alternative name if you access the CCU via IP and/or hostname. Finally your self signed certificate (and the private key) must be configured in the CCU and the CCU-Jack addon. See also [CCU-Jack TLS documentation](https://github.com/mdzio/ccu-jack#sicherer-zugriff-%C3%BCber-tls) for details.

>I can not get data via ```API``` due to CORS errors

It is important to use minimum the version 2.0.26 of CCU-Jack. Make sure CCU-Jack is [configured correctly](https://github.com/mdzio/ccu-jack#installation-als-add-on-auf-der-ccu). See also [CCU-Jack CORS documentation](https://github.com/mdzio/ccu-jack#cross-origin-resource-sharing-cors) for details.

## License

[MIT](../../LICENSE)

## Dependencies

- [@angular/common](https://github.com/angular/angular)
- [@angular/core](https://github.com/angular/angular)
- [ngx-mqtt](https://github.com/sclausen/ngx-mqtt)
- [tslib](https://github.com/microsoft/tslib)

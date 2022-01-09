<div align="center">
    <h1>ngx-ccu-jack-client</h1>
</div>

<p align="center">
This client offers the possibility to integrate a <a href="https://github.com/mdzio/ccu-jack">CCU-Jack</a> server quickly and easily into an <a href="https://angular.io/">Angular</a> application.
</p>

<p align="center">
Badges insert here
</p>

<br/>

link to sample app

**Table of contents**
- [Requirements & Compatibility](#requirements--compatibility)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
  - [API](#api)
  - [MQTT](#mqtt)
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

ggf. Bild / UML Diagramm

### MQTT
The `CcuJackMqttService` offers the possibility of a live connection of values of data points. In addition to that, values can be set and programs started.

## Troubleshooting

>SSL + MQTT

>Cors
## License

## Dependencies

- [@angular/common](https://github.com/angular/angular/blob/master/LICENSE)
- [@angular/core](https://github.com/angular/angular/blob/master/LICENSE)
- [ngx-mqtt](https://github.com/sclausen/ngx-mqtt/blob/master/LICENSE)
- [tslib](https://github.com/microsoft/tslib/blob/main/LICENSE.txt)
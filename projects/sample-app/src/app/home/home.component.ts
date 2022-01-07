import { CcuJackApiService, CcuJackMqttService } from 'ngx-ccu-jack-client';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fadeIn } from '../animations';
import { timer } from 'rxjs';

interface RootMenuItem {
  title: string;
  path: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  animations: [fadeIn]
})
export class HomeComponent {
  isInit = true;

  vendor$ = this.ccuApi.getVendorInformation();
  mqttConnectionState$ = this.ccuMqtt.connectionState$;

  displayedColumns: string[] = ['title'];
  readonly dataSource = new MatTableDataSource<RootMenuItem>([
    {
      title: 'Devices',
      path: '/device'
    },
    {
      title: 'Rooms',
      path: '/room'
    },
    {
      title: 'Functions',
      path: '/function'
    },
    {
      title: 'Programs',
      path: '/program'
    },
    {
      title: 'System Variables',
      path: '/sysvar'
    },
    {
      title: 'Vendor Information',
      path: '/vendor'
    }
  ]);

  constructor(private readonly ccuApi: CcuJackApiService, public readonly ccuMqtt: CcuJackMqttService) {
    const sub = timer(1000).subscribe(() => {
      this.isInit = false;
      sub.unsubscribe();
    });
  }
}

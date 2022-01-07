import {
  CcuDevice,
  CcuDeviceChannel,
  CcuDeviceDataPoint,
  CcuFunction,
  CcuProgram,
  CcuRoom,
  CcuSysVar
} from 'ngx-ccu-jack-client';
import { Component, Input } from '@angular/core';
import { fadeIn } from '../animations';

@Component({
  selector: 'app-property-view',
  templateUrl: 'property-view.component.html',
  animations: [fadeIn]
})
export class PropertyViewComponent {
  @Input() ccuObject!:
    | CcuDevice
    | CcuDeviceChannel
    | CcuDeviceDataPoint
    | CcuRoom
    | CcuFunction
    | CcuProgram
    | CcuSysVar;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  getKeys(): string[] {
    return this.ccuObject
      ? Object.keys(this.ccuObject).filter(
          (prop) =>
            prop !== 'deviceDataPointReferences' &&
            prop !== 'deviceChannelReferences' &&
            prop !== 'functionReferences' &&
            prop !== 'roomReferences' &&
            prop !== 'children'
        )
      : [];
  }

  getPropValue(prop: string): unknown {
    return JSON.stringify(this.ccuObject ? this.ccuObject[prop] : '');
  }
}

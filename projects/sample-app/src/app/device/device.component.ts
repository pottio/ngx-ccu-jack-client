import { CcuDevice, CcuJackApiService } from 'ngx-ccu-jack-client';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device',
  templateUrl: 'device.component.html'
})
export class DeviceComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  deviceAddress = '';
  device!: CcuDevice;
  references: unknown[] = [];

  constructor(private ccuApi: CcuJackApiService, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.deviceAddress = this.route.snapshot.paramMap.get('deviceAddress') ?? '';
    this.loadData();
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  loadData(): void {
    this.subscription = this.ccuApi.getDevice({ deviceAddress: this.deviceAddress }).subscribe((data) => {
      this.device = data;
      this.references = data.deviceChannelReferences;
    });
  }
}

import { CcuDeviceChannel, CcuJackApiService } from 'ngx-ccu-jack-client';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-channel',
  templateUrl: 'channel.component.html'
})
export class ChannelComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  deviceAddress = '';
  channelAddress = '';
  channel!: CcuDeviceChannel;
  references: unknown[] = [];
  roomReferences: unknown[] = [];
  functionReferences: unknown[] = [];
  constructor(private ccuApi: CcuJackApiService, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.deviceAddress = this.route.snapshot.paramMap.get('deviceAddress') ?? '';
    this.channelAddress = this.route.snapshot.paramMap.get('channelAddress') ?? '';
    this.loadData();
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  loadData(): void {
    this.subscription = this.ccuApi
      .getDeviceChannel({ deviceAddress: this.deviceAddress, channelAddress: this.channelAddress })
      .subscribe((data) => {
        this.channel = data;
        this.references = data.deviceDataPointReferences;
        this.roomReferences = data.roomReferences;
        this.functionReferences = data.functionReferences;
      });
  }
}

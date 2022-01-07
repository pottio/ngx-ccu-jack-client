import {
  CcuDeviceDataPoint,
  CcuDeviceDataPointReference,
  CcuDeviceDataPointValue,
  CcuJackApiService,
  CcuJackMqttService
} from 'ngx-ccu-jack-client';
import { CcuValueType, ValueDialogComponent } from '../value-dialog/value-dialog.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { fadeIn } from '../animations';

@Component({
  selector: 'app-data-point',
  templateUrl: 'data-point.component.html',
  animations: [fadeIn]
})
export class DataPointComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private valueSubscription!: Subscription;

  deviceAddress = '';
  channelAddress = '';
  dataPointAddress = '';
  dataPoint!: CcuDeviceDataPoint;
  dataPointReference!: CcuDeviceDataPointReference;
  dataPointValue!: CcuDeviceDataPointValue<CcuValueType>;
  dataPointValueMqtt$!: Observable<CcuDeviceDataPointValue<CcuValueType>>;
  isLoadingValue = false;

  constructor(
    private readonly ccuApi: CcuJackApiService,
    public readonly ccuMqtt: CcuJackMqttService,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.deviceAddress = this.route.snapshot.paramMap.get('deviceAddress') ?? '';
    this.channelAddress = this.route.snapshot.paramMap.get('channelAddress') ?? '';
    this.dataPointAddress = this.route.snapshot.paramMap.get('dataPointAddress') ?? '';
    this.dataPointReference = {
      deviceAddress: this.deviceAddress,
      channelAddress: this.channelAddress,
      dataPointAddress: this.dataPointAddress
    };
    this.dataPointValueMqtt$ = this.ccuMqtt.observeDeviceValue(this.dataPointReference);
    this.loadData();
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.valueSubscription) this.valueSubscription.unsubscribe();
  }

  loadData(): void {
    this.subscription = this.ccuApi.getDeviceDataPoint(this.dataPointReference).subscribe((data) => {
      this.dataPoint = data;
    });
    this.loadValue();
  }

  loadValue(): void {
    this.isLoadingValue = true;
    this.valueSubscription = this.ccuApi.getDeviceValue<CcuValueType>(this.dataPointReference).subscribe((data) => {
      this.dataPointValue = data;
      this.isLoadingValue = false;
    });
  }

  setValue(dataPointValue: CcuDeviceDataPointValue<CcuValueType>): void {
    const dialogRef = this.dialog.open(ValueDialogComponent, {
      width: '500px',
      data: { meta: this.dataPoint, value: dataPointValue }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (result.mode === 'api' || result.mode === 'apiSimple')
          this.ccuApi.setDeviceValue(this.dataPointReference, result.value, result.mode === 'apiSimple');
        if (result.mode === 'mqtt') this.ccuMqtt.setDeviceValue(this.dataPointReference, result.value);

        this.isLoadingValue = true;
        const sub = timer(1000).subscribe(() => {
          this.loadValue();
          sub.unsubscribe();
        });
      }
    });
  }
}

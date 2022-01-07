import {
  CcuJackApiService,
  CcuJackMqttService,
  CcuSysVar,
  CcuSysVarReference,
  CcuSysVarValue
} from 'ngx-ccu-jack-client';
import { CcuValueType, ValueDialogComponent } from '../value-dialog/value-dialog.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { fadeIn } from '../animations';

@Component({
  selector: 'app-sysvar',
  templateUrl: 'sysvar.component.html',
  animations: [fadeIn]
})
export class SysVarComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private valueSubscription!: Subscription;

  sysVarAddress = '';
  sysVar!: CcuSysVar;
  sysVarReference!: CcuSysVarReference;
  sysVarValue!: CcuSysVarValue<CcuValueType>;
  sysVarValueMqtt$!: Observable<CcuSysVarValue<CcuValueType>>;
  isLoadingValue = false;

  constructor(
    private readonly ccuApi: CcuJackApiService,
    public readonly ccuMqtt: CcuJackMqttService,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sysVarAddress = this.route.snapshot.paramMap.get('sysVarAddress') ?? '';
    this.sysVarReference = { sysVarAddress: this.sysVarAddress };
    this.sysVarValueMqtt$ = this.ccuMqtt.observeSysVarValue(this.sysVarReference);
    this.loadData();
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.valueSubscription) this.valueSubscription.unsubscribe();
  }

  loadData(): void {
    this.subscription = this.ccuApi.getSysVar({ sysVarAddress: this.sysVarAddress }).subscribe((data) => {
      this.sysVar = data;
    });
    this.loadValue();
  }

  loadValue(): void {
    this.isLoadingValue = true;
    this.valueSubscription = this.ccuApi.getSysVarValue<CcuValueType>(this.sysVarReference).subscribe((data) => {
      this.sysVarValue = data;
      this.isLoadingValue = false;
    });
  }

  setValue(sysVarValue: CcuSysVarValue<CcuValueType>): void {
    const dialogRef = this.dialog.open(ValueDialogComponent, {
      width: '500px',
      data: { meta: this.sysVar, value: sysVarValue }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (result.mode === 'api' || result.mode === 'apiSimple')
          this.ccuApi.setSysVarValue(this.sysVarReference, result.value, result.mode === 'apiSimple');
        if (result.mode === 'mqtt') this.ccuMqtt.setSysVarValue(this.sysVarReference, result.value);

        this.isLoadingValue = true;
        const sub = timer(1000).subscribe(() => {
          this.loadValue();
          sub.unsubscribe();
        });
      }
    });
  }
}

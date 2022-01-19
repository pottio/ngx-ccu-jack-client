import {
  CcuJackApiService,
  CcuJackMqttService,
  CcuProgram,
  CcuProgramReference,
  CcuProgramStatus
} from 'ngx-ccu-jack-client';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { fadeIn } from '../animations';

@Component({
  selector: 'app-program',
  templateUrl: 'program.component.html',
  animations: [fadeIn]
})
export class ProgramComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private valueSubscription!: Subscription;

  programAddress = '';
  program!: CcuProgram;
  programReference!: CcuProgramReference;
  programStatus!: CcuProgramStatus;
  programStatus$!: Observable<CcuProgramStatus>;
  isLoadingValue = false;

  constructor(
    public readonly ccuApi: CcuJackApiService,
    public readonly ccuMqtt: CcuJackMqttService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.programAddress = this.route.snapshot.paramMap.get('programAddress') ?? '';
    this.programReference = { programAddress: this.programAddress };
    this.programStatus$ = this.ccuMqtt.observeProgramStatus(this.programReference);
    this.loadData();
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.valueSubscription) this.valueSubscription.unsubscribe();
  }

  loadData(): void {
    this.subscription = this.ccuApi.getProgram({ programAddress: this.programAddress }).subscribe((data) => {
      this.program = data;
    });
    this.loadValue();
  }

  loadValue(): void {
    this.isLoadingValue = true;
    this.valueSubscription = this.ccuApi.getProgramStatus(this.programReference).subscribe((data) => {
      this.programStatus = data;
      this.isLoadingValue = false;
    });
  }

  startViaApi(simple: boolean): void {
    this.ccuApi.startProgram(this.programReference, simple);
    this.isLoadingValue = true;
    const sub = timer(1000).subscribe(() => {
      this.loadValue();
      sub.unsubscribe();
    });
  }

  startViaMqtt(): void {
    this.ccuMqtt.startProgram(this.programReference);
  }
}

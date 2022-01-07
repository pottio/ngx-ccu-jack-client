import { CcuFunction, CcuJackApiService } from 'ngx-ccu-jack-client';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-function',
  templateUrl: 'function.component.html'
})
export class FunctionComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  functionAddress = '';
  function!: CcuFunction;
  references: unknown[] = [];

  constructor(private ccuApi: CcuJackApiService, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.functionAddress = this.route.snapshot.paramMap.get('functionAddress') ?? '';
    this.loadData();
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  loadData(): void {
    this.subscription = this.ccuApi.getFunction({ functionAddress: this.functionAddress }).subscribe((data) => {
      this.function = data;
      this.references = data.deviceChannelReferences;
    });
  }
}

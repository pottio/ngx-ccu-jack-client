import { Component, OnDestroy, OnInit } from '@angular/core';
import { CcuJackApiService } from 'ngx-ccu-jack-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-functions',
  templateUrl: 'functions.component.html'
})
export class FunctionsComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  references: unknown[] = [];

  constructor(private ccuApi: CcuJackApiService) {}

  ngOnInit(): void {
    this.loadData();
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  loadData(): void {
    this.subscription = this.ccuApi.getFunctionReferences().subscribe((data) => {
      this.references = data;
    });
  }
}

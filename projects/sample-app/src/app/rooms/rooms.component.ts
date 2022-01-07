import { Component, OnDestroy, OnInit } from '@angular/core';
import { CcuJackApiService } from 'ngx-ccu-jack-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rooms',
  templateUrl: 'rooms.component.html'
})
export class RoomsComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  references: unknown[] = [];

  constructor(private readonly ccuApi: CcuJackApiService) {}

  ngOnInit(): void {
    this.loadData();
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  loadData(): void {
    this.subscription = this.ccuApi.getRoomReferences().subscribe((data) => {
      this.references = data;
    });
  }
}

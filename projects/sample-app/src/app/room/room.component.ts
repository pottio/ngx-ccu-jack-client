import { CcuJackApiService, CcuRoom } from 'ngx-ccu-jack-client';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: 'room.component.html'
})
export class RoomComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  roomAddress = '';
  room!: CcuRoom;
  references: unknown[] = [];

  constructor(private readonly ccuApi: CcuJackApiService, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.roomAddress = this.route.snapshot.paramMap.get('roomAddress') ?? '';
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  loadData(): void {
    this.subscription = this.ccuApi.getRoom({ roomAddress: this.roomAddress }).subscribe((data) => {
      this.room = data;
      this.references = data.deviceChannelReferences;
    });
  }
}

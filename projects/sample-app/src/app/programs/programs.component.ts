import { Component, OnDestroy, OnInit } from '@angular/core';
import { CcuJackApiService } from 'ngx-ccu-jack-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-programs',
  templateUrl: 'programs.component.html'
})
export class ProgramsComponent implements OnInit, OnDestroy {
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
    this.subscription = this.ccuApi.getProgramReferences().subscribe((data) => {
      this.references = data;
    });
  }
}

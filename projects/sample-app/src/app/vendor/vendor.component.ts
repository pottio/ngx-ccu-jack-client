import { CcuJackApiService, CcuVendorInformation, CcuVendorInformationDetails } from 'ngx-ccu-jack-client';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor',
  templateUrl: 'vendor.component.html'
})
export class VendorComponent implements OnInit, OnDestroy {
  private subscriptionVendor!: Subscription;
  private subscriptionVendorDetails!: Subscription;

  vendor!: CcuVendorInformation;
  vendorDetails!: CcuVendorInformationDetails;

  constructor(private readonly ccuApi: CcuJackApiService) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.subscriptionVendor) this.subscriptionVendor.unsubscribe();
    if (this.subscriptionVendorDetails) this.subscriptionVendorDetails.unsubscribe();
  }

  loadData(): void {
    this.subscriptionVendor = this.ccuApi.getVendorInformation().subscribe((data) => {
      this.vendor = data;
    });
    this.subscriptionVendorDetails = this.ccuApi.getVendorInformationDetails().subscribe((data) => {
      this.vendorDetails = data;
    });
  }
}

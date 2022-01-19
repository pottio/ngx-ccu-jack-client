import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fadeIn } from '../animations';

@Component({
  selector: 'app-ref-table',
  templateUrl: 'ref-table.component.html',
  animations: [fadeIn]
})
export class RefTableComponent implements AfterViewInit {
  @Input() title = '';
  @Input() displayedColumns: string[] = [];
  readonly dataSource = new MatTableDataSource<unknown>([]);
  @ViewChild(MatSort) sort!: MatSort;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  @Input() set data(value: unknown[]) {
    this.dataSource.data = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRouterLink(row?: any): string {
    if (row.deviceAddress) {
      let address = '/device/' + row['deviceAddress'];
      if (row.channelAddress) {
        address += '/' + row.channelAddress;
        if (row.dataPointAddress) {
          address += '/' + row.dataPointAddress;
        }
      }
      return address;
    }
    if (row.roomAddress) {
      return '/room/' + row.roomAddress;
    }
    if (row.functionAddress) {
      return '/function/' + row.functionAddress;
    }
    if (row.programAddress) {
      return '/program/' + row.programAddress;
    }
    if (row.sysVarAddress) {
      return '/sysvar/' + row.sysVarAddress;
    }
    return '';
  }
}

import { CcuDeviceDataPoint, CcuDeviceDataPointValue, CcuSysVar, CcuSysVarValue } from 'ngx-ccu-jack-client';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
export type CcuValueType = string | number | boolean;

@Component({
  selector: 'app-value-dialog',
  templateUrl: 'value-dialog.component.html'
})
export class ValueDialogComponent {
  newValue!: CcuValueType;

  constructor(
    public readonly dialogRef: MatDialogRef<ValueDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      meta: CcuDeviceDataPoint | CcuSysVar;
      value: CcuDeviceDataPointValue<CcuValueType> | CcuSysVarValue<CcuValueType>;
    }
  ) {
    this.newValue = this.data.value.value;
  }

  isBoolean(): boolean {
    return this.data.meta.type === 'BOOL';
  }

  isNumber(): boolean {
    return this.data.meta.type === 'FLOAT';
  }

  isString(): boolean {
    return this.data.meta.type === 'STRING';
  }

  isEnum(): boolean {
    return this.data.meta.type === 'ENUM';
  }

  isUnknown(): boolean {
    return !this.isBoolean() && !this.isNumber() && !this.isString() && !this.isEnum();
  }

  getValueList(): string[] {
    return this.data.meta.valueList ?? [];
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

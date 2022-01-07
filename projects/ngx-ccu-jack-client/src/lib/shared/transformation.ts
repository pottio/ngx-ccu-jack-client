import {
  CcuDeviceDataPointReference,
  CcuDeviceDataPointValue,
  CcuProgramReference,
  CcuProgramStatus,
  CcuSysVarReference,
  CcuSysVarValue
} from './models.public';
import { CcuJackValue } from './models.internal';

export abstract class TransformCcuJackValue {
  public static toDeviceDataPointValue<T>(
    ccuJackValue: CcuJackValue<T>,
    reference: CcuDeviceDataPointReference,
    source: 'api' | 'mqtt'
  ): CcuDeviceDataPointValue<T> {
    return {
      value: ccuJackValue.v,
      timestamp: new Date(ccuJackValue.ts),
      status: ccuJackValue.s,
      reference: reference,
      source: source
    } as CcuDeviceDataPointValue<T>;
  }
  public static toSysVarValue<T>(
    ccuJackValue: CcuJackValue<T>,
    reference: CcuSysVarReference,
    source: 'api' | 'mqtt'
  ): CcuSysVarValue<T> {
    return {
      value: ccuJackValue.v,
      timestamp: new Date(ccuJackValue.ts),
      status: ccuJackValue.s,
      reference: reference,
      source: source
    } as CcuSysVarValue<T>;
  }
  public static toProgramStatus(
    ccuJackValue: CcuJackValue<boolean>,
    reference: CcuProgramReference,
    source: 'api' | 'mqtt'
  ): CcuProgramStatus {
    return {
      value: ccuJackValue.v,
      timestamp: new Date(ccuJackValue.ts),
      status: ccuJackValue.s,
      reference: reference,
      source: source
    } as CcuProgramStatus;
  }
}

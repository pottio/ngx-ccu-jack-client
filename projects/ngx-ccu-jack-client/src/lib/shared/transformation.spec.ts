import { CcuDeviceDataPointReference, CcuProgramReference, CcuSysVarReference } from './models.public';
import { CcuJackValue } from './models.internal';
import { TransformCcuJackValue } from './transformation';

describe('TransformCcuJackValue', () => {
  const sut = TransformCcuJackValue;
  it('should transform CcuJackValue to CcuDeviceDataPointValue', () => {
    // arrange
    const ccuJackValue: CcuJackValue<any> = {
      ts: new Date(),
      v: 'value',
      s: 0
    };
    const deviceDataPointReference: CcuDeviceDataPointReference = {
      deviceAddress: 'device0',
      channelAddress: 'channel0',
      dataPointAddress: 'dataPointAddress0'
    };

    // act
    const transformedValue = sut.toDeviceDataPointValue<any>(ccuJackValue, deviceDataPointReference, 'api');

    // assert
    expect(transformedValue.value).toEqual(ccuJackValue.v);
    expect(transformedValue.timestamp).toEqual(ccuJackValue.ts);
    expect(transformedValue.status).toEqual(ccuJackValue.s);
    expect(transformedValue.reference).toEqual(deviceDataPointReference);
    expect(transformedValue.source).toEqual('api');
  });

  it('should transform CcuJackValue to CcuSysVarValue', () => {
    // arrange
    const ccuJackValue: CcuJackValue<any> = {
      ts: new Date(),
      v: 'value',
      s: 0
    };
    const sysVarReference: CcuSysVarReference = {
      sysVarAddress: 'sysvar0'
    };

    // act
    const transformedValue = sut.toSysVarValue<any>(ccuJackValue, sysVarReference, 'mqtt');

    // assert
    expect(transformedValue.value).toEqual(ccuJackValue.v);
    expect(transformedValue.timestamp).toEqual(ccuJackValue.ts);
    expect(transformedValue.status).toEqual(ccuJackValue.s);
    expect(transformedValue.reference).toEqual(sysVarReference);
    expect(transformedValue.source).toEqual('mqtt');
  });

  it('should transform CcuJackValue to CcuProgramStatus', () => {
    // arrange
    const ccuJackValue: CcuJackValue<any> = {
      ts: new Date(),
      v: 'value',
      s: 0
    };
    const programReference: CcuProgramReference = {
      programAddress: 'program0'
    };

    // act
    const transformedValue = sut.toProgramStatus(ccuJackValue, programReference, 'mqtt');

    // assert
    expect(transformedValue.value).toEqual(ccuJackValue.v);
    expect(transformedValue.timestamp).toEqual(ccuJackValue.ts);
    expect(transformedValue.status).toEqual(ccuJackValue.s);
    expect(transformedValue.reference).toEqual(programReference);
    expect(transformedValue.source).toEqual('mqtt');
  });
});

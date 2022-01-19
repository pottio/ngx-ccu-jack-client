import { CcuDeviceDataPointValue, CcuJackMqttConnectionState, CcuProgramStatus } from './../shared/models.public';
import { CcuJackClientConfiguration, CcuSysVarValue } from '../shared';
import { IMqttMessage, MqttConnectionState, MqttService } from 'ngx-mqtt';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';
import {
  mockDeviceLightBulbChannel0DataPointStateRef,
  mockProgramAllLightsOffRef,
  mockSysVarNightModeActiveRef
} from './../shared/models.mock';
import { BehaviorSubject } from 'rxjs';
import { CcuJackClientConfigurationKey } from '../shared/models.internal';
import { CcuJackMqttService } from './ccu-jack-mqtt.service';
import { TestBed } from '@angular/core/testing';
import { TextEncoder } from 'util';

const configuration = {
  hostnameOrIp: 'hostname',
  port: 2122,
  secureConnection: true,
  connectMqttOnInit: true,
  auth: {
    user: 'user',
    password: 'password'
  }
} as CcuJackClientConfiguration;

const createCcuJackMqttServiceForTest = (
  mockMqttService: MqttService,
  config?: CcuJackClientConfiguration
): CcuJackMqttService => {
  TestBed.configureTestingModule({
    imports: [],
    providers: [
      {
        provide: CcuJackClientConfigurationKey,
        useValue: config ? config : configuration
      },
      {
        provide: MqttService,
        useValue: instance(mockMqttService)
      },
      CcuJackMqttService
    ]
  });
  return TestBed.inject(CcuJackMqttService);
};

describe.only('CcuJackMqttServiceService', () => {
  const enc = new TextEncoder();
  let mockMqttService: MqttService;

  beforeEach(() => {
    mockMqttService = mock(MqttService);
    const connectionState = new BehaviorSubject<MqttConnectionState>(MqttConnectionState.CLOSED);
    when(mockMqttService.state).thenReturn(connectionState);
  });

  test('should be created', () => {
    const sut = createCcuJackMqttServiceForTest(mockMqttService);
    expect(sut).toBeTruthy();
  });

  describe('constructor', () => {
    test('should initialize connection state', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      sut.connectionState$.subscribe((state: CcuJackMqttConnectionState) => {
        expect(state).toBe(CcuJackMqttConnectionState.CLOSED);
      });
    });
    test('should connect to mqtt if configured', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService, {
        ...configuration,
        connectMqttOnInit: true,
        auth: undefined
      });
      expect(sut).toBeTruthy();
      verify(mockMqttService.connect()).once();
    });
    test('should not connect to mqtt if configured', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService, {
        ...configuration,
        connectMqttOnInit: false,
        auth: undefined
      });
      expect(sut).toBeTruthy();
      verify(mockMqttService.connect()).never();
    });
  });

  describe('connect', () => {
    test('should connect to mqtt with auth if configured', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService, {
        ...configuration,
        connectMqttOnInit: false,
        auth: { user: 'user', password: 'password' }
      });
      sut.connect();
      verify(mockMqttService.connect()).never();
      expect(JSON.stringify(capture(mockMqttService.connect).last())).toBe(
        JSON.stringify([{ username: 'user', password: 'password' }])
      );
      verify(mockMqttService.connect(anything())).once();
    });

    test('should connect to mqtt without auth if configured', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService, {
        ...configuration,
        connectMqttOnInit: false,
        auth: undefined
      });
      sut.connect();
      verify(mockMqttService.connect()).once();
      expect(JSON.stringify(capture(mockMqttService.connect).last())).toBe(JSON.stringify([]));
      verify(mockMqttService.connect(anything())).never();
    });
  });

  describe('disconnect', () => {
    test('should disconnect from mqtt', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      sut.disconnect();
      verify(mockMqttService.disconnect()).once();
    });
  });

  describe('observeCustom', () => {
    test('should observe custom topic from mqtt', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      sut.observeCustom('my/custom/topic');
      verify(mockMqttService.observe('my/custom/topic')).once();
    });
  });

  describe('publishCustom', () => {
    test('should publish custom topic / message to mqtt', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      sut.publishCustom('my/custom/topic', 'my data');
      verify(mockMqttService.unsafePublish('my/custom/topic', 'my data')).once();
    });
  });

  describe('observeDeviceValue', () => {
    test('should observe device value from mqtt', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      const message: IMqttMessage = {
        topic: `device/status/00123ABC456DEF/0/STATE`,
        payload: enc.encode(JSON.stringify({ ts: 1577836800000, v: true, s: 0 })),
        qos: 0,
        retain: false,
        dup: false,
        cmd: 'subscribe'
      };
      when(mockMqttService.observe(anyString())).thenReturn(new BehaviorSubject(message).asObservable());
      sut
        .observeDeviceValue<boolean>(mockDeviceLightBulbChannel0DataPointStateRef)
        .subscribe((dataPointValue: CcuDeviceDataPointValue<boolean>) => {
          expect(dataPointValue.source).toBe('mqtt');
          expect(dataPointValue.reference).toBe(mockDeviceLightBulbChannel0DataPointStateRef);
          expect(dataPointValue.status).toBe(0);
          expect(dataPointValue.timestamp).toBe(new Date(1577836800000));
          expect(dataPointValue.value).toBe(true);
        });
      verify(mockMqttService.observe(`device/status/00123ABC456DEF/0/STATE`)).once();
    });
  });

  describe('setDeviceValue', () => {
    test('should set device value to mqtt', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      sut.setDeviceValue<boolean>(mockDeviceLightBulbChannel0DataPointStateRef, true);
      expect(JSON.stringify(capture(mockMqttService.unsafePublish).last())).toBe(
        JSON.stringify([`device/set/00123ABC456DEF/0/STATE`, `{"v":true}`])
      );
      verify(mockMqttService.unsafePublish(anyString(), anyString())).once();
    });
  });

  describe('observeSysVarValue', () => {
    test('should observe sysvar value from mqtt', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      const message: IMqttMessage = {
        topic: `sysvar/status/1000`,
        payload: enc.encode(JSON.stringify({ ts: 1577836800000, v: true, s: 0 })),
        qos: 0,
        retain: false,
        dup: false,
        cmd: 'subscribe'
      };
      when(mockMqttService.observe(anyString())).thenReturn(new BehaviorSubject(message).asObservable());
      sut
        .observeSysVarValue<boolean>(mockSysVarNightModeActiveRef)
        .subscribe((sysVarValue: CcuSysVarValue<boolean>) => {
          expect(sysVarValue.source).toBe('mqtt');
          expect(sysVarValue.reference).toBe(mockSysVarNightModeActiveRef);
          expect(sysVarValue.status).toBe(0);
          expect(sysVarValue.timestamp).toBe(new Date(1577836800000));
          expect(sysVarValue.value).toBe(true);
        });
      verify(mockMqttService.observe(`sysvar/status/1000`)).once();
    });
  });

  describe('setSysVarValue', () => {
    test('should set sysvar value to mqtt', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      sut.setSysVarValue<boolean>(mockSysVarNightModeActiveRef, true);
      expect(JSON.stringify(capture(mockMqttService.unsafePublish).last())).toBe(
        JSON.stringify([`sysvar/set/1000`, `true`])
      );
      verify(mockMqttService.unsafePublish(anyString(), anyString())).once();
    });
  });

  describe('startSysVarValueSync', () => {
    test('should set sysvar sync command to mqtt', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      sut.startSysVarValueSync(mockSysVarNightModeActiveRef);
      expect(JSON.stringify(capture(mockMqttService.unsafePublish).last())).toBe(
        JSON.stringify([`sysvar/get/1000`, `true`])
      );
      verify(mockMqttService.unsafePublish(anyString(), anyString())).once();
    });
  });

  describe('startProgram', () => {
    test('should set program start command to mqtt', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      sut.startProgram(mockProgramAllLightsOffRef);
      expect(JSON.stringify(capture(mockMqttService.unsafePublish).last())).toBe(
        JSON.stringify([`program/set/1000`, `true`])
      );
      verify(mockMqttService.unsafePublish(anyString(), anyString())).once();
    });
  });

  describe('startProgramStatusSync', () => {
    test('should set program sync command to mqtt', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      sut.startProgramStatusSync(mockProgramAllLightsOffRef);
      expect(JSON.stringify(capture(mockMqttService.unsafePublish).last())).toBe(
        JSON.stringify([`program/get/1000`, `true`])
      );
      verify(mockMqttService.unsafePublish(anyString(), anyString())).once();
    });
  });

  describe('observeProgramStatus', () => {
    test('should observe program status value from mqtt', () => {
      const sut = createCcuJackMqttServiceForTest(mockMqttService);
      const message: IMqttMessage = {
        topic: `program/status/1000`,
        payload: enc.encode(JSON.stringify({ ts: 1577836800000, v: true, s: 0 })),
        qos: 0,
        retain: false,
        dup: false,
        cmd: 'subscribe'
      };
      when(mockMqttService.observe(anyString())).thenReturn(new BehaviorSubject(message).asObservable());
      sut.observeProgramStatus(mockProgramAllLightsOffRef).subscribe((programStatus: CcuProgramStatus) => {
        expect(programStatus.source).toBe('mqtt');
        expect(programStatus.reference).toBe(mockProgramAllLightsOffRef);
        expect(programStatus.status).toBe(0);
        expect(programStatus.timestamp).toBe(new Date(1577836800000));
        expect(programStatus.value).toBe(true);
      });
      verify(mockMqttService.observe(`program/status/1000`)).once();
    });
  });
});

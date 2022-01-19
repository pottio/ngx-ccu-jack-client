import {
  CcuDevice,
  CcuDeviceChannel,
  CcuDeviceDataPoint,
  CcuDeviceDataPointValue,
  CcuDeviceReference,
  CcuFunction,
  CcuFunctionReference,
  CcuJackClientConfiguration,
  CcuProgram,
  CcuProgramReference
} from '../shared';
import {
  CcuProgramStatus,
  CcuRoom,
  CcuRoomReference,
  CcuSysVar,
  CcuSysVarReference,
  CcuSysVarValue,
  CcuVendorInformation,
  CcuVendorInformationDetails
} from './../shared/models.public';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';
import {
  mockDeviceLightBulb,
  mockDeviceLightBulbChannel0,
  mockDeviceLightBulbChannel0DataPointState,
  mockDeviceLightBulbChannel0DataPointStateRef,
  mockDeviceLightBulbChannel0DataPointStateValueBoolean,
  mockDeviceLightBulbChannel0DataPointStateValueNumber,
  mockDeviceLightBulbChannel0DataPointStateValueString,
  mockDeviceLightBulbChannel0Ref,
  mockDeviceLightBulbRef,
  mockDeviceSensorRef,
  mockFunctionHeatingRef,
  mockFunctionLight,
  mockFunctionLightRef,
  mockProgramAllLightsOff,
  mockProgramAllLightsOffRef,
  mockProgramAllLightsOffStatus,
  mockProgramHeatingNightModeRef,
  mockRoomKitchenRef,
  mockRoomLiving,
  mockRoomLivingRef,
  mockSysVarNightModeActive,
  mockSysVarNightModeActiveRef,
  mockSysVarNightModeActiveValue,
  mockSysVarShutterModeRef,
  mockSysVarShutterModeValue,
  mockSysVarTempOutsideRef,
  mockSysVarTempOutsideValue,
  mockSysVarWeatherForecastRef,
  mockSysVarWeatherForecastValue,
  mockVendorInformation,
  mockVendorInformationDetails
} from '../shared/models.mock';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { BaseUrlInterceptor } from './interceptors/base-url.interceptor';
import { CcuJackApiService } from './ccu-jack-api.service';
import { CcuJackClientConfigurationKey } from '../shared/models.internal';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const getApiServiceTestModuleForConfig = (config: CcuJackClientConfiguration): TestModuleMetadata => {
  return {
    imports: [HttpClientTestingModule],
    providers: [
      CcuJackApiService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: BaseUrlInterceptor,
        multi: true
      },
      {
        provide: CcuJackClientConfigurationKey,
        useValue: config
      }
    ]
  };
};

describe('CcuJackApiServiceService', () => {
  let sut: CcuJackApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // arrange
    TestBed.configureTestingModule(
      getApiServiceTestModuleForConfig({
        hostnameOrIp: 'hostname',
        port: 2122,
        secureConnection: true,
        auth: {
          user: 'user',
          password: 'password'
        },
        connectMqttOnInit: true
      } as CcuJackClientConfiguration)
    );
    sut = TestBed.inject(CcuJackApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', () => {
    expect(sut).toBeTruthy();
  });

  describe('DEVICES', () => {
    describe('getDeviceReferences', () => {
      test('should get device references', () => {
        sut.getDeviceReferences().subscribe((resp: CcuDeviceReference[]) => {
          expect(resp.length).toBe(2);
          expect(resp).toEqual([mockDeviceLightBulbRef, mockDeviceSensorRef]);
        });

        const request = httpMock.expectOne('https://hostname:2122/device');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'CCU Devices',
          identifier: 'device',
          title: 'Devices',
          '~links': [
            { rel: 'device', href: '00123ABC456DEF', title: 'Light bulb' },
            { rel: 'device', href: '0000AAA111BBB', title: 'Heating sensor' }
          ]
        });
      });
    });

    describe('getDevice', () => {
      test('should get device for device reference', () => {
        sut.getDevice(mockDeviceLightBulbRef).subscribe((resp: CcuDevice) => {
          expect(resp).toEqual(mockDeviceLightBulb);
        });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'My light bulb',
          identifier: '00123ABC456DEF',
          title: 'Light bulb',
          interfaceType: 'Hm-interface',
          '~links': [
            { rel: 'channel', href: '0', title: 'Light bulb' },
            { rel: 'channel', href: '1', title: 'Light bulb status' }
          ]
        });
      });

      test('should get device for device address', () => {
        sut.getDevice('00123ABC456DEF').subscribe((resp: CcuDevice) => {
          expect(resp).toEqual(mockDeviceLightBulb);
        });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'My light bulb',
          identifier: '00123ABC456DEF',
          title: 'Light bulb',
          interfaceType: 'Hm-interface',
          '~links': [
            { rel: 'channel', href: '0', title: 'Light bulb' },
            { rel: 'channel', href: '1', title: 'Light bulb status' }
          ]
        });
      });
    });

    describe('getDeviceChannel', () => {
      test('should get device channel for channel reference', () => {
        sut.getDeviceChannel(mockDeviceLightBulbChannel0Ref).subscribe((resp: CcuDeviceChannel) => {
          expect(resp).toEqual(mockDeviceLightBulbChannel0);
        });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0');
        request.flush({
          description: 'Light bulb',
          identifier: '0',
          title: 'Light bulb',
          '~links': [
            { rel: 'parameter', href: 'STATE', title: 'Light bulb state' },
            { rel: 'room', href: '1000', title: 'Living Room' },
            { rel: 'function', href: '1000', title: 'Light' }
          ]
        });
      });

      test('should get device channel for channel address', () => {
        sut.getDeviceChannel('00123ABC456DEF/0').subscribe((resp: CcuDeviceChannel) => {
          expect(resp).toEqual(mockDeviceLightBulbChannel0);
        });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0');
        request.flush({
          description: 'Light bulb',
          identifier: '0',
          title: 'Light bulb',
          '~links': [
            { rel: 'parameter', href: 'STATE', title: 'Light bulb state' },
            { rel: 'room', href: '1000', title: 'Living Room' },
            { rel: 'function', href: '1000', title: 'Light' }
          ]
        });
      });
    });

    describe('getDeviceDataPoint', () => {
      test('should get device data point for device reference', () => {
        sut.getDeviceDataPoint(mockDeviceLightBulbChannel0DataPointStateRef).subscribe((resp: CcuDeviceDataPoint) => {
          expect(resp).toEqual(mockDeviceLightBulbChannel0DataPointState);
        });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'Light bulb state',
          control: 'c',
          default: false,
          flags: 1,
          id: 'STATE',
          identifier: 'STATE',
          maximum: true,
          minimum: false,
          mqttSetTopic: 'device/set/00123ABC456DEF/0/STATE',
          mqttStatusTopic: 'device/status/00123ABC456DEF/0/STATE',
          operations: 7,
          tabOrder: 0,
          title: 'Light bulb state',
          type: 'BOOL',
          unit: '',
          '~links': [
            { rel: 'channel', href: '..', title: 'Light bulb' },
            { rel: 'service', href: '~pv', title: 'PV Service' }
          ]
        });
      });

      test('should get device data point for device address', () => {
        sut.getDeviceDataPoint('00123ABC456DEF/0/STATE').subscribe((resp: CcuDeviceDataPoint) => {
          expect(resp).toEqual(mockDeviceLightBulbChannel0DataPointState);
        });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'Light bulb state',
          control: 'c',
          default: false,
          flags: 1,
          id: 'STATE',
          identifier: 'STATE',
          maximum: true,
          minimum: false,
          mqttSetTopic: 'device/set/00123ABC456DEF/0/STATE',
          mqttStatusTopic: 'device/status/00123ABC456DEF/0/STATE',
          operations: 7,
          tabOrder: 0,
          title: 'Light bulb state',
          type: 'BOOL',
          unit: '',
          '~links': [
            { rel: 'channel', href: '..', title: 'Light bulb' },
            { rel: 'service', href: '~pv', title: 'PV Service' }
          ]
        });
      });
    });

    describe('getDeviceValue', () => {
      test('should get device value of type boolean for device reference', () => {
        sut
          .getDeviceValue<boolean>(mockDeviceLightBulbChannel0DataPointStateRef)
          .subscribe((resp: CcuDeviceDataPointValue<boolean>) => {
            expect(resp).toEqual(mockDeviceLightBulbChannel0DataPointStateValueBoolean as any);
          });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: true, s: 0 });
      });

      test('should get device value of type number for device reference', () => {
        sut
          .getDeviceValue<number>(mockDeviceLightBulbChannel0DataPointStateRef)
          .subscribe((resp: CcuDeviceDataPointValue<number>) => {
            expect(resp).toEqual(mockDeviceLightBulbChannel0DataPointStateValueNumber as any);
          });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: 12.34, s: 0 });
      });

      test('should get device value of type string for device reference', () => {
        sut
          .getDeviceValue<string>(mockDeviceLightBulbChannel0DataPointStateRef)
          .subscribe((resp: CcuDeviceDataPointValue<string>) => {
            expect(resp).toEqual(mockDeviceLightBulbChannel0DataPointStateValueString as any);
          });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: 'my-value', s: 0 });
      });

      test('should get device value of type boolean for device address', () => {
        sut.getDeviceValue<boolean>('00123ABC456DEF/0/STATE').subscribe((resp: CcuDeviceDataPointValue<boolean>) => {
          expect(resp).toEqual(mockDeviceLightBulbChannel0DataPointStateValueBoolean as any);
        });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: true, s: 0 });
      });

      test('should get device value of type number for device address', () => {
        sut.getDeviceValue<number>('00123ABC456DEF/0/STATE').subscribe((resp: CcuDeviceDataPointValue<number>) => {
          expect(resp).toEqual(mockDeviceLightBulbChannel0DataPointStateValueNumber as any);
        });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: 12.34, s: 0 });
      });

      test('should get device value of type string for device address', () => {
        sut.getDeviceValue<string>('00123ABC456DEF/0/STATE').subscribe((resp: CcuDeviceDataPointValue<string>) => {
          expect(resp).toEqual(mockDeviceLightBulbChannel0DataPointStateValueString as any);
        });

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: 'my-value', s: 0 });
      });
    });

    describe('setDeviceValue', () => {
      test('should set device value of type boolean for device reference', () => {
        sut.setDeviceValue<boolean>(mockDeviceLightBulbChannel0DataPointStateRef, false);

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: false });

        request.flush('');
      });

      test('should set device value of type number for device reference', () => {
        sut.setDeviceValue<number>(mockDeviceLightBulbChannel0DataPointStateRef, 76.54);

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: 76.54 });

        request.flush('');
      });

      test('should set device value of type string for device reference', () => {
        sut.setDeviceValue<string>(mockDeviceLightBulbChannel0DataPointStateRef, 'my new value');

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: 'my new value' });

        request.flush('');
      });

      test('should set device value of type boolean for device address', () => {
        sut.setDeviceValue<boolean>('00123ABC456DEF/0/STATE', false);

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: false });

        request.flush('');
      });

      test('should set device value of type number for device address', () => {
        sut.setDeviceValue<number>('00123ABC456DEF/0/STATE', 76.54);

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: 76.54 });

        request.flush('');
      });

      test('should set device value of type string for device address', () => {
        sut.setDeviceValue<string>('00123ABC456DEF/0/STATE', 'my new value');

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: 'my new value' });

        request.flush('');
      });

      test('should set device value of type boolean for device reference with simple request', () => {
        sut.setDeviceValue<boolean>(mockDeviceLightBulbChannel0DataPointStateRef, false, true);

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv?writepv=false');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set device value of type number for device reference with simple request', () => {
        sut.setDeviceValue<number>(mockDeviceLightBulbChannel0DataPointStateRef, 76.54, true);

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv?writepv=76.54');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set device value of type string for device reference with simple request', () => {
        sut.setDeviceValue<string>(mockDeviceLightBulbChannel0DataPointStateRef, 'my new value', true);

        const request = httpMock.expectOne(
          'https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv?writepv=my+new+value'
        );
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set device value of type boolean for device address with simple request', () => {
        sut.setDeviceValue<boolean>('00123ABC456DEF/0/STATE', false, true);

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv?writepv=false');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set device value of type number for device address with simple request', () => {
        sut.setDeviceValue<number>('00123ABC456DEF/0/STATE', 76.54, true);

        const request = httpMock.expectOne('https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv?writepv=76.54');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set device value of type string for device address with simple request', () => {
        sut.setDeviceValue<string>('00123ABC456DEF/0/STATE', 'my new value', true);

        const request = httpMock.expectOne(
          'https://hostname:2122/device/00123ABC456DEF/0/STATE/~pv?writepv=my+new+value'
        );
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });
    });
  });

  describe('FUNCTIONS', () => {
    describe('getFunctionReferences', () => {
      test('should get function references', () => {
        sut.getFunctionReferences().subscribe((resp: CcuFunctionReference[]) => {
          expect(resp.length).toBe(2);
          expect(resp).toEqual([mockFunctionLightRef, mockFunctionHeatingRef]);
        });

        const request = httpMock.expectOne('https://hostname:2122/function');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'Functions of the ReGaHss',
          identifier: 'function',
          title: 'Functions',
          '~links': [
            { rel: 'function', href: '1000', title: 'Light' },
            { rel: 'function', href: '2000', title: 'Heating' }
          ]
        });
      });
    });

    describe('getFunction', () => {
      test('should get function for function reference', () => {
        sut.getFunction(mockFunctionLightRef).subscribe((resp: CcuFunction) => {
          expect(resp).toEqual(mockFunctionLight);
        });

        const request = httpMock.expectOne('https://hostname:2122/function/1000');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'Contains all lights',
          identifier: '1000',
          title: 'Light',
          '~links': [
            { rel: 'channel', href: '/device/00123ABC456DEF/0', title: 'Light bulb' },
            { rel: 'channel', href: '/device/00123ABC456DEF/1', title: 'Light bulb status' }
          ]
        });
      });

      test('should get function for function address', () => {
        sut.getFunction('1000').subscribe((resp: CcuFunction) => {
          expect(resp).toEqual(mockFunctionLight);
        });

        const request = httpMock.expectOne('https://hostname:2122/function/1000');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'Contains all lights',
          identifier: '1000',
          title: 'Light',
          '~links': [
            { rel: 'channel', href: '/device/00123ABC456DEF/0', title: 'Light bulb' },
            { rel: 'channel', href: '/device/00123ABC456DEF/1', title: 'Light bulb status' }
          ]
        });
      });
    });
  });

  describe('PROGRAMS', () => {
    describe('getProgramReferences', () => {
      test('should get program references', () => {
        sut.getProgramReferences().subscribe((resp: CcuProgramReference[]) => {
          expect(resp.length).toBe(2);
          expect(resp).toEqual([mockProgramAllLightsOffRef, mockProgramHeatingNightModeRef]);
        });

        const request = httpMock.expectOne('https://hostname:2122/program');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'Programs of the ReGaHss',
          identifier: 'program',
          title: 'Programs',
          '~links': [
            { rel: 'program', href: '1000', title: 'All lights off' },
            { rel: 'program', href: '2000', title: 'Heating night mode' }
          ]
        });
      });
    });

    describe('getProgram', () => {
      test('should get program for program reference', () => {
        sut.getProgram(mockProgramAllLightsOffRef).subscribe((resp: CcuProgram) => {
          expect(resp).toEqual(mockProgramAllLightsOff);
        });

        const request = httpMock.expectOne('https://hostname:2122/program/1000');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          active: true,
          mqttGetTopic: 'program/get/1000',
          mqttSetTopic: 'program/set/1000',
          mqttStatusTopic: 'program/status/1000',
          visible: true,
          description: 'Turns off all lights',
          identifier: '1000',
          title: 'All lights off',
          '~links': [{ rel: 'service', href: '~pv', title: 'PV Service' }]
        });
      });

      test('should get program for program address', () => {
        sut.getProgram('1000').subscribe((resp: CcuProgram) => {
          expect(resp).toEqual(mockProgramAllLightsOff);
        });

        const request = httpMock.expectOne('https://hostname:2122/program/1000');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          active: true,
          mqttGetTopic: 'program/get/1000',
          mqttSetTopic: 'program/set/1000',
          mqttStatusTopic: 'program/status/1000',
          visible: true,
          description: 'Turns off all lights',
          identifier: '1000',
          title: 'All lights off',
          '~links': [{ rel: 'service', href: '~pv', title: 'PV Service' }]
        });
      });
    });

    describe('getProgramStatus', () => {
      test('should get program status for program reference', () => {
        sut.getProgramStatus(mockProgramAllLightsOffRef).subscribe((resp: CcuProgramStatus) => {
          expect(resp).toEqual(mockProgramAllLightsOffStatus);
        });

        const request = httpMock.expectOne('https://hostname:2122/program/1000/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: true, s: 0 });
      });

      test('should get program status for program address', () => {
        sut.getProgramStatus('1000').subscribe((resp: CcuProgramStatus) => {
          expect(resp).toEqual(mockProgramAllLightsOffStatus);
        });

        const request = httpMock.expectOne('https://hostname:2122/program/1000/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: true, s: 0 });
      });
    });

    describe('startProgram', () => {
      test('should start program for program reference', () => {
        sut.startProgram(mockProgramAllLightsOffRef);

        const request = httpMock.expectOne('https://hostname:2122/program/1000/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: true });

        request.flush('');
      });

      test('should start program for program address', () => {
        sut.startProgram('1000');

        const request = httpMock.expectOne('https://hostname:2122/program/1000/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: true });

        request.flush('');
      });

      test('should start program for program reference with simple request', () => {
        sut.startProgram(mockProgramAllLightsOffRef, true);

        const request = httpMock.expectOne('https://hostname:2122/program/1000/~pv?writepv=true');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should start program for program address with simple request', () => {
        sut.startProgram('1000', true);

        const request = httpMock.expectOne('https://hostname:2122/program/1000/~pv?writepv=true');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });
    });
  });

  describe('ROOMS', () => {
    describe('getRoomReferences', () => {
      test('should get room references', () => {
        sut.getRoomReferences().subscribe((resp: CcuRoomReference[]) => {
          expect(resp.length).toBe(2);
          expect(resp).toEqual([mockRoomLivingRef, mockRoomKitchenRef]);
        });

        const request = httpMock.expectOne('https://hostname:2122/room');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'Rooms of the ReGaHss',
          identifier: 'room',
          title: 'Rooms',
          '~links': [
            { rel: 'room', href: '1000', title: 'Living Room' },
            { rel: 'room', href: '2000', title: 'Kitchen' }
          ]
        });
      });
    });

    describe('getRoom', () => {
      test('should get room for room reference', () => {
        sut.getRoom(mockRoomLivingRef).subscribe((resp: CcuRoom) => {
          expect(resp).toEqual(mockRoomLiving);
        });

        const request = httpMock.expectOne('https://hostname:2122/room/1000');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'My living room',
          identifier: '1000',
          title: 'Living Room',
          '~links': [
            { rel: 'channel', href: '/device/00123ABC456DEF/0', title: 'Light bulb' },
            { rel: 'channel', href: '/device/00123ABC456DEF/1', title: 'Light bulb status' },
            { rel: 'channel', href: '/device/0000AAA111BBB/0', title: 'Master' },
            { rel: 'channel', href: '/device/0000AAA111BBB/1', title: 'Status' }
          ]
        });
      });

      test('should get room for room address', () => {
        sut.getRoom('1000').subscribe((resp: CcuRoom) => {
          expect(resp).toEqual(mockRoomLiving);
        });

        const request = httpMock.expectOne('https://hostname:2122/room/1000');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'My living room',
          identifier: '1000',
          title: 'Living Room',
          '~links': [
            { rel: 'channel', href: '/device/00123ABC456DEF/0', title: 'Light bulb' },
            { rel: 'channel', href: '/device/00123ABC456DEF/1', title: 'Light bulb status' },
            { rel: 'channel', href: '/device/0000AAA111BBB/0', title: 'Master' },
            { rel: 'channel', href: '/device/0000AAA111BBB/1', title: 'Status' }
          ]
        });
      });
    });
  });

  describe('SYSVARS', () => {
    describe('getSysVarReferences', () => {
      test('should get sysvar references', () => {
        sut.getSysVarReferences().subscribe((resp: CcuSysVarReference[]) => {
          expect(resp.length).toBe(4);
          expect(resp).toEqual([
            mockSysVarNightModeActiveRef,
            mockSysVarTempOutsideRef,
            mockSysVarWeatherForecastRef,
            mockSysVarShutterModeRef
          ]);
        });

        const request = httpMock.expectOne('https://hostname:2122/sysvar');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'System variables of the ReGaHss',
          identifier: 'sysvar',
          title: 'System variables',
          '~links': [
            { rel: 'sysvar', href: '1000', title: 'NightModeActive' },
            { rel: 'sysvar', href: '2000', title: 'TempOutside' },
            { rel: 'sysvar', href: '3000', title: 'WeatherForecast' },
            { rel: 'sysvar', href: '4000', title: 'ShutterMode' }
          ]
        });
      });
    });

    describe('getSysVar', () => {
      test('should get sysvar for sysvar reference', () => {
        sut.getSysVar(mockSysVarNightModeActiveRef).subscribe((resp: CcuSysVar) => {
          expect(resp).toEqual(mockSysVarNightModeActive);
        });

        const request = httpMock.expectOne('https://hostname:2122/sysvar/1000');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'Night mode status',
          identifier: '1000',
          title: 'NightModeActive',
          mqttGetTopic: 'sysvar/get/1000',
          mqttSetTopic: 'sysvar/set/1000',
          mqttStatusTopic: 'sysvar/status/1000',
          operations: 7,
          type: 'BOOL',
          unit: '',
          default: false,
          minimum: false,
          maximum: true,
          '~links': [{ rel: 'service', href: '~pv', title: 'PV Service' }]
        });
      });

      test('should get sysvar for sysvar address', () => {
        sut.getSysVar('1000').subscribe((resp: CcuSysVar) => {
          expect(resp).toEqual(mockSysVarNightModeActive);
        });

        const request = httpMock.expectOne('https://hostname:2122/sysvar/1000');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'Night mode status',
          identifier: '1000',
          title: 'NightModeActive',
          mqttGetTopic: 'sysvar/get/1000',
          mqttSetTopic: 'sysvar/set/1000',
          mqttStatusTopic: 'sysvar/status/1000',
          operations: 7,
          type: 'BOOL',
          unit: '',
          default: false,
          minimum: false,
          maximum: true,
          '~links': [{ rel: 'service', href: '~pv', title: 'PV Service' }]
        });
      });
    });

    describe('getSysVarValue', () => {
      test('should get sysvar value of type boolean for sysvar reference', () => {
        sut.getSysVarValue<boolean>(mockSysVarNightModeActiveRef).subscribe((resp: CcuSysVarValue<boolean>) => {
          expect(resp).toEqual(mockSysVarNightModeActiveValue as any);
        });

        const request = httpMock.expectOne('https://hostname:2122/sysvar/1000/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: true, s: 0 });
      });

      test('should get sysvar value of type number for sysvar reference', () => {
        sut.getSysVarValue<number>(mockSysVarTempOutsideRef).subscribe((resp: CcuSysVarValue<number>) => {
          expect(resp).toEqual(mockSysVarTempOutsideValue as any);
        });

        const request = httpMock.expectOne('https://hostname:2122/sysvar/2000/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: 12.34, s: 0 });
      });

      test('should get sysvar value of type string for sysvar reference', () => {
        sut.getSysVarValue<string>(mockSysVarWeatherForecastRef).subscribe((resp: CcuSysVarValue<string>) => {
          expect(resp).toEqual(mockSysVarWeatherForecastValue as any);
        });

        const request = httpMock.expectOne('https://hostname:2122/sysvar/3000/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: 'cloudy', s: 0 });
      });

      test('should get sysvar value of type enum for sysvar reference', () => {
        sut.getSysVarValue<string>(mockSysVarShutterModeRef).subscribe((resp: CcuSysVarValue<string>) => {
          expect(resp).toEqual(mockSysVarShutterModeValue as any);
        });

        const request = httpMock.expectOne('https://hostname:2122/sysvar/4000/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: 'CLOSED', s: 0 });
      });

      test('should get sysvar value of type boolean for sysvar address', () => {
        sut.getSysVarValue<boolean>('1000').subscribe((resp: CcuSysVarValue<boolean>) => {
          expect(resp).toEqual(mockSysVarNightModeActiveValue as any);
        });

        const request = httpMock.expectOne('https://hostname:2122/sysvar/1000/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: true, s: 0 });
      });

      test('should get sysvar value of type number for sysvar address', () => {
        sut.getSysVarValue<number>('2000').subscribe((resp: CcuSysVarValue<number>) => {
          expect(resp).toEqual(mockSysVarTempOutsideValue as any);
        });

        const request = httpMock.expectOne('https://hostname:2122/sysvar/2000/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: 12.34, s: 0 });
      });

      test('should get sysvar value of type string for sysvar address', () => {
        sut.getSysVarValue<string>('3000').subscribe((resp: CcuSysVarValue<string>) => {
          expect(resp).toEqual(mockSysVarWeatherForecastValue as any);
        });

        const request = httpMock.expectOne('https://hostname:2122/sysvar/3000/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: 'cloudy', s: 0 });
      });

      test('should get sysvar value of type enum for sysvar address', () => {
        sut.getSysVarValue<string>('4000').subscribe((resp: CcuSysVarValue<string>) => {
          expect(resp).toEqual(mockSysVarShutterModeValue as any);
        });

        const request = httpMock.expectOne('https://hostname:2122/sysvar/4000/~pv');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({ ts: 1577836800000, v: 'CLOSED', s: 0 });
      });
    });

    describe('setSysVarValue', () => {
      test('should set sysvar value of type boolean for sysvar reference', () => {
        sut.setSysVarValue<boolean>(mockSysVarNightModeActiveRef, false);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/1000/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: false });

        request.flush('');
      });

      test('should set sysvar value of type number for sysvar reference', () => {
        sut.setSysVarValue<number>(mockSysVarTempOutsideRef, 76.54);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/2000/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: 76.54 });

        request.flush('');
      });

      test('should set sysvar value of type string for sysvar reference', () => {
        sut.setSysVarValue<string>(mockSysVarWeatherForecastRef, 'sunny');

        const request = httpMock.expectOne('https://hostname:2122/sysvar/3000/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: 'sunny' });

        request.flush('');
      });

      test('should set sysvar value of type enum for sysvar reference', () => {
        sut.setSysVarValue<string>(mockSysVarShutterModeRef, 'AUTO');

        const request = httpMock.expectOne('https://hostname:2122/sysvar/4000/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: 'AUTO' });

        request.flush('');
      });

      test('should set sysvar value of type boolean for sysvar address', () => {
        sut.setSysVarValue<boolean>('1000', false);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/1000/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: false });

        request.flush('');
      });

      test('should set sysvar value of type number for sysvar address', () => {
        sut.setSysVarValue<number>('2000', 76.54);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/2000/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: 76.54 });

        request.flush('');
      });

      test('should set sysvar value of type string for sysvar address', () => {
        sut.setSysVarValue<string>('3000', 'sunny');

        const request = httpMock.expectOne('https://hostname:2122/sysvar/3000/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: 'sunny' });

        request.flush('');
      });

      test('should set sysvar value of type enum for sysvar address', () => {
        sut.setSysVarValue<string>('4000', 'AUTO');

        const request = httpMock.expectOne('https://hostname:2122/sysvar/4000/~pv');
        expect(request.request.method).toBe('PUT');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.body).toEqual({ v: 'AUTO' });

        request.flush('');
      });

      test('should set sysvar value of type boolean for sysvar reference with simple request', () => {
        sut.setSysVarValue<boolean>(mockSysVarNightModeActiveRef, false, true);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/1000/~pv?writepv=false');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set sysvar value of type number for sysvar reference with simple request', () => {
        sut.setSysVarValue<number>(mockSysVarTempOutsideRef, 76.54, true);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/2000/~pv?writepv=76.54');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set sysvar value of type string for sysvar reference with simple request', () => {
        sut.setSysVarValue<string>(mockSysVarWeatherForecastRef, 'snow and rain', true);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/3000/~pv?writepv=snow+and+rain');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set sysvar value of type enum for sysvar reference with simple request', () => {
        sut.setSysVarValue<string>(mockSysVarShutterModeRef, 'OPEN', true);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/4000/~pv?writepv=OPEN');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set sysvar value of type boolean for sysvar address with simple request', () => {
        sut.setSysVarValue<boolean>('1000', false, true);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/1000/~pv?writepv=false');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set sysvar value of type number for sysvar address with simple request', () => {
        sut.setSysVarValue<number>('2000', 76.54, true);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/2000/~pv?writepv=76.54');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set sysvar value of type string for sysvar address with simple request', () => {
        sut.setSysVarValue<string>('3000', 'snow and rain', true);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/3000/~pv?writepv=snow+and+rain');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });

      test('should set sysvar value of type enum for sysvar address with simple request', () => {
        sut.setSysVarValue<string>('4000', 'OPEN', true);

        const request = httpMock.expectOne('https://hostname:2122/sysvar/4000/~pv?writepv=OPEN');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();

        request.flush('');
      });
    });
  });

  describe('VENDOR', () => {
    describe('getVendorInformation', () => {
      test('should get vendor information', () => {
        sut.getVendorInformation().subscribe((resp: CcuVendorInformation) => {
          expect(resp).toEqual(mockVendorInformation);
        });

        const request = httpMock.expectOne('https://hostname:2122/~vendor');
        expect(request.request.method).toBe('GET');
        expect(request.cancelled).toBeFalsy();
        expect(request.request.responseType).toEqual('json');

        request.flush({
          description: 'Information about the server and the vendor',
          identifier: '~vendor',
          serverDescription: 'REST/MQTT-Interface for the HomeMatic CCU',
          serverName: 'CCU-Jack',
          serverVersion: '1.0.0',
          title: 'Vendor Information',
          veapVersion: '1',
          vendorName: 'info@ccu-historian.de',
          '~links': [
            { rel: 'item', href: 'config', title: 'Configuration' },
            { rel: 'item', href: 'diagnostics', title: 'Diagnostics' },
            { rel: 'item', href: 'statistics', title: 'HTTP(S) Handler Statistics' },
            { rel: 'collection', href: '..', title: 'Root' }
          ]
        });
      });
    });

    describe('getVendorInformationDetails', () => {
      test('should get vendor information details', () => {
        sut.getVendorInformationDetails().subscribe((resp: CcuVendorInformationDetails) => {
          expect(resp).toEqual(mockVendorInformationDetails);
        });

        const requestVendorConfig = httpMock.expectOne('https://hostname:2122/~vendor/config/~pv');
        requestVendorConfig.flush('vendor_config_result');

        const requestVendorDiagnostics = httpMock.expectOne('https://hostname:2122/~vendor/diagnostics/~pv');
        requestVendorDiagnostics.flush('vendor_diagnostics');

        const requestVendorStatsErrorResponses = httpMock.expectOne(
          'https://hostname:2122/~vendor/statistics/errorResponses/~pv'
        );
        requestVendorStatsErrorResponses.flush(0);

        const requestVendorStatsRequestBytes = httpMock.expectOne(
          'https://hostname:2122/~vendor/statistics/requestBytes/~pv'
        );
        requestVendorStatsRequestBytes.flush(1);

        const requestVendorStatsRequests = httpMock.expectOne('https://hostname:2122/~vendor/statistics/requests/~pv');
        requestVendorStatsRequests.flush(2);

        const requestVendorStatsResponseBytes = httpMock.expectOne(
          'https://hostname:2122/~vendor/statistics/responseBytes/~pv'
        );
        requestVendorStatsResponseBytes.flush(3);
      });
    });
  });
});

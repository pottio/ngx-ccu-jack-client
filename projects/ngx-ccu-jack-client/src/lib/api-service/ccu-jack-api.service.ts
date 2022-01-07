import {
  CcuDevice,
  CcuDeviceChannel,
  CcuDeviceChannelAddressType,
  CcuDeviceChannelReference,
  CcuDeviceDataPoint,
  CcuDeviceDataPointAddressType,
  CcuDeviceDataPointReference,
  CcuDeviceDataPointValue,
  CcuDeviceReference,
  CcuFunction,
  CcuFunctionReference,
  CcuProgram,
  CcuProgramReference,
  CcuProgramStatus,
  CcuRoom,
  CcuRoomReference,
  CcuSysVar,
  CcuSysVarReference,
  CcuSysVarValue,
  CcuVendorInformation,
  CcuVendorInformationDetails
} from '../shared/models.public';
import { Observable, forkJoin, map } from 'rxjs';
import { CcuJackResultWithLinks } from './models.internal';
import { CcuJackValue } from '../shared/models.internal';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transform } from './transformation';
import { TransformCcuJackValue } from '../shared/transformation';

@Injectable({
  providedIn: 'root'
})
export class CcuJackApiService {
  constructor(private readonly httpClient: HttpClient) {}

  //#region Devices

  /**
   * Gets all device references.
   *
   * @returns list of device references
   */
  public getDeviceReferences(): Observable<CcuDeviceReference[]> {
    return this.httpClient.get<CcuJackResultWithLinks>(`/device`).pipe(
      map((result: CcuJackResultWithLinks) => {
        return Transform.resultLinksToReferences(result, 'device') as CcuDeviceReference[];
      })
    );
  }

  /**
   * Gets a specific device.
   *
   * @param addressOrReference>
   *  - device address as string ``` getDevice('00012AB345CDE6') ``` or
   *  - device reference object ``` getDevice({deviceAddress: '00012AB345CDE6'}) ```
   * @returns The device for given address or reference
   */
  public getDevice(addressOrReference: string | CcuDeviceReference): Observable<CcuDevice> {
    const reference: CcuDeviceReference =
      typeof addressOrReference === 'string' ? { deviceAddress: addressOrReference } : addressOrReference;
    return this.httpClient.get<CcuJackResultWithLinks>(`/device/${reference.deviceAddress}`).pipe(
      map((result: CcuJackResultWithLinks) => {
        const deviceChannelRefs = Transform.resultLinksToReferences(
          result,
          'channel',
          reference
        ) as CcuDeviceChannelReference[];
        return {
          ...Transform.resultToResultWithoutLinks(result),
          deviceChannelReferences: deviceChannelRefs
        } as CcuDevice;
      })
    );
  }

  /**
   * Gets a specific channel of a device.
   *
   * @param addressOrReference>
   *  - device channel address as string ``` getDeviceChannel('00012AB345CDE6/3') ``` or
   *  - device channel reference object ``` getDeviceChannel({deviceAddress: '00012AB345CDE6', channelAddress: '3'}) ```
   * @returns device channel for given address or reference
   */
  public getDeviceChannel(
    addressOrReference: CcuDeviceChannelAddressType | CcuDeviceChannelReference
  ): Observable<CcuDeviceChannel> {
    const reference: CcuDeviceChannelReference =
      typeof addressOrReference === 'string'
        ? { deviceAddress: addressOrReference.split('/')[0], channelAddress: addressOrReference.split('/')[1] }
        : addressOrReference;
    return this.httpClient
      .get<CcuJackResultWithLinks>(`/device/${reference.deviceAddress}/${reference.channelAddress}`)
      .pipe(
        map((result: CcuJackResultWithLinks) => {
          const deviceDataPointRefs = Transform.resultLinksToReferences(
            result,
            'parameter',
            reference
          ) as CcuDeviceDataPointReference[];
          const functionRefs = Transform.resultLinksToReferences(
            result,
            'function',
            reference
          ) as CcuFunctionReference[];
          const roomRefs = Transform.resultLinksToReferences(result, 'room', reference) as CcuRoomReference[];
          return {
            ...Transform.resultToResultWithoutLinks(result),
            deviceDataPointReferences: deviceDataPointRefs,
            functionReferences: functionRefs,
            roomReferences: roomRefs
          } as CcuDeviceChannel;
        })
      );
  }

  /**
   * Gets a specific data point of a device.
   *
   * @param addressOrReference>
   *  - device data point address as string ``` getDeviceDataPoint('00012AB345CDE6/3/STATE') ``` or
   *  - device data point reference object ``` getDeviceDataPoint({deviceAddress: '00012AB345CDE6', channelAddress: '3', dataPointAddress: 'STATE'}) ```
   * @returns device data point for given address or reference
   */
  public getDeviceDataPoint(
    addressOrReference: CcuDeviceDataPointAddressType | CcuDeviceDataPointReference
  ): Observable<CcuDeviceDataPoint> {
    const reference: CcuDeviceDataPointReference =
      typeof addressOrReference === 'string'
        ? {
            deviceAddress: addressOrReference.split('/')[0],
            channelAddress: addressOrReference.split('/')[1],
            dataPointAddress: addressOrReference.split('/')[2]
          }
        : addressOrReference;

    return this.httpClient
      .get<CcuJackResultWithLinks>(
        `/device/${reference.deviceAddress}/${reference.channelAddress}/${reference.dataPointAddress}`
      )
      .pipe(
        map((result: CcuJackResultWithLinks) => {
          return {
            ...Transform.resultToResultWithoutLinks(result)
          } as CcuDeviceDataPoint;
        })
      );
  }

  /**
   * Gets the current value of a data point of a device.
   *
   * @remarks This makes a one-time API call. It's recommended to use the {@link CcuJackMqttService} for monitoring a value with continuous updates.
   * @typeParam T type of the data point value (boolean, number, string)
   * @param addressOrReference>
   *  - device data point address as string ``` getDeviceValue<boolean>('00012AB345CDE6/3/STATE') ``` or
   *  - device data point reference object ``` getDeviceValue<boolean>({deviceAddress: '00012AB345CDE6', channelAddress: '3', dataPointAddress: 'STATE'}) ```
   * @returns current device data point value for given address or reference
   */
  public getDeviceValue<T>(
    addressOrReference: CcuDeviceDataPointAddressType | CcuDeviceDataPointReference
  ): Observable<CcuDeviceDataPointValue<T>> {
    const reference: CcuDeviceDataPointReference =
      typeof addressOrReference === 'string'
        ? {
            deviceAddress: addressOrReference.split('/')[0],
            channelAddress: addressOrReference.split('/')[1],
            dataPointAddress: addressOrReference.split('/')[2]
          }
        : addressOrReference;
    return this.httpClient
      .get<CcuJackValue<T>>(
        `/device/${reference.deviceAddress}/${reference.channelAddress}/${reference.dataPointAddress}/~pv`
      )
      .pipe(
        map((result: CcuJackValue<T>) => {
          return TransformCcuJackValue.toDeviceDataPointValue<T>(result, reference, 'api');
        })
      );
  }

  /**
   * Sets the given value to a data point of a device.
   *
   * @remarks Fire and forget. It's recommended to use the {@link CcuJackMqttService} for monitoring a value with continuous updates.
   * @typeParam T type of the data point value (boolean, number, string)
   * @param addressOrReference>
   *  - device data point address as string ``` setDeviceValue<boolean>('00012AB345CDE6/3/STATE', ...) ``` or
   *  - device data point reference object ``` setDeviceValue<boolean>({deviceAddress: '00012AB345CDE6', channelAddress: '3', dataPointAddress: 'STATE'}, ...) ```
   * @param value the new value of type T
   * @param simple if set to ```true``` it will make a GET request with url parameter instead of a PUT request to the backend. Default is ```false```
   */
  public setDeviceValue<T>(
    addressOrReference: CcuDeviceDataPointAddressType | CcuDeviceDataPointReference,
    value: T,
    simple = false
  ): void {
    const reference: CcuDeviceDataPointReference =
      typeof addressOrReference === 'string'
        ? {
            deviceAddress: addressOrReference.split('/')[0],
            channelAddress: addressOrReference.split('/')[1],
            dataPointAddress: addressOrReference.split('/')[2]
          }
        : addressOrReference;
    if (simple === true) {
      const sub = this.httpClient
        .get(
          `/device/${reference.deviceAddress}/${reference.channelAddress}/${
            reference.dataPointAddress
          }/~pv?writepv=${Transform.valueToUrlParam<T>(value)}`
        )
        .subscribe(() => sub.unsubscribe());
    } else {
      const sub = this.httpClient
        .put(`/device/${reference.deviceAddress}/${reference.channelAddress}/${reference.dataPointAddress}/~pv`, {
          v: value
        })
        .subscribe(() => sub.unsubscribe());
    }
  }

  //#endregion

  //#region Functions
  /**
   * Gets all function references.
   *
   * @returns list of function references
   */
  public getFunctionReferences(): Observable<CcuFunctionReference[]> {
    return this.httpClient.get<CcuJackResultWithLinks>(`/function`).pipe(
      map((result: CcuJackResultWithLinks) => {
        return Transform.resultLinksToReferences(result, 'function') as CcuFunctionReference[];
      })
    );
  }

  /**
   * Gets a specific function.
   *
   * @param addressOrReference>
   *  - function address as string ``` getFunction('1234') ``` or
   *  - function reference object ``` getFunction({functionAddress: '1234'}) ```
   * @returns The function for given address or reference
   */
  public getFunction(addressOrReference: string | CcuFunctionReference): Observable<CcuFunction> {
    const reference: CcuFunctionReference =
      typeof addressOrReference === 'string' ? { functionAddress: addressOrReference } : addressOrReference;
    return this.httpClient.get<CcuJackResultWithLinks>(`/function/${reference.functionAddress}`).pipe(
      map((result: CcuJackResultWithLinks) => {
        const channelRefs = Transform.resultLinksToReferences(
          result,
          'channel',
          reference
        ) as CcuDeviceChannelReference[];
        return {
          ...Transform.resultToResultWithoutLinks(result),
          deviceChannelReferences: channelRefs
        } as CcuFunction;
      })
    );
  }
  //#endregion

  //#region Programs
  /**
   * Gets all program references.
   *
   * @returns list of program references
   */
  public getProgramReferences(): Observable<CcuProgramReference[]> {
    return this.httpClient.get<CcuJackResultWithLinks>(`/program`).pipe(
      map((result: CcuJackResultWithLinks) => {
        return Transform.resultLinksToReferences(result, 'program') as CcuProgramReference[];
      })
    );
  }

  /**
   * Gets a specific program.
   *
   * @param addressOrReference>
   *  - program address as string ``` getProgram('12345') ``` or
   *  - program reference object ``` getProgram({programAddress: '12345'}) ```
   * @returns The program for given address or reference
   */
  public getProgram(addressOrReference: string | CcuProgramReference): Observable<CcuProgram> {
    const reference: CcuProgramReference =
      typeof addressOrReference === 'string' ? { programAddress: addressOrReference } : addressOrReference;
    return this.httpClient.get<CcuJackResultWithLinks>(`/program/${reference.programAddress}`).pipe(
      map((result: CcuJackResultWithLinks) => {
        return {
          ...Transform.resultToResultWithoutLinks(result)
        } as CcuProgram;
      })
    );
  }

  /**
   * Gets the status of a program.
   *
   * @param addressOrReference>
   *  - program address as string ``` getProgramStatus('12345') ``` or
   *  - program reference object ``` getProgramStatus({programAddress: '12345'}) ```
   * @returns The program status for given address or reference
   */
  public getProgramStatus(addressOrReference: string | CcuProgramReference): Observable<CcuProgramStatus> {
    const reference: CcuProgramReference =
      typeof addressOrReference === 'string' ? { programAddress: addressOrReference } : addressOrReference;
    return this.httpClient.get<CcuJackValue<boolean>>(`/program/${reference.programAddress}/~pv`).pipe(
      map((result: CcuJackValue<boolean>) => {
        return TransformCcuJackValue.toProgramStatus(result, reference, 'api');
      })
    );
  }

  /**
   * Starts a program.
   *
   * @remarks Fire and forget.
   * @param addressOrReference>
   *  - program address as string ``` startProgram('12345') ``` or
   *  - program reference object ``` startProgram({programAddress: '12345'}) ```
   * @param simple if set to ```true``` it will make a GET request with url parameter instead of a PUT request to the backend. Default is ```false```
   */
  public startProgram(addressOrReference: string | CcuProgramReference, simple = false): void {
    const reference: CcuProgramReference =
      typeof addressOrReference === 'string' ? { programAddress: addressOrReference } : addressOrReference;
    if (simple === true) {
      const sub = this.httpClient
        .get(`/program/${reference.programAddress}/~pv?writepv=true`)
        .subscribe(() => sub.unsubscribe());
    } else {
      const sub = this.httpClient
        .put(`/program/${reference.programAddress}/~pv`, { v: true })
        .subscribe(() => sub.unsubscribe());
    }
  }
  //#endregion

  //#region Rooms
  /**
   * Gets all room references.
   *
   * @returns list of room references
   */
  public getRoomReferences(): Observable<CcuRoomReference[]> {
    return this.httpClient.get<CcuJackResultWithLinks>(`/room`).pipe(
      map((result: CcuJackResultWithLinks) => {
        return Transform.resultLinksToReferences(result, 'room') as CcuRoomReference[];
      })
    );
  }

  /**
   * Gets a specific room.
   *
   * @param addressOrReference>
   *  - room address as string ``` getRoom('1234') ``` or
   *  - room reference object ``` getRoom({roomAddress: '1234'}) ```
   * @returns The room for given address or reference
   */
  public getRoom(addressOrReference: string | CcuRoomReference): Observable<CcuRoom> {
    const reference: CcuRoomReference =
      typeof addressOrReference === 'string' ? { roomAddress: addressOrReference } : addressOrReference;
    return this.httpClient.get<CcuJackResultWithLinks>(`/room/${reference.roomAddress}`).pipe(
      map((result: CcuJackResultWithLinks) => {
        const channelRefs = Transform.resultLinksToReferences(
          result,
          'channel',
          reference
        ) as CcuDeviceChannelReference[];
        return {
          ...Transform.resultToResultWithoutLinks(result),
          deviceChannelReferences: channelRefs
        } as CcuRoom;
      })
    );
  }
  //#endregion

  //#region SysVars
  /**
   * Gets all system variable references.
   *
   * @returns list of system variable references
   */
  public getSysVarReferences(): Observable<CcuSysVarReference[]> {
    return this.httpClient.get<CcuJackResultWithLinks>(`/sysvar`).pipe(
      map((result: CcuJackResultWithLinks) => {
        return Transform.resultLinksToReferences(result, 'sysvar') as CcuSysVarReference[];
      })
    );
  }

  /**
   * Gets a specific system variable.
   *
   * @param addressOrReference>
   *  - system variable address as string ``` getSysVar('12345') ``` or
   *  - system variable reference object ``` getSysVar({sysVarAddress: '12345'}) ```
   * @returns The system variable for given address or reference
   */
  public getSysVar(addressOrReference: string | CcuSysVarReference): Observable<CcuSysVar> {
    const reference: CcuSysVarReference =
      typeof addressOrReference === 'string' ? { sysVarAddress: addressOrReference } : addressOrReference;
    return this.httpClient.get<CcuJackResultWithLinks>(`/sysvar/${reference.sysVarAddress}`).pipe(
      map((result: CcuJackResultWithLinks) => {
        return {
          ...Transform.resultToResultWithoutLinks(result)
        } as CcuSysVar;
      })
    );
  }

  /**
   * Gets the current value of a system variable.
   *
   * @remarks This makes a one-time API call. It's recommended to use the {@link CcuJackMqttService} for monitoring a value with continuous updates.
   * @typeParam T type of the system variable value (boolean, number, string)
   * @param addressOrReference>
   *  - system variable address as string ``` getSysVarValue<boolean>('12345') ``` or
   *  - system variable reference object ``` getSysVarValue<boolean>({sysVarAddress: '12345'}) ```
   * @returns current system variable value for given address or reference
   */
  public getSysVarValue<T>(addressOrReference: string | CcuSysVarReference): Observable<CcuSysVarValue<T>> {
    const reference: CcuSysVarReference =
      typeof addressOrReference === 'string' ? { sysVarAddress: addressOrReference } : addressOrReference;
    return this.httpClient.get<CcuJackValue<T>>(`/sysvar/${reference.sysVarAddress}/~pv`).pipe(
      map((result: CcuJackValue<T>) => {
        return TransformCcuJackValue.toSysVarValue<T>(result, reference, 'api');
      })
    );
  }

  /**
   * Sets the given value to a system variable.
   *
   * @remarks Fire and forget. It's recommended to use the {@link CcuJackMqttService} for monitoring a value with continuous updates.
   * @typeParam T type of the system variable value (boolean, number, string)
   * @param addressOrReference>
   *  - system variable address as string ``` setSysVarValue<boolean>('12345', ...) ``` or
   *  - system variable reference object ``` setSysVarValue<boolean>({sysVarAddress: '12345'}, ...) ```
   * @param value the new value of type T
   * @param simple if set to ```true``` it will make a GET request with url parameter instead of a PUT request to the backend. Default is ```false```
   */
  public setSysVarValue<T>(addressOrReference: string | CcuSysVarReference, value: T, simple = false): void {
    const reference: CcuSysVarReference =
      typeof addressOrReference === 'string' ? { sysVarAddress: addressOrReference } : addressOrReference;

    if (simple === true) {
      const sub = this.httpClient
        .get(`/sysvar/${reference.sysVarAddress}/~pv?writepv=${Transform.valueToUrlParam<T>(value)}`)
        .subscribe(() => sub.unsubscribe());
    } else {
      const sub = this.httpClient
        .put(`/sysvar/${reference.sysVarAddress}/~pv`, { v: value })
        .subscribe(() => sub.unsubscribe());
    }
  }
  //#endregion

  //#region Vendor
  /**
   * Gets vendor information.
   *
   * @returns a couple of vendor information (e.g. server version)
   */
  public getVendorInformation(): Observable<CcuVendorInformation> {
    return this.httpClient.get<CcuJackResultWithLinks>(`/~vendor`).pipe(
      map((result: CcuJackResultWithLinks) => {
        return {
          ...Transform.resultToResultWithoutLinks(result)
        } as unknown as CcuVendorInformation;
      })
    );
  }

  /**
   * Gets detailed vendor information.
   *
   * @returns a couple of detailed vendor information like configuration, diagnostics and http statistics
   */
  public getVendorInformationDetails(): Observable<CcuVendorInformationDetails> {
    const configuration = this.httpClient.get<unknown>(`/~vendor/config/~pv?format=simple`);
    const diagnostics = this.httpClient.get<unknown>(`/~vendor/diagnostics/~pv?format=simple`);
    const httpErrorResponses = this.httpClient.get<unknown>(`/~vendor/statistics/errorResponses/~pv?format=simple`);
    const httpRequestBytes = this.httpClient.get<unknown>(`/~vendor/statistics/requestBytes/~pv?format=simple`);
    const httpRequests = this.httpClient.get<unknown>(`/~vendor/statistics/requests/~pv?format=simple`);
    const httpResponseBytes = this.httpClient.get<unknown>(`/~vendor/statistics/responseBytes/~pv?format=simple`);

    return forkJoin([
      configuration,
      diagnostics,
      httpErrorResponses,
      httpRequestBytes,
      httpRequests,
      httpResponseBytes
    ]).pipe(
      map((result: unknown[]) => {
        return {
          config: result[0],
          diagnostics: result[1],
          statistics: {
            httpErrorResponses: result[2],
            httpRequestBytes: result[3],
            httpRequests: result[4],
            httpResponseBytes: result[5]
          }
        } as CcuVendorInformationDetails;
      })
    );
  }
  //#endregion
}

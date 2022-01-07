import {
  CcuCustomMqttMessage,
  CcuDeviceDataPointReference,
  CcuDeviceDataPointValue,
  CcuJackClientConfiguration,
  CcuJackMqttConnectionState,
  CcuProgramReference,
  CcuProgramStatus,
  CcuSysVarReference,
  CcuSysVarValue
} from './../shared';
import { CcuJackClientConfigurationKey, CcuJackValue } from '../shared/models.internal';
import { IMqttMessage, MqttConnectionState, MqttService } from 'ngx-mqtt';
import { Inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Transform } from './transformation';
import { TransformCcuJackValue } from '../shared/transformation';

@Injectable({
  providedIn: 'root'
})
export class CcuJackMqttService {
  public readonly connectionState$: Observable<CcuJackMqttConnectionState>;

  constructor(
    private readonly mqtt: MqttService,
    @Inject(CcuJackClientConfigurationKey) private readonly configuration: CcuJackClientConfiguration
  ) {
    this.connectionState$ = this.mqtt.state.pipe(
      map((mqttState: MqttConnectionState) => Transform.mqttConnectionStateToCcuJackMqttConnectionState(mqttState))
    );
    if (configuration.connectMqttOnInit) {
      this.connect();
    }
  }

  /**
   * Connects to the mqtt broker.
   */
  public connect(): void {
    if (this.configuration.auth) {
      this.mqtt.connect({ username: this.configuration.auth.user, password: this.configuration.auth.password });
    } else {
      this.mqtt.connect();
    }
  }

  /**
   * Disconnects from the mqtt broker.
   */
  public disconnect(): void {
    this.mqtt.disconnect();
  }

  /**
   * Observes the message of a custom topic.
   *
   * @param topic custom mqtt topic
   * @returns mqtt message for given topic
   */
  public observeCustom(topic: string): Observable<CcuCustomMqttMessage> {
    return this.mqtt.observe(topic);
  }

  /**
   * Sets the given message to a custom topic.
   *
   * @remarks Fire and forget.
   * @param topic custom mqtt topic
   * @param message custom mqtt message
   */
  public publishCustom(topic: string, message: string): void {
    return this.mqtt.unsafePublish(topic, message);
  }

  /**
   * Observes the current value of a data point of a device.
   *
   * @typeParam T type of the data point value (boolean, number, string)
   * @param addressOrReference>
   *  - device data point address as string ``` observeDeviceValue<boolean>('00012AB345CDE6/3/STATE') ``` or
   *  - device data point reference object ``` observeDeviceValue<boolean>({deviceAddress: '00012AB345CDE6', channelAddress: '3', dataPointAddress: 'STATE'}) ```
   * @returns current device data point value for given address or reference
   */
  public observeDeviceValue<T>(reference: CcuDeviceDataPointReference): Observable<CcuDeviceDataPointValue<T>> {
    return this.mqtt
      .observe(`device/status/${reference.deviceAddress}/${reference.channelAddress}/${reference.dataPointAddress}`)
      .pipe(
        map((mqttMessage: IMqttMessage) => {
          return TransformCcuJackValue.toDeviceDataPointValue<T>(
            <CcuJackValue<T>>JSON.parse(mqttMessage.payload.toString()),
            reference,
            'mqtt'
          );
        })
      );
  }

  /**
   * Sets the given value to a data point of a device.
   *
   * @remarks Fire and forget.
   * @typeParam T type of the data point value (boolean, number, string)
   * @param addressOrReference>
   *  - device data point address as string ``` setDeviceValue<boolean>('00012AB345CDE6/3/STATE', ...) ``` or
   *  - device data point reference object ``` setDeviceValue<boolean>({deviceAddress: '00012AB345CDE6', channelAddress: '3', dataPointAddress: 'STATE'}, ...) ```
   * @param value the new value of type T
   */
  public setDeviceValue<T>(reference: CcuDeviceDataPointReference, value: T): void {
    this.mqtt.unsafePublish(
      `device/set/${reference.deviceAddress}/${reference.channelAddress}/${reference.dataPointAddress}`,
      `{"v":${value}}`
    );
  }

  /**
   * Observes the current value of a system variable.
   *
   * @remarks System variable will only be published when the description of the system variable contains the key word ```MQTT```. It is also possible to start a synchronization of the system variable before. See CCU-Jack documentation for details.
   * @typeParam T type of the system variable value (boolean, number, string)
   * @param addressOrReference>
   *  - system variable address as string ``` observeSysVarValue<boolean>('12345') ``` or
   *  - system variable reference object ``` observeSysVarValue<boolean>({sysVarAddress: '12345'}) ```
   * @returns current system variable value for given address or reference
   */
  public observeSysVarValue<T>(reference: CcuSysVarReference): Observable<CcuSysVarValue<T>> {
    return this.mqtt.observe(`sysvar/status/${reference.sysVarAddress}`).pipe(
      map((mqttMessage: IMqttMessage) => {
        return TransformCcuJackValue.toSysVarValue<T>(
          <CcuJackValue<T>>JSON.parse(mqttMessage.payload.toString()),
          reference,
          'mqtt'
        );
      })
    );
  }

  /**
   * Sets the given value to a system variable.
   *
   * @remarks Fire and forget.
   * @typeParam T type of the system variable value (boolean, number, string)
   * @param addressOrReference>
   *  - system variable address as string ``` setSysVarValue<boolean>('12345', ...) ``` or
   *  - system variable reference object ``` setSysVarValue<boolean>({sysVarAddress: '12345'}, ...) ```
   * @param value the new value of type T
   */
  public setSysVarValue<T>(reference: CcuSysVarReference, value: T): void {
    this.mqtt.unsafePublish(`sysvar/set/${reference.sysVarAddress}`, `${value}`);
  }

  /**
   * Triggers the synchronization of a system variable.
   *
   * @remarks Fire and forget.
   * @param addressOrReference>
   *  - system variable address as string ``` startSysVarValueSync('12345') ``` or
   *  - system variable reference object ``` startSysVarValueSync({sysVarAddress: '12345'}) ```
   */
  public startSysVarValueSync(reference: CcuSysVarReference): void {
    this.mqtt.unsafePublish(`sysvar/get/${reference.sysVarAddress}`, 'true');
  }

  /**
   * Starts a program.
   *
   * @remarks Fire and forget.
   * @param addressOrReference>
   *  - program address as string ``` startProgram('12345') ``` or
   *  - program reference object ``` startProgram({programAddress: '12345'}) ```
   */
  public startProgram(reference: CcuProgramReference): void {
    this.mqtt.unsafePublish(`program/set/${reference.programAddress}`, 'true');
  }

  /**
   * Triggers the synchronization of a program.
   *
   * @remarks Fire and forget.
   * @param addressOrReference>
   *  - program address as string ``` startProgramStatusSync('12345') ``` or
   *  - program reference object ``` startProgramStatusSync({programAddress: '12345'}) ```
   */
  public startProgramStatusSync(reference: CcuProgramReference): void {
    this.mqtt.unsafePublish(`program/get/${reference.programAddress}`, 'true');
  }

  /**
   * Observes the status of a program.
   *
   * @remarks Program status will not published by default. It is needed to start a synchronization of the program before.
   * @param addressOrReference>
   *  - program address as string ``` getProgramStatus('12345') ``` or
   *  - program reference object ``` getProgramStatus({programAddress: '12345'}) ```
   * @returns The program status for given address or reference
   */
  public observeProgramStatus(reference: CcuProgramReference): Observable<CcuProgramStatus> {
    return this.mqtt.observe(`program/status/${reference.programAddress}`).pipe(
      map((mqttMessage: IMqttMessage) => {
        return TransformCcuJackValue.toProgramStatus(
          <CcuJackValue<boolean>>JSON.parse(mqttMessage.payload.toString()),
          reference,
          'mqtt'
        );
      })
    );
  }
}

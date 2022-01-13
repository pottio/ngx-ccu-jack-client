# CcuJackMqttService Documentation

###### connect(): void
Connects to the mqtt broker.


###### disconnect(): void
Disconnects from the mqtt broker.


###### observeCustom(topic: string): Observable<CcuCustomMqttMessage>
Observes the message of a custom topic.

- **Parameters:**
  - **topic:** custom mqtt topic
- **Returns:** mqtt message for given topic

###### publishCustom(topic: string, message: string): void
Sets the given message to a custom topic.

*Fire and forget.*
- **Parameters:**
  - **topic:** custom mqtt topic
  - **message:** custom mqtt message

###### observeDeviceValue<T>(reference: CcuDeviceDataPointReference): Observable<CcuDeviceDataPointValue<T>>
Observes the current value of a data point of a device.

- **Type Parameter:** T type of the data point value (boolean, number, string)
- **Parameters:**
  - **addressOrReference:** device data point address as string ``` observeDeviceValue<boolean>('00012AB345CDE6/3/STATE') ``` or device data point reference object ``` observeDeviceValue<boolean>({deviceAddress: '00012AB345CDE6', channelAddress: '3', dataPointAddress: 'STATE'}) ```
- **Returns:** current device data point value for given address or reference

###### setDeviceValue<T>(reference: CcuDeviceDataPointReference, value: T): void
Sets the given value to a data point of a device.

*Fire and forget.*
- **Type Parameter:** T type of the data point value (boolean, number, string)
- **Parameters:**
  - **addressOrReference:** device data point address as string ``` setDeviceValue<boolean>('00012AB345CDE6/3/STATE', ...) ``` or device data point reference object ``` setDeviceValue<boolean>({deviceAddress: '00012AB345CDE6', channelAddress: '3', dataPointAddress: 'STATE'}, ...) ```
  - **value:** the new value of type T

###### observeSysVarValue<T>(reference: CcuSysVarReference): Observable<CcuSysVarValue<T>>
Observes the current value of a system variable.

*System variable will only be published when the description of the system variable contains the key word ```MQTT```. It is also possible to start a synchronization of the system variable before. See CCU-Jack documentation for details.*
- **Type Parameter:** T type of the system variable value (boolean, number, string)
- **Parameters:**
  - **addressOrReference:** system variable address as string ``` observeSysVarValue<boolean>('12345') ``` or system variable reference object ``` observeSysVarValue<boolean>({sysVarAddress: '12345'}) ```
- **Returns:** current system variable value for given address or reference

###### setSysVarValue<T>(reference: CcuSysVarReference, value: T): void
Sets the given value to a system variable.

*Fire and forget.*
- **Type Parameter:** T type of the system variable value (boolean, number, string)
- **Parameters:**
  - **addressOrReference:** system variable address as string ``` setSysVarValue<boolean>('12345', ...) ``` or system variable reference object ``` setSysVarValue<boolean>({sysVarAddress: '12345'}, ...) ```
  - **value:** the new value of type T

###### startSysVarValueSync(reference: CcuSysVarReference): void
Triggers the synchronization of a system variable.

*Fire and forget.*
- **Parameters:**
  - **addressOrReference:** system variable address as string ``` startSysVarValueSync('12345') ``` or system variable reference object ``` startSysVarValueSync({sysVarAddress: '12345'}) ```

###### startProgram(reference: CcuProgramReference): void
Starts a program.

*Fire and forget.*
- **Parameters:**
  - **addressOrReference:** program address as string ``` startProgram('12345') ``` or program reference object ``` startProgram({programAddress: '12345'}) ```

###### startProgramStatusSync(reference: CcuProgramReference): void
Triggers the synchronization of a program.

*Fire and forget.*
- **Parameters:**
  - **addressOrReference:** program address as string ``` startProgramStatusSync('12345') ``` or program reference object ``` startProgramStatusSync({programAddress: '12345'}) ```

###### observeProgramStatus(reference: CcuProgramReference): Observable<CcuProgramStatus>
Observes the status of a program.

*Program status will not published by default. It is needed to start a synchronization of the program before.*
- **Parameters:**
  - **addressOrReference:** program address as string ``` getProgramStatus('12345') ``` or program reference object ``` getProgramStatus({programAddress: '12345'}) ```
- **Returns:** The program status for given address or reference


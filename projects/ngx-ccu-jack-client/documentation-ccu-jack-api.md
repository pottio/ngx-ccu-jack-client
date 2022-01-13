# CcuJackApiService Documentation

###### getDeviceReferences(): Observable<CcuDeviceReference[]>
Gets all device references.

- **Returns:** list of device references

###### getDevice(addressOrReference: string | CcuDeviceReference): Observable<CcuDevice>
Gets a specific device.

- **Parameters:**
  - **addressOrReference:** device address as string ``` getDevice('00012AB345CDE6') ``` or device reference object ``` getDevice({deviceAddress: '00012AB345CDE6'}) ```
- **Returns:** The device for given address or reference

###### getDeviceChannel(addressOrReference: CcuDeviceChannelAddressType | CcuDeviceChannelReference): Observable<CcuDeviceChannel>
Gets a specific channel of a device.

- **Parameters:**
  - **addressOrReference:** device channel address as string ``` getDeviceChannel('00012AB345CDE6/3') ``` or device channel reference object ``` getDeviceChannel({deviceAddress: '00012AB345CDE6', channelAddress: '3'}) ```
- **Returns:** device channel for given address or reference

###### getDeviceDataPoint(addressOrReference: CcuDeviceDataPointAddressType | CcuDeviceDataPointReference): Observable<CcuDeviceDataPoint>
Gets a specific data point of a device.

- **Parameters:**
  - **addressOrReference:** device data point address as string ``` getDeviceDataPoint('00012AB345CDE6/3/STATE') ``` or device data point reference object ``` getDeviceDataPoint({deviceAddress: '00012AB345CDE6', channelAddress: '3', dataPointAddress: 'STATE'}) ```
- **Returns:** device data point for given address or reference

###### getDeviceValue<T>(addressOrReference: CcuDeviceDataPointAddressType | CcuDeviceDataPointReference): Observable<CcuDeviceDataPointValue<T>>
Gets the current value of a data point of a device.

*This makes a one-time API call. It's recommended to use the CcuJackMqttService for monitoring a value with continuous updates.*
- **Type Parameter:** T type of the data point value (boolean, number, string)
- **Parameters:**
  - **addressOrReference:** device data point address as string ``` getDeviceValue<boolean>('00012AB345CDE6/3/STATE') ``` or device data point reference object ``` getDeviceValue<boolean>({deviceAddress: '00012AB345CDE6', channelAddress: '3', dataPointAddress: 'STATE'}) ```
- **Returns:** current device data point value for given address or reference

###### setDeviceValue<T>(addressOrReference: CcuDeviceDataPointAddressType | CcuDeviceDataPointReference, value: T, simple = false): void
Sets the given value to a data point of a device.

*Fire and forget. It's recommended to use the CcuJackMqttService for monitoring a value with continuous updates.*
- **Type Parameter:** T type of the data point value (boolean, number, string)
- **Parameters:**
  - **addressOrReference:** device data point address as string ``` setDeviceValue<boolean>('00012AB345CDE6/3/STATE', ...) ``` or device data point reference object ``` setDeviceValue<boolean>({deviceAddress: '00012AB345CDE6', channelAddress: '3', dataPointAddress: 'STATE'}, ...) ```
  - **value:** the new value of type T
  - **simple:** if set to ```true``` it will make a GET request with url parameter instead of a PUT request to the backend. Default is ```false```

###### getFunctionReferences(): Observable<CcuFunctionReference[]>
Gets all function references.

- **Returns:** list of function references

###### getFunction(addressOrReference: string | CcuFunctionReference): Observable<CcuFunction>
Gets a specific function.

- **Parameters:**
  - **addressOrReference:** function address as string ``` getFunction('1234') ``` or function reference object ``` getFunction({functionAddress: '1234'}) ```
- **Returns:** The function for given address or reference

###### getProgramReferences(): Observable<CcuProgramReference[]>
Gets all program references.

- **Returns:** list of program references

###### getProgram(addressOrReference: string | CcuProgramReference): Observable<CcuProgram>
Gets a specific program.

- **Parameters:**
  - **addressOrReference:** program address as string ``` getProgram('12345') ``` or program reference object ``` getProgram({programAddress: '12345'}) ```
- **Returns:** The program for given address or reference

###### getProgramStatus(addressOrReference: string | CcuProgramReference): Observable<CcuProgramStatus>
Gets the status of a program.

- **Parameters:**
  - **addressOrReference:** program address as string ``` getProgramStatus('12345') ``` or program reference object ``` getProgramStatus({programAddress: '12345'}) ```
- **Returns:** The program status for given address or reference

###### startProgram(addressOrReference: string | CcuProgramReference, simple = false): void
Starts a program.

*Fire and forget.*
- **Parameters:**
  - **addressOrReference:** program address as string ``` startProgram('12345') ``` or program reference object ``` startProgram({programAddress: '12345'}) ```
  - **simple:** if set to ```true``` it will make a GET request with url parameter instead of a PUT request to the backend. Default is ```false```

###### getRoomReferences(): Observable<CcuRoomReference[]>
Gets all room references.

- **Returns:** list of room references

###### getRoom(addressOrReference: string | CcuRoomReference): Observable<CcuRoom>
Gets a specific room.

- **Parameters:**
  - **addressOrReference:** room address as string ``` getRoom('1234') ``` or room reference object ``` getRoom({roomAddress: '1234'}) ```
- **Returns:** The room for given address or reference

###### getSysVarReferences(): Observable<CcuSysVarReference[]>
Gets all system variable references.

- **Returns:** list of system variable references

###### getSysVar(addressOrReference: string | CcuSysVarReference): Observable<CcuSysVar>
Gets a specific system variable.

- **Parameters:**
  - **addressOrReference:** system variable address as string ``` getSysVar('12345') ``` or system variable reference object ``` getSysVar({sysVarAddress: '12345'}) ```
- **Returns:** The system variable for given address or reference

###### getSysVarValue<T>(addressOrReference: string | CcuSysVarReference): Observable<CcuSysVarValue<T>>
Gets the current value of a system variable.

*This makes a one-time API call. It's recommended to use the CcuJackMqttService for monitoring a value with continuous updates.*
- **Type Parameter:** T type of the system variable value (boolean, number, string)
- **Parameters:**
  - **addressOrReference:** system variable address as string ``` getSysVarValue<boolean>('12345') ``` or system variable reference object ``` getSysVarValue<boolean>({sysVarAddress: '12345'}) ```
- **Returns:** current system variable value for given address or reference

###### setSysVarValue<T>(addressOrReference: string | CcuSysVarReference, value: T, simple = false): void
Sets the given value to a system variable.

*Fire and forget. It's recommended to use the CcuJackMqttService for monitoring a value with continuous updates.*
- **Type Parameter:** T type of the system variable value (boolean, number, string)
- **Parameters:**
  - **addressOrReference:** system variable address as string ``` setSysVarValue<boolean>('12345', ...) ``` or system variable reference object ``` setSysVarValue<boolean>({sysVarAddress: '12345'}, ...) ```
  - **value:** the new value of type T
  - **simple:** if set to ```true``` it will make a GET request with url parameter instead of a PUT request to the backend. Default is ```false```

###### getVendorInformation(): Observable<CcuVendorInformation>
Gets vendor information.

- **Returns:** a couple of vendor information (e.g. server version)

###### getVendorInformationDetails(): Observable<CcuVendorInformationDetails>
Gets detailed vendor information.

- **Returns:** a couple of detailed vendor information like configuration, diagnostics and http statistics


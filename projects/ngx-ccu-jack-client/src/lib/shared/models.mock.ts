import {
  CcuDevice,
  CcuDeviceChannel,
  CcuDeviceChannelReference,
  CcuDeviceDataPoint,
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
} from './models.public';

// Refs
export const mockRoomLivingRef: CcuRoomReference = { title: 'Living Room', roomAddress: '1000' };
export const mockRoomKitchenRef: CcuRoomReference = { title: 'Kitchen', roomAddress: '2000' };
export const mockFunctionLightRef: CcuFunctionReference = { title: 'Light', functionAddress: '1000' };
export const mockFunctionHeatingRef: CcuFunctionReference = { title: 'Heating', functionAddress: '2000' };
export const mockProgramAllLightsOffRef: CcuProgramReference = { title: 'All lights off', programAddress: '1000' };
export const mockProgramHeatingNightModeRef: CcuProgramReference = {
  title: 'Heating night mode',
  programAddress: '2000'
};
export const mockSysVarNightModeActiveRef: CcuSysVarReference = { title: 'NightModeActive', sysVarAddress: '1000' };
export const mockSysVarTempOutsideRef: CcuSysVarReference = { title: 'TempOutside', sysVarAddress: '2000' };
export const mockSysVarWeatherForecastRef: CcuSysVarReference = { title: 'WeatherForecast', sysVarAddress: '3000' };
export const mockSysVarShutterModeRef: CcuSysVarReference = { title: 'ShutterMode', sysVarAddress: '4000' };
export const mockDeviceLightBulbRef: CcuDeviceReference = { deviceAddress: '00123ABC456DEF', title: 'Light bulb' };
export const mockDeviceLightBulbChannel0Ref: CcuDeviceChannelReference = {
  title: 'Light bulb',
  deviceAddress: '00123ABC456DEF',
  channelAddress: '0'
};
export const mockDeviceLightBulbChannel1Ref: CcuDeviceChannelReference = {
  title: 'Light bulb status',
  deviceAddress: '00123ABC456DEF',
  channelAddress: '1'
};
export const mockDeviceLightBulbChannel0DataPointStateRef: CcuDeviceDataPointReference = {
  title: 'Light bulb state',
  deviceAddress: '00123ABC456DEF',
  channelAddress: '0',
  dataPointAddress: 'STATE'
};
export const mockDeviceLightBulbChannel1DataPointStateRef: CcuDeviceDataPointReference = {
  title: 'Light bulb state',
  deviceAddress: '00123ABC456DEF',
  channelAddress: '1',
  dataPointAddress: 'STATE'
};
export const mockDeviceSensorRef: CcuDeviceReference = { deviceAddress: '0000AAA111BBB', title: 'Heating sensor' };
export const mockDeviceSensorChannel0Ref: CcuDeviceChannelReference = {
  title: 'Master',
  deviceAddress: '0000AAA111BBB',
  channelAddress: '0'
};
export const mockDeviceSensorChannel1Ref: CcuDeviceChannelReference = {
  title: 'Status',
  deviceAddress: '0000AAA111BBB',
  channelAddress: '1'
};

// Devices
export const mockDeviceLightBulb: CcuDevice = {
  description: 'My light bulb',
  identifier: '00123ABC456DEF',
  title: 'Light bulb',
  interfaceType: 'Hm-interface',
  deviceChannelReferences: [mockDeviceLightBulbChannel0Ref, mockDeviceLightBulbChannel1Ref]
};
export const mockDeviceLightBulbChannel0: CcuDeviceChannel = {
  description: 'Light bulb',
  identifier: '0',
  title: 'Light bulb',
  deviceDataPointReferences: [mockDeviceLightBulbChannel0DataPointStateRef],
  roomReferences: [mockRoomLivingRef],
  functionReferences: [mockFunctionLightRef]
};
export const mockDeviceLightBulbChannel1: CcuDeviceChannel = {
  description: 'Light bulb status',
  identifier: '1',
  title: 'Light bulb status',
  deviceDataPointReferences: [mockDeviceLightBulbChannel1DataPointStateRef],
  roomReferences: [mockRoomLivingRef],
  functionReferences: [mockFunctionLightRef]
};
export const mockDeviceLightBulbChannel0DataPointState: CcuDeviceDataPoint = {
  description: 'Light bulb state',
  identifier: 'STATE',
  title: 'Light bulb state',
  control: 'c',
  default: false,
  flags: 1,
  id: 'STATE',
  maximum: true,
  minimum: false,
  mqttSetTopic: 'device/set/00123ABC456DEF/0/STATE',
  mqttStatusTopic: 'device/status/00123ABC456DEF/0/STATE',
  operations: 7,
  tabOrder: 0,
  type: 'BOOL',
  unit: ''
};
export const mockDeviceLightBulbChannel1DataPointState: CcuDeviceDataPoint = {
  description: 'Light bulb state',
  identifier: 'STATE',
  title: 'Light bulb state',
  control: 'c',
  default: false,
  flags: 1,
  id: 'STATE',
  maximum: true,
  minimum: false,
  mqttSetTopic: 'device/set/00123ABC456DEF/1/STATE',
  mqttStatusTopic: 'device/status/00123ABC456DEF/1/STATE',
  operations: 7,
  tabOrder: 0,
  type: 'BOOL',
  unit: ''
};
export const mockDeviceLightBulbChannel0DataPointStateValueBoolean: CcuDeviceDataPointValue<boolean> = {
  timestamp: new Date(1577836800000),
  value: true,
  status: 0,
  source: 'api',
  reference: mockDeviceLightBulbChannel0DataPointStateRef
};
export const mockDeviceLightBulbChannel0DataPointStateValueNumber: CcuDeviceDataPointValue<number> = {
  timestamp: new Date(1577836800000),
  value: 12.34,
  status: 0,
  source: 'api',
  reference: mockDeviceLightBulbChannel0DataPointStateRef
};
export const mockDeviceLightBulbChannel0DataPointStateValueString: CcuDeviceDataPointValue<string> = {
  timestamp: new Date(1577836800000),
  value: 'my-value',
  status: 0,
  source: 'api',
  reference: mockDeviceLightBulbChannel0DataPointStateRef
};
export const mockDeviceSensor: CcuDevice = {
  description: 'My heating sensor',
  identifier: '0000AAA111BBB',
  title: 'Heating sensor',
  interfaceType: 'Hm-interface',
  deviceChannelReferences: [mockDeviceSensorChannel0Ref, mockDeviceSensorChannel1Ref]
};

// Functions
export const mockFunctionLight: CcuFunction = {
  description: 'Contains all lights',
  identifier: '1000',
  title: 'Light',
  deviceChannelReferences: [mockDeviceLightBulbChannel0Ref, mockDeviceLightBulbChannel1Ref]
};
export const mockFunctionHeating: CcuFunction = {
  description: 'Contains all heating sensors',
  identifier: '2000',
  title: 'Heating',
  deviceChannelReferences: [mockDeviceSensorChannel0Ref, mockDeviceSensorChannel1Ref]
};

// Programs
export const mockProgramAllLightsOff: CcuProgram = {
  description: 'Turns off all lights',
  title: 'All lights off',
  identifier: '1000',
  active: true,
  mqttGetTopic: 'program/get/1000',
  mqttSetTopic: 'program/set/1000',
  mqttStatusTopic: 'program/status/1000',
  visible: true
};
export const mockProgramAllLightsOffStatus: CcuProgramStatus = {
  timestamp: new Date(1577836800000),
  value: false,
  status: 0,
  source: 'api',
  reference: mockProgramAllLightsOffRef
};
export const mockProgramHeatingNightMode: CcuProgram = {
  description: 'Regulate heating units dependent on night mode',
  title: 'Heating night mode',
  identifier: '2000',
  active: true,
  mqttGetTopic: 'program/get/2000',
  mqttSetTopic: 'program/set/2000',
  mqttStatusTopic: 'program/status/2000',
  visible: true
};

// Rooms
export const mockRoomLiving: CcuRoom = {
  description: 'My living room',
  identifier: '1000',
  title: 'Living Room',
  deviceChannelReferences: [
    mockDeviceLightBulbChannel0Ref,
    mockDeviceLightBulbChannel1Ref,
    mockDeviceSensorChannel0Ref,
    mockDeviceSensorChannel1Ref
  ]
};
export const mockRoomKitchen: CcuRoom = {
  description: 'My kitchen',
  identifier: '2000',
  title: 'Kitchen',
  deviceChannelReferences: []
};

// SysVars
export const mockSysVarNightModeActive: CcuSysVar = {
  description: 'Night mode status',
  identifier: '1000',
  title: 'NightModeActive',
  maximum: true,
  minimum: false,
  default: false,
  mqttGetTopic: 'sysvar/get/1000',
  mqttSetTopic: 'sysvar/set/1000',
  mqttStatusTopic: 'sysvar/status/1000',
  operations: 7,
  type: 'BOOL',
  unit: ''
};
export const mockSysVarTempOutside: CcuSysVar = {
  description: 'Outside temperature',
  identifier: '2000',
  title: 'TempOutside',
  maximum: 60.0,
  minimum: -60.0,
  default: 0.0,
  mqttGetTopic: 'sysvar/get/2000',
  mqttSetTopic: 'sysvar/set/2000',
  mqttStatusTopic: 'sysvar/status/2000',
  operations: 7,
  type: 'FLOAT',
  unit: '°C'
};
export const mockSysVarWeatherForecast: CcuSysVar = {
  description: 'Forecast from weather.com',
  identifier: '3000',
  title: 'WeatherForecast',
  default: 'no data',
  mqttGetTopic: 'sysvar/get/3000',
  mqttSetTopic: 'sysvar/set/3000',
  mqttStatusTopic: 'sysvar/status/3000',
  operations: 7,
  type: 'STRING',
  unit: ''
};
export const mockSysVarShutterMode: CcuSysVar = {
  description: 'Shutter mode',
  identifier: '4000',
  title: 'ShutterMode',
  default: 'AUTO',
  mqttGetTopic: 'sysvar/get/4000',
  mqttSetTopic: 'sysvar/set/4000',
  mqttStatusTopic: 'sysvar/status/4000',
  operations: 7,
  type: 'ENUM',
  unit: '',
  valueList: ['OPEN', 'CLOSED', 'AUTO']
};
export const mockSysVarNightModeActiveValue: CcuSysVarValue<boolean> = {
  timestamp: new Date(1577836800000),
  value: true,
  status: 0,
  source: 'api',
  reference: mockSysVarNightModeActiveRef
};
export const mockSysVarTempOutsideValue: CcuSysVarValue<number> = {
  timestamp: new Date(1577836800000),
  value: 12.34,
  status: 0,
  source: 'api',
  reference: mockSysVarTempOutsideRef
};
export const mockSysVarWeatherForecastValue: CcuSysVarValue<string> = {
  timestamp: new Date(1577836800000),
  value: 'cloudy',
  status: 0,
  source: 'api',
  reference: mockSysVarWeatherForecastRef
};
export const mockSysVarShutterModeValue: CcuSysVarValue<string> = {
  timestamp: new Date(1577836800000),
  value: 'CLOSED',
  status: 0,
  source: 'api',
  reference: mockSysVarShutterModeRef
};

// Vendor
export const mockVendorInformation: CcuVendorInformation = {
  description: 'Information about the server and the vendor',
  identifier: '~vendor',
  serverDescription: 'REST/MQTT-Interface for the HomeMatic CCU',
  serverName: 'CCU-Jack',
  serverVersion: '1.0.0',
  title: 'Vendor Information',
  veapVersion: '1',
  vendorName: 'info@ccu-historian.de'
};
export const mockVendorInformationDetails: CcuVendorInformationDetails = {
  config: 'vendor_config_result',
  diagnostics: 'vendor_diagnostics',
  statistics: { httpErrorResponses: 0, httpRequestBytes: 1, httpRequests: 2, httpResponseBytes: 3 }
};

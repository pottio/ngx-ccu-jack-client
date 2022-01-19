import { AdditionalPropertiesSupport } from './models.internal';

export type CcuType =
  | 'root'
  | 'domain'
  | 'collection'
  | 'device'
  | 'function'
  | 'program'
  | 'room'
  | 'sysvar'
  | '~vendor'
  | 'channel'
  | 'parameter'
  | 'item';
export type CcuReferenceType =
  | CcuDeviceReference
  | CcuDeviceChannelReference
  | CcuDeviceDataPointReference
  | CcuFunctionReference
  | CcuProgramReference
  | CcuRoomReference
  | CcuSysVarReference;
export type CcuValueType = number | boolean | string;

export type CcuDeviceChannelAddressType = `${string}/${string}`;
export type CcuDeviceDataPointAddressType = `${string}/${string}/${string}`;

interface CcuReference {
  title?: string;
}

export interface CcuDeviceReference extends CcuReference {
  deviceAddress: string;
}
export interface CcuDeviceChannelReference extends CcuDeviceReference {
  channelAddress: string;
}

export interface CcuDeviceDataPointReference extends CcuDeviceChannelReference {
  dataPointAddress: string;
}

export interface CcuFunctionReference extends CcuReference {
  functionAddress: string;
}

export interface CcuProgramReference extends CcuReference {
  programAddress: string;
}

export interface CcuRoomReference extends CcuReference {
  roomAddress: string;
}

export interface CcuSysVarReference extends CcuReference {
  sysVarAddress: string;
}

interface CcuBase extends AdditionalPropertiesSupport {
  description: string;
  identifier: string;
  title: string;
}

interface CcuDetails {
  address?: string;
  aesActive?: number;
  availableFirmware?: string;
  children?: string[];
  direction?: number;
  firmware?: string;
  flags?: number;
  group?: string;
  index?: number;
  interface?: string;
  linkSourceRoles?: string;
  linkTargetRoles?: string;
  paramsets?: string[];
  parent?: string;
  parentType?: string;
  rfAddress?: number;
  roaming?: number;
  rxMode?: number;
  team?: string;
  teamChannels?: unknown;
  teamTag?: string;
  type?: string;
  version?: number;
}

export interface CcuDevice extends CcuBase, CcuDetails {
  interfaceType: string;
  deviceChannelReferences: CcuDeviceChannelReference[];
}

export interface CcuDeviceChannel extends CcuBase, CcuDetails {
  deviceDataPointReferences: CcuDeviceDataPointReference[];
  roomReferences: CcuRoomReference[];
  functionReferences: CcuFunctionReference[];
}

export interface CcuDeviceDataPoint extends CcuBase {
  control: string;
  default?: CcuValueType;
  flags: number;
  id: string;
  maximum?: CcuValueType;
  minimum?: CcuValueType;
  mqttSetTopic: string;
  mqttStatusTopic: string;
  operations: number;
  special?: unknown[];
  tabOrder?: number;
  type: string;
  unit: string;
  valueList?: string[];
}

export interface CcuFunction extends CcuBase {
  deviceChannelReferences: CcuDeviceChannelReference[];
}

export interface CcuRoom extends CcuBase {
  deviceChannelReferences: CcuDeviceChannelReference[];
}

export interface CcuProgram extends CcuBase {
  active: boolean;
  mqttGetTopic: string;
  mqttSetTopic: string;
  mqttStatusTopic: string;
  visible: boolean;
}

export interface CcuSysVar extends CcuBase {
  maximum?: CcuValueType;
  minimum?: CcuValueType;
  default?: CcuValueType;
  mqttGetTopic: string;
  mqttSetTopic: string;
  mqttStatusTopic: string;
  operations: number;
  type: string;
  unit: string;
  valueName0?: string;
  valueName1?: string;
  valueList?: string[];
}

export interface CcuVendorInformation extends AdditionalPropertiesSupport {
  description: string;
  identifier: string;
  serverDescription: string;
  serverName: string;
  serverVersion: string;
  title: string;
  veapVersion: string;
  vendorName: string;
}

export interface CcuVendorInformationDetails extends AdditionalPropertiesSupport {
  config: unknown;
  diagnostics: unknown;
  statistics: {
    httpErrorResponses: number;
    httpRequestBytes: number;
    httpRequests: number;
    httpResponseBytes: number;
  };
}

interface CcuValue<T> {
  timestamp: Date;
  value: T;
  status: number;
  source: 'api' | 'mqtt';
}

export interface CcuDeviceDataPointValue<T> extends CcuValue<T> {
  reference: CcuDeviceDataPointReference;
}

export interface CcuSysVarValue<T> extends CcuValue<T> {
  reference: CcuSysVarReference;
}

export interface CcuProgramStatus extends CcuValue<boolean> {
  reference: CcuProgramReference;
}

export enum CcuJackMqttConnectionState {
  CLOSED = 0,
  CONNECTING = 1,
  CONNECTED = 2
}

export interface CcuCustomMqttMessage {
  topic: string;
  payload: Uint8Array;
  qos: number;
  retain: boolean;
  dup: boolean;
  cmd: string;
  messageId?: number;
  length?: number;
}

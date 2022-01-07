export const CcuJackClientConfigurationKey = 'config';
export interface AdditionalPropertiesSupport {
  [key: string]: unknown;
}
export interface CcuJackValue<T> {
  ts: Date;
  v: T;
  s: number;
}

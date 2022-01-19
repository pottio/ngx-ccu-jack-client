import { CcuJackClientConfiguration } from 'ngx-ccu-jack-client';

const ccuJackClientConfiguration: CcuJackClientConfiguration = {
  connectMqttOnInit: true,
  hostnameOrIp: 'your-hostname-or-ip',
  port: 2122,
  secureConnection: true,
  auth: { user: 'your-user', password: 'your-password' }
};

export const environment = {
  production: true,
  ccuJackClientConfiguration: ccuJackClientConfiguration
};

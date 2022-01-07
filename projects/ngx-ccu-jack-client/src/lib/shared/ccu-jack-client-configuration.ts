export class CcuJackClientConfiguration {
  constructor(
    hostnameOrIp: string,
    port: number,
    secureConnection: boolean,
    connectMqttOnInit: boolean,
    auth?: { user: string; password: string }
  ) {
    this.hostnameOrIp = hostnameOrIp;
    this.port = port;
    this.secureConnection = secureConnection;
    this.connectMqttOnInit = connectMqttOnInit;
    this.auth = auth;
  }
  hostnameOrIp: string;
  port: number;
  secureConnection: boolean;
  auth?: { user: string; password: string };
  connectMqttOnInit: boolean;
}

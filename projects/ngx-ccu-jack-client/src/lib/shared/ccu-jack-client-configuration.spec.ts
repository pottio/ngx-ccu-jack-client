import { CcuJackClientConfiguration } from './ccu-jack-client-configuration';

describe('CcuJackClientConfiguration', () => {
  describe('constructor', () => {
    test('should set all properties correctly', () => {
      // arrange + act
      const sut = new CcuJackClientConfiguration('hostname', 2122, true, true, { user: 'user', password: 'password' });

      // assert
      expect(sut.hostnameOrIp).toBe('hostname');
      expect(sut.port).toBe(2122);
      expect(sut.secureConnection).toBe(true);
      expect(sut.connectMqttOnInit).toBe(true);
      expect(sut.auth).toEqual({ user: 'user', password: 'password' });
    });
  });
});

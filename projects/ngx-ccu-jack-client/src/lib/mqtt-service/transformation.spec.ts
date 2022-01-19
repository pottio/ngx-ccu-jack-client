import { CcuJackMqttConnectionState } from '../shared';
import { MqttConnectionState } from 'ngx-mqtt';
import { Transform } from './transformation';

describe('Transform', () => {
  const sut = Transform;

  describe('mqttConnectionStateToCcuJackMqttConnectionState', () => {
    test.each`
      mqttConnectionState               | expectedCcuJackMqttConnectionState
      ${MqttConnectionState.CONNECTED}  | ${CcuJackMqttConnectionState.CONNECTED}
      ${MqttConnectionState.CONNECTING} | ${CcuJackMqttConnectionState.CONNECTING}
      ${MqttConnectionState.CLOSED}     | ${CcuJackMqttConnectionState.CLOSED}
    `(
      'should transform MqttConnectionState to CcuJackMqttConnectionState',
      ({ mqttConnectionState, expectedCcuJackMqttConnectionState }) => {
        // act
        const ccuJackMqttConnectionState = sut.mqttConnectionStateToCcuJackMqttConnectionState(mqttConnectionState);

        // assert
        expect(ccuJackMqttConnectionState).toBe(expectedCcuJackMqttConnectionState);
      }
    );
  });
});

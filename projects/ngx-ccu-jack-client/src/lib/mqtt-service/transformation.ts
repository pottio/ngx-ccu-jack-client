import { CcuJackMqttConnectionState } from './../shared/models.public';
import { MqttConnectionState } from 'ngx-mqtt';

export abstract class Transform {
  public static mqttConnectionStateToCcuJackMqttConnectionState(
    mqttConnectionState: MqttConnectionState
  ): CcuJackMqttConnectionState {
    if (mqttConnectionState === MqttConnectionState.CONNECTED) return CcuJackMqttConnectionState.CONNECTED;
    if (mqttConnectionState === MqttConnectionState.CONNECTING) return CcuJackMqttConnectionState.CONNECTING;
    return CcuJackMqttConnectionState.CLOSED;
  }
}

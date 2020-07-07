declare module "@capacitor/core" {
  interface PluginRegistry {
      _SensorsPlugin: SensorsPluginPlugin;
  }
}

export declare const enum SensorType {
  PROXIMITY = "PROXIMITY",
  ACCELEROMETER = "ACCELEROMETER",
  GRAVITY = "GRAVITY",
  GYROSCOPE = "GYROSCOPE",
  GYROSCOPE_UNCALIBRATED = "GYROSCOPE_UNCALIBRATED",
  LINEAR_ACCELERATION = "LINEAR_ACCELERATION",
  ROTATION_VECTOR = "ROTATION_VECTOR",
  STEP_COUNTER = "STEP_COUNTER",
  GAME_ROTATION_VECTOR = "GAME_ROTATION_VECTOR",
  GEOMAGNETIC_ROTATION_VECTOR = "GEOMAGNETIC_ROTATION_VECTOR",
  MAGNETIC_FIELD = "MAGNETIC_FIELD",
  MAGNETIC_FIELD_UNCALIBRATED = "MAGNETIC_FIELD_UNCALIBRATED",
  ORIENTATION = "ORIENTATION",
  AMBIENT_TEMPERATURE = "AMBIENT_TEMPERATURE",
  LIGHT = "LIGHT",
  PRESSURE = "PRESSURE",
  RELATIVE_HUMIDITY = "RELATIVE_HUMIDITY",
  TEMPERATURE = "TEMPERATURE",
  ALL = "ALL",
  UNKNOWN = "UNKNOWN"
}

export interface Sensor {
  id: string,
  name: string,
  type: SensorType
}

export interface SensorsPluginPlugin {
  get(options: {type: SensorType}): Promise<{sensors: Sensor[]}>;
  // start(options: Sensor): Promise<{values: number[]}>;
  stop(options: Sensor): Promise<void>;
}
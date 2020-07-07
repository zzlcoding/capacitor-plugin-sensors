export * from './definitions';
export * from './web';


import { Plugins, Capacitor, PluginResultData, PluginResultError } from '@capacitor/core';
import { SensorType, Sensor } from './definitions';
const { _SensorsPlugin } = Plugins;


export class SensorsPlugin {
    static get(type: SensorType): Promise<Sensor[]> {
        return new Promise((resolve, reject) => {
            _SensorsPlugin.get({type: type}).then(result => {
                resolve(result.sensors);
            }).catch(e => {
                reject(e);
            });
        });
    }

    static start(sensor: Sensor, valueListener: ((values: number[]) => void), errorCallback: ((message: string) => void)): void {
        Capacitor.toNative('_SensorsPlugin', 'start', sensor, {
            callback: (data: PluginResultData, error: PluginResultError) => {
                if (error) {
                    errorCallback(error.message);
                }
                if (data) {
                    valueListener(data.values);
                }
              }
        });
    }

    static stop(sensor: Sensor): void {
        _SensorsPlugin.stop(sensor);
    }
}
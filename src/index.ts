export * from './definitions';
export * from './web';


import { Plugins, Capacitor, PluginResultData, PluginResultError } from '@capacitor/core';
import { SensorType, Sensor } from './definitions';
const { _SensorsPlugin } = Plugins;


export class SensorsPlugin {

    /**
     * get sensor list by sensor type
     * @param type sensor type to get
     */
    static get(type: SensorType): Promise<Sensor[]> {
        return new Promise((resolve, reject) => {
            _SensorsPlugin.get({type: type}).then(result => {
                resolve(result.sensors);
            }).catch(e => {
                reject(e);
            });
        });
    }

    /**
     * start a sensor and continuous Listening it's values
     * @param sensor sensor to start
     * @param valueListener callback with values from sensor
     * @param errorCallback when error happened, this function will be invoked
     */
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

    /**
     * stop listening a sensor
     * @param sensor 
     */
    static stop(sensor: Sensor): void {
        _SensorsPlugin.stop(sensor);
    }
}
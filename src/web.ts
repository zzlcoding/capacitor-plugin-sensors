import { WebPlugin } from '@capacitor/core';
import { SensorsPluginPlugin, Sensor, SensorType } from './definitions';

export class SensorsPluginWeb extends WebPlugin implements SensorsPluginPlugin {
    constructor() {
        super({
            name: '_SensorsPlugin',
            platforms: ['web']
        });
    }
    get(_options: { type: SensorType }): Promise<{ sensors: Sensor[] }> {
        throw new Error("Method not implemented.");
    }
    stop(_options: Sensor): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
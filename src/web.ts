import { WebPlugin } from '@capacitor/core';
import { SensorsPluginPlugin } from './definitions';

export class SensorsPluginWeb extends WebPlugin implements SensorsPluginPlugin {
  constructor() {
    super({
      name: 'SensorsPlugin',
      platforms: ['web']
    });
  }

  async echo(options: { value: string }): Promise<{value: string}> {
    console.log('ECHO', options);
    return options;
  }
}

const SensorsPlugin = new SensorsPluginWeb();

export { SensorsPlugin };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(SensorsPlugin);

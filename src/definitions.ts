declare module "@capacitor/core" {
  interface PluginRegistry {
    SensorsPlugin: SensorsPluginPlugin;
  }
}

export interface SensorsPluginPlugin {
  echo(options: { value: string }): Promise<{value: string}>;
}

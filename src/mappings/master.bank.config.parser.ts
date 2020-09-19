import { BankConfig } from "./bank.config";

export class MasterBankConfigParser {
  config: Object;

  constructor(config: Object) {
    this.config = JSON.parse(JSON.stringify(config));
  }

  getDefaultConfigName() {
    return this.config.default;
  }

  getDefaultConfig() {
    return this.getConfigFor(this.getDefaultConfigName());
  }

  getConfigurationCount() {
    return this.config.configs.length;
  }

  getConfigFor(configName: string) {
    const configs = this.getConfigs();

    let foundConfig = null;
    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];
      if (config.getName() === configName) {
        foundConfig = config;
        break;
      }
    }

    return foundConfig;
  }

  getConfigs() {
    const configs = this.config.configs;

    const parsed = [];

    for (let i = 0; i < configs.length; i++) {
      parsed.push(new BankConfig(configs[i]));
    }
    return parsed;
  }
}

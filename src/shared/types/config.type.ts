import { ValidatorOptions } from 'class-validator';

export enum ConfigCoreVersions {
  V1 = 'v1.0',
}

export type ConfigCoreConfigs = {
  [key in string]: any;
};

export type ConfigCoreValidation = {
  enable: boolean;
  options: ValidatorOptions;
};

export type ConfigCoreApplication = {
  port: number;
  validation?: ConfigCoreValidation;
};

export type ConfigCore = {
  version: ConfigCoreVersions;
  configs: ConfigCoreConfigs;
  application: ConfigCoreApplication;
  plugins: string[];
};

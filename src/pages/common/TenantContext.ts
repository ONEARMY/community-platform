import { TenantSettings } from 'oa-shared';
import { createContext } from 'react';
import type { ConfigurationOption } from 'src/config/constants';
import { _supportedConfigurationOptions } from 'src/config/constants';

export type TenantSettingsContext =
  | (TenantSettings & {
      environment: Partial<EnvVariables>;
    })
  | null;

export const getEnvVariables = (): Partial<EnvVariables> => {
  const envVariables: Partial<EnvVariables> = {};
  _supportedConfigurationOptions.forEach((option) => {
    const value = import.meta.env[option];
    if (value !== undefined) {
      envVariables[option] = value;
    }
  });
  return envVariables;
};

export const TenantContext = createContext<TenantSettingsContext | null>(null);

type EnvVariables = {
  [K in ConfigurationOption]: string;
};

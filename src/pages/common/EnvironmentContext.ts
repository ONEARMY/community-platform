import { createContext } from 'react'
import { _supportedConfigurationOptions } from 'src/config/constants'

import type { ConfigurationOption } from 'src/config/constants'

export const getEnvVariables = (): Partial<EnvVariables> => {
  const envVariables: Partial<EnvVariables> = {}
  _supportedConfigurationOptions.forEach((option) => {
    const value = import.meta.env[option]
    if (value !== undefined) {
      envVariables[option] = value
    }
  })
  return envVariables
}
export const EnvironmentContext =
  createContext<ReturnType<typeof getEnvVariables>>(getEnvVariables())

type EnvVariables = {
  [K in ConfigurationOption]: string
}

import type { EchoAppConfig } from '../types/config'
import { useAppConfig } from '#app'

export const useEchoAppConfig = (): EchoAppConfig => {
  return (useAppConfig().echo ?? {}) as EchoAppConfig
}

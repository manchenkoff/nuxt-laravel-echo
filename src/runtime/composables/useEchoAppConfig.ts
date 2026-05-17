import type { EchoAppConfig } from '../types/config'
import { useAppConfig } from '#imports'

export const useEchoAppConfig = (): EchoAppConfig => {
  return (useAppConfig().echo ?? {}) as EchoAppConfig
}

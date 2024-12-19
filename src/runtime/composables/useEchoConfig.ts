import type { ModuleOptions } from '../types/options'
import { useRuntimeConfig } from '#imports'

export const useEchoConfig = (): ModuleOptions => {
  return useRuntimeConfig().public.echo as ModuleOptions
}

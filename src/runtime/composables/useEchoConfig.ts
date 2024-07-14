import type { ModuleOptions } from '../types'
import { useRuntimeConfig } from '#imports'

export const useEchoConfig = (): ModuleOptions => {
  return useRuntimeConfig().public.echo as ModuleOptions
}

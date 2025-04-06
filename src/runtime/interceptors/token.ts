import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import type { ModuleOptions } from '../types/options'
import { useEchoAppConfig } from '../composables/useEchoAppConfig'
import { createError, type NuxtApp } from '#app'

/**
 * Sets Authorization header for the request if the token is present.
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export default async function handleAuthToken(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  const config = app.$config.public.echo as ModuleOptions

  if (config.authentication?.mode !== 'token') {
    return
  }

  const { tokenStorage } = useEchoAppConfig()

  if (!tokenStorage) {
    throw createError('Token storage is not defined')
  }

  const token = await tokenStorage.get(app)

  if (!token) {
    logger.debug('Authorization token is missing, unable to set header')
    return
  }

  ctx.options.headers.set('Authorization', `Bearer ${token}`)
}

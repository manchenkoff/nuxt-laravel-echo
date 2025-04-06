import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import type { ModuleOptions } from '../types/options'
import type { NuxtApp } from '#app'
import { useCookie } from '#app'

const readCsrfCookie = (name: string) => useCookie(name, { readonly: true })

/**
 * Sets the CSRF token header for the request if the CSRF cookie is present.
 * @param app Nuxt application instance
 * @param ctx Fetch context
 * @param logger Module logger instance
 */
export default async function handleCsrfCookie(
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance,
): Promise<void> {
  const config = app.$config.public.echo as ModuleOptions

  if (config.authentication?.mode !== 'cookie') {
    return
  }

  const { authentication } = config

  if (authentication.csrfCookie === undefined) {
    throw new Error(`'echo.authentication.csrfCookie' is not defined`)
  }

  let csrfToken = readCsrfCookie(authentication.csrfCookie)

  if (!csrfToken.value) {
    if (authentication.csrfEndpoint === undefined) {
      throw new Error(`'echo.authentication.csrfCookie' is not defined`)
    }

    await $fetch(authentication.csrfEndpoint, {
      baseURL: authentication.baseUrl,
      credentials: 'include',
      retry: false,
    })

    csrfToken = readCsrfCookie(authentication.csrfCookie)
  }

  if (!csrfToken.value) {
    logger.warn(`${authentication.csrfCookie} cookie is missing, unable to set ${authentication.csrfHeader} header`)
    return
  }

  if (authentication.csrfHeader === undefined) {
    throw new Error(`'echo.authentication.csrfHeader' is not defined`)
  }

  ctx.options.headers.set(authentication.csrfHeader, csrfToken.value)
}

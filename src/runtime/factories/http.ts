import type { ConsolaInstance } from 'consola'
import type { FetchContext, FetchOptions } from 'ofetch'
import type { EchoAppConfig, EchoInterceptor } from '../types/config'
import handleCsrfCookie from '../interceptors/csrf'
import handleAuthToken from '../interceptors/token'
import type { Authentication } from '../types/options'
import { useEchoAppConfig } from '../composables/useEchoAppConfig'
import type { NuxtApp } from '#app'

/**
 * Returns a tuple of request and response interceptors.
 * Includes both module and user-defined interceptors.
 * @param appConfig The Echo application configuration.
 */
function useClientInterceptors(appConfig: EchoAppConfig): [EchoInterceptor[], EchoInterceptor[]] {
  const [request, response] = [
    [
      handleCsrfCookie,
      handleAuthToken,
    ] as EchoInterceptor[],
    [] as EchoInterceptor[],
  ]

  if (appConfig.interceptors?.onRequest) {
    request.push(appConfig.interceptors.onRequest)
  }

  if (appConfig.interceptors?.onResponse) {
    response.push(appConfig.interceptors.onResponse)
  }

  return [request, response]
}

/**
 * Creates a fetch client with interceptors for handling authentication and CSRF tokens.
 * @param app The Nuxt application instance.
 * @param authentication The authentication configuration.
 * @param logger The logger instance.
 */
export function createFetchClient(
  app: NuxtApp,
  authentication: Required<Authentication>,
  logger: ConsolaInstance
) {
  const appConfig = useEchoAppConfig()

  const [
    requestInterceptors,
    responseInterceptors,
  ] = useClientInterceptors(appConfig)

  const fetchOptions: FetchOptions = {
    baseURL: authentication.baseUrl,
    credentials: 'include',
    retry: false,

    async onRequest(context) {
      for (const interceptor of requestInterceptors) {
        await app.runWithContext(async () => {
          await interceptor(app, context, logger)
        })
      }
    },

    async onResponse(context: FetchContext): Promise<void> {
      for (const interceptor of responseInterceptors) {
        await app.runWithContext(async () => {
          await interceptor(app, context, logger)
        })
      }
    },
  }

  return $fetch.create(fetchOptions)
}

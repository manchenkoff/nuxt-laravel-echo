import Echo from 'laravel-echo'
import PusherPkg, { type Channel, type ChannelAuthorizationCallback, type Options } from 'pusher-js'
import type { ChannelAuthorizationData } from 'pusher-js/types/src/core/auth/options'
import { type ConsolaInstance, createConsola } from 'consola'
import type { FetchOptions } from 'ofetch'
import { useEchoConfig } from './composables/useEchoConfig'
import type { Authentication, ModuleOptions, SupportedBroadcaster } from './types/options'
import { useEchoAppConfig } from './composables/useEchoAppConfig'
import { createError, defineNuxtPlugin, useCookie, updateAppConfig, type NuxtApp } from '#app'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Pusher = (PusherPkg as any).default || PusherPkg

declare global {
  interface Window {
    Echo: Echo<SupportedBroadcaster>
    Pusher: typeof Pusher
  }
}

const MODULE_NAME = 'nuxt-laravel-echo'

function createEchoLogger(logLevel: number) {
  return createConsola({ level: logLevel }).withTag(MODULE_NAME)
}

const readCsrfCookie = (name: string) => useCookie(name, { readonly: true })

function createFetchClient(
  app: NuxtApp,
  authentication: Required<Authentication>,
  logger: ConsolaInstance
) {
  const fetchOptions: FetchOptions = {
    baseURL: authentication.baseUrl,
    credentials: 'include',
    retry: false,

    async onRequest(context) {
      if (authentication.mode === 'cookie') {
        let csrfToken = readCsrfCookie(authentication.csrfCookie)

        if (!csrfToken.value) {
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

        context.options.headers.set(authentication.csrfHeader, csrfToken.value)
      }

      if (authentication.mode === 'token') {
        const { tokenStorage } = useEchoAppConfig()

        if (!tokenStorage) {
          throw createError('Token storage is not defined')
        }

        const token = await tokenStorage.get(app)

        if (!token) {
          logger.debug('Authorization token is missing, unable to set header')
          return
        }

        context.options.headers.set('Authorization', `Bearer ${token}`)
      }
    },
  }

  return $fetch.create(fetchOptions)
}

function createAuthorizer(
  app: NuxtApp,
  authentication: Required<Authentication>,
  logger: ConsolaInstance
) {
  const client = createFetchClient(app, authentication, logger)

  return (channel: Channel, _: Options) => {
    return {
      authorize: (socketId: string, callback: ChannelAuthorizationCallback) => {
        const payload = JSON.stringify({
          socket_id: socketId,
          channel_name: channel.name,
        })

        client<ChannelAuthorizationData>(authentication.authEndpoint, {
          method: 'post',
          body: payload,
        })
          .then((response: ChannelAuthorizationData) =>
            callback(null, response)
          )
          .catch((error: Error | null) => callback(error, null))
      },
    }
  }
}

function prepareEchoOptions(app: NuxtApp, config: ModuleOptions, logger: ConsolaInstance) {
  const forceTLS = config.scheme === 'https'
  const additionalOptions = config.properties || {}

  const authorizer = config.authentication
    ? createAuthorizer(
      app,
      config.authentication as Required<Authentication>,
      logger
    )
    : undefined

  // Create a Pusher instance
  if (config.broadcaster === 'pusher') {
    if (!forceTLS) {
      throw createError('Pusher requires a secure connection (schema: "https")')
    }

    return {
      broadcaster: config.broadcaster,
      key: config.key,
      cluster: config.cluster,
      forceTLS,
      authorizer,
      ...additionalOptions,
    }
  }

  // Create a Reverb instance
  return {
    broadcaster: config.broadcaster,
    key: config.key,
    wsHost: config.host,
    wsPort: config.port,
    wssPort: config.port,
    forceTLS,
    enabledTransports: config.transports,
    authorizer,
    ...additionalOptions,
  }
}

async function setupDefaultTokenStorage(nuxtApp: NuxtApp, logger: ConsolaInstance) {
  logger.debug(
    'Token storage is not defined, switch to default cookie storage',
  )

  const defaultStorage = await import('./storages/cookieTokenStorage')

  nuxtApp.runWithContext(() => {
    updateAppConfig({
      echo: {
        tokenStorage: defaultStorage.cookieTokenStorage,
      },
    })
  })
}

export default defineNuxtPlugin(async (_nuxtApp) => {
  const nuxtApp = _nuxtApp as NuxtApp
  const config = useEchoConfig()
  const appConfig = useEchoAppConfig()
  const logger = createEchoLogger(config.logLevel)

  if (config.authentication?.mode === 'token' && !appConfig.tokenStorage) {
    await setupDefaultTokenStorage(nuxtApp, logger)
  }

  window.Pusher = Pusher
  window.Echo = new Echo(prepareEchoOptions(nuxtApp, config, logger))

  logger.debug('Laravel Echo client initialized')

  return {
    provide: {
      echo: window.Echo,
    },
  }
})

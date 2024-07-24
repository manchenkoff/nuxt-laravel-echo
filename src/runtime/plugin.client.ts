import Echo from 'laravel-echo'
import type { Channel, Options, ChannelAuthorizationCallback } from 'pusher-js'
import type { ChannelAuthorizationData } from 'pusher-js/types/src/core/auth/options'
import { createConsola, type ConsolaInstance } from 'consola'
import type { FetchOptions } from 'ofetch'
import { useEchoConfig } from './composables/useEchoConfig'
import type { Authentication, ModuleOptions } from './types'
import { defineNuxtPlugin, createError, useCookie } from '#app'

declare global {
  interface Window {
    Echo: Echo
  }
}

const MODULE_NAME = 'nuxt-laravel-echo'

function createEchoLogger(logLevel: number) {
  return createConsola({ level: logLevel }).withTag(MODULE_NAME)
}

const readCsrfCookie = (name: string) => useCookie(name, { readonly: true })

function createFetchClient(
  authentication: Required<Authentication>,
  logger: ConsolaInstance
) {
  const fetchOptions: FetchOptions = {
    baseURL: authentication.baseUrl,
    credentials: 'include',
    retry: false,

    async onRequest(context) {
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
        logger.warn(
          `${authentication.csrfCookie} cookie is missing, unable to set ${authentication.csrfHeader} header`
        )

        return
      }

      context.options.headers = {
        ...context.options.headers,
        [authentication.csrfHeader]: csrfToken.value,
      }
    },
  }

  return $fetch.create(fetchOptions)
}

function createAuthorizer(
  authentication: Required<Authentication>,
  logger: ConsolaInstance
) {
  const client = createFetchClient(authentication, logger)

  const authorizer = (channel: Channel, _: Options) => {
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

  return authorizer
}

function prepareEchoOptions(config: ModuleOptions, logger: ConsolaInstance) {
  const forceTLS = config.scheme === 'https'
  const additionalOptions = config.properties || {}

  const authorizer = config.authentication
    ? createAuthorizer(
      config.authentication as Required<Authentication>,
      logger
    )
    : undefined

  // Create a Pusher instance
  if (config.broadcaster === 'pusher') {
    if (forceTLS === false) {
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

export default defineNuxtPlugin(async (_nuxtApp) => {
  const config = useEchoConfig()
  const logger = createEchoLogger(config.logLevel)

  const Pusher = (await import('pusher-js')).default

  // @ts-expect-error window has no Pusher property
  window.Pusher = Pusher
  window.Echo = new Echo(prepareEchoOptions(config, logger))

  logger.debug('Laravel Echo client initialized')

  return {
    provide: {
      echo: window.Echo,
    },
  }
})

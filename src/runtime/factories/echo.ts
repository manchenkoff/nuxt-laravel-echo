import type { ConsolaInstance } from 'consola'
import Echo from 'laravel-echo'
import type { Broadcaster, EchoOptions } from 'laravel-echo'
import type { Channel, ChannelAuthorizationCallback, Options } from 'pusher-js'
import type { ChannelAuthorizationData } from 'pusher-js/types/src/core/auth/options'
import type { Authentication, ModuleOptions } from '../types/options'
import { createFetchClient } from './http'
import { createError } from '#app'
import type { NuxtApp } from '#app'

/**
 * Creates an authorizer function for the Echo instance.
 * @param app The Nuxt application instance
 * @param authentication The authentication options
 * @param logger The logger instance
 */
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

/**
 * Prepares the options for the Echo instance.
 * Returns Pusher or Reverb options based on the broadcaster.
 * @param app The Nuxt application instance
 * @param config The module options
 * @param logger The logger instance
 */
function prepareEchoOptions<T extends keyof Broadcaster>(app: NuxtApp, config: ModuleOptions, logger: ConsolaInstance): EchoOptions<T> {
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
    } as EchoOptions<'pusher'>
  }

  // Create a Reverb instance
  if (config.broadcaster === 'reverb') {
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
    } as EchoOptions<'reverb'>
  }

  throw new Error(`Unsupported broadcaster: ${config.broadcaster}`)
}

/**
 * Returns a new instance of Echo with configured authentication.
 * @param app The Nuxt application instance
 * @param config The module options
 * @param logger The logger instance
 */
export function createEcho(app: NuxtApp, config: ModuleOptions, logger: ConsolaInstance) {
  const options = prepareEchoOptions(app, config, logger)

  return new Echo(options)
}

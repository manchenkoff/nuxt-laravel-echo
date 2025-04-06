import type Echo from 'laravel-echo'
import PusherPkg from 'pusher-js'
import { type ConsolaInstance, createConsola } from 'consola'
import { useEchoConfig } from './composables/useEchoConfig'
import type { SupportedBroadcaster } from './types/options'
import { useEchoAppConfig } from './composables/useEchoAppConfig'
import { createEcho } from './factories/echo'
import { defineNuxtPlugin, updateAppConfig, type NuxtApp } from '#app'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Pusher = (PusherPkg as any).default || PusherPkg

declare global {
  interface Window {
    Echo: Echo<SupportedBroadcaster>
    Pusher: typeof Pusher
  }
}

const MODULE_NAME = 'nuxt-laravel-echo'

/**
 * Create a logger instance for the Echo module
 * @param logLevel
 */
function createEchoLogger(logLevel: number) {
  return createConsola({ level: logLevel }).withTag(MODULE_NAME)
}

/**
 * Setup default token storage if not defined by the user
 * @param nuxtApp The Nuxt application instance
 * @param logger The logger instance
 */
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
  window.Echo = createEcho(nuxtApp, config, logger)

  logger.debug('Laravel Echo client initialized')

  return {
    provide: {
      echo: window.Echo,
    },
  }
})

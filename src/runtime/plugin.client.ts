import type Echo from 'laravel-echo'
import type { BroadcastDriver } from 'laravel-echo'
import * as PusherPkg from 'pusher-js'
import type PusherClient from 'pusher-js'
import { createConsola } from 'consola'
import type { ConsolaInstance } from 'consola'
import { useEchoConfig } from './composables/useEchoConfig'
import { useEchoAppConfig } from './composables/useEchoAppConfig'
import { createEcho } from './factories/echo'
import { defineNuxtPlugin, updateAppConfig } from '#app'
import type { NuxtApp } from '#app'

type PusherClass = typeof PusherClient

type PusherModule = {
  default?: PusherClass | { default?: PusherClass }
  Pusher?: PusherClass
}

function resolvePusherClass(pkg: unknown): PusherClass {
  const mod = pkg as PusherModule

  if (typeof mod.default === 'function') {
    return mod.default
  }

  if (mod.default && typeof mod.default === 'object' && typeof mod.default.default === 'function') {
    return mod.default.default
  }

  if (typeof mod.Pusher === 'function') {
    return mod.Pusher
  }

  if (typeof window !== 'undefined' && typeof window.Pusher === 'function') {
    return window.Pusher
  }

  return mod as unknown as PusherClass
}

const Pusher: PusherClass = resolvePusherClass(PusherPkg)

declare global {
  interface Window {
    Echo: Echo<BroadcastDriver>
    Pusher: PusherClass
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
 * Set up default token storage if not defined by the user
 * @param nuxtApp The Nuxt application instance
 * @param logger The logger instance
 */
async function setupDefaultTokenStorage(nuxtApp: NuxtApp, logger: ConsolaInstance) {
  logger.debug('Token storage is not defined, switch to default cookie storage')

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

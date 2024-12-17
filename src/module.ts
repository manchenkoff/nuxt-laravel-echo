import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  useLogger,
  addImportsDir,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { ModuleOptions } from './runtime/types'

const MODULE_NAME = 'nuxt-laravel-echo'

export type ModulePublicRuntimeConfig = { echo: ModuleOptions }

const defaultModuleOptions: ModuleOptions = {
  broadcaster: 'reverb',
  host: 'localhost',
  port: 8080,
  scheme: 'https',
  transports: ['ws', 'wss'],
  authentication: {
    mode: 'cookie',
    baseUrl: 'http://localhost:80',
    authEndpoint: '/broadcasting/auth',
    csrfEndpoint: '/sanctum/csrf-cookie',
    csrfCookie: 'XSRF-TOKEN',
    csrfHeader: 'X-XSRF-TOKEN',
  },
  logLevel: 3,
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: MODULE_NAME,
    configKey: 'echo',
    compatibility: {
      nuxt: '>=3.13.0'
    }
  },
  defaults: defaultModuleOptions,
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    const logger = useLogger(MODULE_NAME, { level: _options.logLevel })

    _nuxt.options.build.transpile.push(resolver.resolve('./runtime'))
    _nuxt.options.runtimeConfig.public.echo = defu(
      _nuxt.options.runtimeConfig.public.echo,
      _options
    )

    addPlugin(resolver.resolve('./runtime/plugin.client'))
    addImportsDir(resolver.resolve('./runtime/composables'))

    logger.info('Laravel Echo module initialized!')
  },
})

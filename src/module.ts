import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  useLogger,
  addImportsDir,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { ModuleOptions } from './runtime/types/options'
import { registerTypeTemplates } from './templates'
import { defaultModuleOptions } from './config'

const MODULE_NAME = 'nuxt-laravel-echo'

export type ModulePublicRuntimeConfig = { echo: Partial<ModuleOptions> }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: MODULE_NAME,
    configKey: 'echo',
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

    _nuxt.options.vite = _nuxt.options.vite || {}
    _nuxt.options.vite.optimizeDeps = _nuxt.options.vite.optimizeDeps || {}
    _nuxt.options.vite.optimizeDeps.include = _nuxt.options.vite.optimizeDeps.include || []

    for (const dep of ['pusher-js', 'laravel-echo']) {
      if (!_nuxt.options.vite.optimizeDeps.include.includes(dep)) {
        _nuxt.options.vite.optimizeDeps.include.push(dep)
      }
    }

    addPlugin(resolver.resolve('./runtime/plugin.client'))
    addImportsDir(resolver.resolve('./runtime/composables'))

    registerTypeTemplates(resolver)

    logger.info('Laravel Echo module initialized!')
  },
})

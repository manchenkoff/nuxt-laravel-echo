import type { NuxtApp } from '#app'
import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'

export default defineAppConfig({
  echo: {
    interceptors: {
      async onRequest(
        _app: NuxtApp,
        ctx: FetchContext,
        logger: ConsolaInstance
      ): Promise<void> {
        const tenant = 'random-string'

        ctx.options.headers.set('X-Echo-Tenant', tenant)
        logger.debug('Updated tenant header', tenant)
      }
    },
  }
})

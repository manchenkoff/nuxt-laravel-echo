export default defineAppConfig({
  echo: {
    interceptors: {
      async onRequest(_app, ctx, logger) {
        const tenant = 'random-string'

        ctx.options.headers.set('X-Echo-Tenant', tenant)
        logger.debug('Updated tenant header', tenant)
      }
    },
  }
})

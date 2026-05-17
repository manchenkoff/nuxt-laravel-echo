import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],

  ssr: true,

  compatibilityDate: '2026-01-01',

  echo: {
    key: 'test-key',
    scheme: 'http',
    host: 'localhost',
    port: 6001,
    logLevel: 5,
    authentication: {
      mode: 'cookie',
      baseUrl: '/',
      authEndpoint: '/api/broadcasting-auth',
      csrfEndpoint: '/api/csrf',
      csrfCookie: 'XSRF-TOKEN',
      csrfHeader: 'X-XSRF-TOKEN',
    },
  },
})

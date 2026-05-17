import type { ModuleOptions } from './runtime/types/options'

export const defaultModuleOptions: ModuleOptions = {
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

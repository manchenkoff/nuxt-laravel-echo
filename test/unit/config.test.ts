import { describe, it, expect } from 'vitest'
import { defu } from 'defu'
import { defaultModuleOptions } from '../../src/config'
import type { ModuleOptions } from '../../src/runtime/types/options'

describe('default config', () => {
  it('should have correct default values for all config keys', () => {
    expect(defaultModuleOptions).toStrictEqual({
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
    })
  })
})

describe('config merging', () => {
  it('should merge user config with defaults', () => {
    const userConfig = {
      host: 'echo.example.com',
      port: 6001,
      authentication: {
        mode: 'token' as const,
        baseUrl: 'https://api.example.com',
      },
    }

    const merged = defu(userConfig, defaultModuleOptions) as ModuleOptions

    expect(merged.host).toBe('echo.example.com')
    expect(merged.port).toBe(6001)
    expect(merged.scheme).toBe(defaultModuleOptions.scheme)
    expect(merged.transports).toBe(defaultModuleOptions.transports)
    expect(merged.broadcaster).toBe(defaultModuleOptions.broadcaster)
    expect(merged.authentication!.mode).toBe('token')
    expect(merged.authentication!.baseUrl).toBe('https://api.example.com')
    expect(merged.authentication!.authEndpoint).toBe(defaultModuleOptions.authentication!.authEndpoint)
    expect(merged.authentication!.csrfEndpoint).toBe(defaultModuleOptions.authentication!.csrfEndpoint)
  })
})

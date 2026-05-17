import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNuxtApp } from '#app'
import { createEcho } from '~/src/runtime/factories/echo'
import type { ModuleOptions } from '~/src/runtime/types/options'

const {
  EchoMock,
  createFetchClientMock,
  createErrorMock,
} = vi.hoisted(() => ({
  EchoMock: vi.fn(),
  createFetchClientMock: vi.fn(),
  createErrorMock: vi.fn((msg: string) => new Error(msg)),
}))

vi.mock('laravel-echo', () => ({ default: EchoMock }))

vi.mock('~/src/runtime/factories/http', () => ({
  createFetchClient: createFetchClientMock,
}))

mockNuxtImport('createError', () => createErrorMock)

function loggerMock() {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as never
}

describe('createEcho', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates Echo with reverb config', () => {
    const config = {
      broadcaster: 'reverb',
      key: 'test-key',
      host: 'localhost',
      port: 8080,
      scheme: 'https',
      transports: ['ws', 'wss'],
      logLevel: 3,
      authentication: {
        mode: 'cookie',
        baseUrl: 'http://localhost:80',
        authEndpoint: '/broadcasting/auth',
        csrfEndpoint: '/sanctum/csrf-cookie',
        csrfCookie: 'XSRF-TOKEN',
        csrfHeader: 'X-XSRF-TOKEN',
      },
    } as ModuleOptions

    createEcho(useNuxtApp(), config, loggerMock())

    expect(EchoMock).toHaveBeenCalledWith({
      broadcaster: 'reverb',
      key: 'test-key',
      wsHost: 'localhost',
      wsPort: 8080,
      wssPort: 8080,
      forceTLS: true,
      enabledTransports: ['ws', 'wss'],
      authorizer: expect.any(Function),
    })
  })

  it('creates Echo with pusher config', () => {
    const config = {
      broadcaster: 'pusher',
      key: 'pusher-key',
      cluster: 'mt1',
      scheme: 'https',
      logLevel: 3,
      authentication: {
        mode: 'cookie',
        baseUrl: 'http://localhost:80',
        authEndpoint: '/broadcasting/auth',
      },
    } as ModuleOptions

    createEcho(useNuxtApp(), config, loggerMock())

    expect(EchoMock).toHaveBeenCalledWith({
      broadcaster: 'pusher',
      key: 'pusher-key',
      cluster: 'mt1',
      forceTLS: true,
      authorizer: expect.any(Function),
    })
  })

  it('creates Echo with custom properties', () => {
    const config = {
      broadcaster: 'reverb',
      key: 'test-key',
      scheme: 'https',
      logLevel: 3,
      properties: {
        namespace: 'App.Events',
      },
    } as ModuleOptions

    createEcho(useNuxtApp(), config, loggerMock())

    expect(EchoMock).toHaveBeenCalledWith(expect.objectContaining({
      namespace: 'App.Events',
    }))
  })

  it('throws when broadcaster is unsupported', () => {
    const config = {
      broadcaster: 'ably',
      key: 'test-key',
      scheme: 'https',
      logLevel: 3,
    } as ModuleOptions

    expect(() => createEcho(useNuxtApp(), config, loggerMock())).toThrow('Unsupported broadcaster: ably')
  })

  it('creates Echo without authentication', () => {
    const config = {
      broadcaster: 'reverb',
      key: 'test-key',
      scheme: 'https',
      logLevel: 3,
    } as ModuleOptions

    createEcho(useNuxtApp(), config, loggerMock())

    expect(EchoMock).toHaveBeenCalledWith(expect.objectContaining({
      authorizer: undefined,
    }))
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAppMock, createFetchCtxMock, createLoggerMock } from '../../helpers/mocks'
import handleCsrfCookie from '../../../src/runtime/interceptors/csrf'

const {
  useCookieMock,
  fetchMock,
} = vi.hoisted(() => ({
  useCookieMock: vi.fn(),
  fetchMock: vi.fn(),
}))

vi.stubGlobal('$fetch', fetchMock)

vi.mock('#app', () => ({
  useCookie: useCookieMock,
}))

describe('handleCsrfCookie', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns early when mode is not cookie', async () => {
    const app = createAppMock({
      $config: {
        public: {
          echo: {
            authentication: { mode: 'token' },
          },
        },
      },
    })

    const ctx = createFetchCtxMock()
    const logger = createLoggerMock()

    await handleCsrfCookie(app, ctx, logger)

    expect(useCookieMock).not.toHaveBeenCalled()
  })

  it('returns early when authentication is not defined', async () => {
    const app = createAppMock({
      $config: {
        public: {
          echo: {},
        },
      },
    })

    const ctx = createFetchCtxMock()
    const logger = createLoggerMock()

    await handleCsrfCookie(app, ctx, logger)

    expect(useCookieMock).not.toHaveBeenCalled()
  })

  it('throws when csrfCookie is undefined', async () => {
    const app = createAppMock({
      $config: {
        public: {
          echo: {
            authentication: {
              mode: 'cookie',
              csrfCookie: undefined,
            },
          },
        },
      },
    })

    const ctx = createFetchCtxMock()
    const logger = createLoggerMock()

    await expect(handleCsrfCookie(app, ctx, logger))
      .rejects
      .toThrow(`'echo.authentication.csrfCookie' is not defined`)
  })

  it('sets CSRF header when cookie exists', async () => {
    useCookieMock.mockReturnValue({ value: 'csrf-token-value' })

    const app = createAppMock({
      $config: {
        public: {
          echo: {
            authentication: {
              mode: 'cookie',
              baseUrl: 'http://localhost:80',
              csrfCookie: 'XSRF-TOKEN',
              csrfHeader: 'X-XSRF-TOKEN',
              authEndpoint: '/broadcasting/auth',
            },
          },
        },
      },
    })

    const ctx = createFetchCtxMock()
    const logger = createLoggerMock()

    await handleCsrfCookie(app, ctx, logger)

    expect(ctx.options.headers.get('X-XSRF-TOKEN')).toBe('csrf-token-value')
  })

  it('throws when csrfHeader is undefined', async () => {
    useCookieMock.mockReturnValue({ value: 'csrf-token-value' })

    const app = createAppMock({
      $config: {
        public: {
          echo: {
            authentication: {
              mode: 'cookie',
              baseUrl: 'http://localhost:80',
              csrfCookie: 'XSRF-TOKEN',
              csrfHeader: undefined,
              authEndpoint: '/broadcasting/auth',
            },
          },
        },
      },
    })

    const ctx = createFetchCtxMock()
    const logger = createLoggerMock()

    await expect(handleCsrfCookie(app, ctx, logger))
      .rejects
      .toThrow(`'echo.authentication.csrfHeader' is not defined`)
  })

  it('fetches CSRF endpoint when cookie is missing', async () => {
    useCookieMock
      .mockReturnValueOnce({ value: undefined })
      .mockReturnValueOnce({ value: 'new-csrf-token' })

    const app = createAppMock({
      $config: {
        public: {
          echo: {
            authentication: {
              mode: 'cookie',
              baseUrl: 'http://localhost:80',
              csrfCookie: 'XSRF-TOKEN',
              csrfHeader: 'X-XSRF-TOKEN',
              csrfEndpoint: '/api/csrf',
              authEndpoint: '/broadcasting/auth',
            },
          },
        },
      },
    })

    const ctx = createFetchCtxMock()
    const logger = createLoggerMock()

    await handleCsrfCookie(app, ctx, logger)

    expect(fetchMock).toHaveBeenCalledWith('/api/csrf', {
      baseURL: 'http://localhost:80',
      credentials: 'include',
      retry: false,
    })
    expect(ctx.options.headers.get('X-XSRF-TOKEN')).toBe('new-csrf-token')
  })

  it('warns when cookie is still missing after fetch', async () => {
    useCookieMock.mockReturnValue({ value: undefined })

    const app = createAppMock({
      $config: {
        public: {
          echo: {
            authentication: {
              mode: 'cookie',
              baseUrl: 'http://localhost:80',
              csrfCookie: 'XSRF-TOKEN',
              csrfHeader: 'X-XSRF-TOKEN',
              csrfEndpoint: '/api/csrf',
              authEndpoint: '/broadcasting/auth',
            },
          },
        },
      },
    })

    const ctx = createFetchCtxMock()
    const logger = createLoggerMock()

    await handleCsrfCookie(app, ctx, logger)

    expect(fetchMock).toHaveBeenCalled()
    expect(logger.warn).toHaveBeenCalledWith(
      'XSRF-TOKEN cookie is missing, unable to set X-XSRF-TOKEN header',
    )
    expect(ctx.options.headers.has('X-XSRF-TOKEN')).toBe(false)
  })

  it('throws when csrfEndpoint is undefined and cookie is missing', async () => {
    useCookieMock.mockReturnValue({ value: undefined })

    const app = createAppMock({
      $config: {
        public: {
          echo: {
            authentication: {
              mode: 'cookie',
              baseUrl: 'http://localhost:80',
              csrfCookie: 'XSRF-TOKEN',
              csrfHeader: 'X-XSRF-TOKEN',
              csrfEndpoint: undefined,
              authEndpoint: '/broadcasting/auth',
            },
          },
        },
      },
    })

    const ctx = createFetchCtxMock()
    const logger = createLoggerMock()

    await expect(handleCsrfCookie(app, ctx, logger))
      .rejects
      .toThrow(`'echo.authentication.csrfCookie' is not defined`)
  })
})

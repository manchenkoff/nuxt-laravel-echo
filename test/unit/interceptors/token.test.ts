import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAppMock, createFetchCtxMock, createLoggerMock } from '../../helpers/mocks'
import handleAuthToken from '../../../src/runtime/interceptors/token'

const {
  createErrorMock,
  useEchoAppConfigMock,
} = vi.hoisted(() => ({
  createErrorMock: vi.fn((msg: string) => new Error(msg)),
  useEchoAppConfigMock: vi.fn(),
}))

vi.mock('#app', () => ({
  createError: createErrorMock,
}))

vi.mock('../../../src/runtime/composables/useEchoAppConfig', () => ({
  useEchoAppConfig: useEchoAppConfigMock,
}))

describe('handleAuthToken', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns early when mode is not token', async () => {
    const app = createAppMock({
      $config: {
        public: {
          echo: {
            authentication: { mode: 'cookie' },
          },
        },
      },
    })

    const ctx = createFetchCtxMock()
    const logger = createLoggerMock()

    await handleAuthToken(app, ctx, logger)

    expect(useEchoAppConfigMock).not.toHaveBeenCalled()
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

    await handleAuthToken(app, ctx, logger)

    expect(useEchoAppConfigMock).not.toHaveBeenCalled()
  })

  it('throws when tokenStorage is not defined', async () => {
    useEchoAppConfigMock.mockReturnValue({})

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

    await expect(handleAuthToken(app, ctx, logger))
      .rejects
      .toThrow('Token storage is not defined')

    expect(createErrorMock).toHaveBeenCalled()
  })

  it('sets Bearer token when token exists in storage', async () => {
    useEchoAppConfigMock.mockReturnValue({
      tokenStorage: { get: vi.fn().mockResolvedValue('my-auth-token') },
    })

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

    await handleAuthToken(app, ctx, logger)

    expect(ctx.options.headers.get('Authorization')).toBe('Bearer my-auth-token')
  })

  it('skips when token is missing from storage', async () => {
    useEchoAppConfigMock.mockReturnValue({
      tokenStorage: { get: vi.fn().mockResolvedValue(null) },
    })

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

    await handleAuthToken(app, ctx, logger)

    expect(ctx.options.headers.get('Authorization')).toBeNull()
    expect(logger.debug).toHaveBeenCalledWith('Authorization token is missing, unable to set header')
  })
})

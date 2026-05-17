import { setup, waitForHydration } from '@nuxt/test-utils/e2e'
import { fileURLToPath } from 'node:url'
import { describe, it } from 'vitest'
import { expect } from '@playwright/test'
import { actAsGuest, actAsUser } from '../helpers/auth'

const
  FIXTURE_DIR = '../fixtures/cookie',
  FIXTURE_URL = new URL(FIXTURE_DIR, import.meta.url),
  FIXTURE_PORT = 3001

describe('nuxt-laravel-echo module', async () => {
  await setup({
    rootDir: fileURLToPath(FIXTURE_URL),
    port: FIXTURE_PORT,
    browser: true,
  })

  it('initializes Echo and Pusher instances on the window', async () => {
    const page = await actAsGuest('/echo')
    await waitForHydration(page, '/echo')

    expect(await page.evaluate(() => typeof window.Echo !== 'undefined')).toBe(true)
    expect(await page.evaluate(() => typeof window.Pusher !== 'undefined')).toBe(true)
  })

  it('configures Echo with the module options from nuxt.config', async () => {
    const page = await actAsGuest('/echo')
    await waitForHydration(page, '/echo')

    const options = await page.evaluate(() => ({
      broadcaster: window.Echo.options.broadcaster,
      key: window.Echo.options.key,
      wsHost: window.Echo.options.wsHost,
      wsPort: window.Echo.options.wsPort,
      forceTLS: window.Echo.options.forceTLS,
    }))

    expect(options).toEqual({
      broadcaster: 'reverb',
      key: 'test-key',
      wsHost: 'localhost',
      wsPort: 6001,
      forceTLS: false,
    })
  })

  it('rejects private channel authorization for unauthenticated users', async () => {
    const page = await actAsGuest('/echo')
    await waitForHydration(page, '/echo')

    const result = await page.evaluate(async () => {
      const echo = window.Echo
      const authorizer = echo.options.authorizer({ name: 'private-test-channel' }, {})

      return await new Promise<{ ok: boolean, error: string | null }>((resolve) => {
        authorizer.authorize(
          'test-socket-123',
          (error: Error | null) => {
            resolve({ ok: !error, error: error?.message ?? null })
          },
        )
      })
    })

    expect(result.ok).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('authorizes private channel when session cookie is present', async () => {
    const page = await actAsUser('/echo')
    await waitForHydration(page, '/echo')

    const result = await page.evaluate(async () => {
      const echo = window.Echo
      const authorizer = echo.options.authorizer({ name: 'private-test-channel' }, {})

      return await new Promise<{ ok: boolean, auth: string | null }>((resolve) => {
        authorizer.authorize(
          'test-socket-123',
          (_error: Error | null, data: { auth: string }) => {
            resolve({ ok: !_error, auth: data?.auth ?? null })
          },
        )
      })
    })

    expect(result.ok).toBe(true)
    expect(result.auth).toBe('mock-signature-test-socket-123')
  })

  it('sets X-XSRF-TOKEN header on the auth request when cookie is missing', async () => {
    const page = await actAsGuest('/echo')
    await waitForHydration(page, '/echo')

    await page.evaluate(() => {
      document.cookie = 'XSRF-TOKEN=; Max-Age=0; path=/'
    })

    let capturedHeaders: Record<string, string> | null = null

    await page.route('**/api/broadcasting-auth', async (route) => {
      capturedHeaders = route.request().headers()

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ auth: 'mock' }),
      })
    })

    await page.evaluate(async () => {
      const echo = window.Echo
      const authorizer = echo.options.authorizer({ name: 'private-test-channel' }, {})

      return await new Promise<void>((resolve) => {
        authorizer.authorize('test-socket-123', () => resolve())
      })
    })

    expect(capturedHeaders).not.toBeNull()
    expect(capturedHeaders!['x-xsrf-token']).toBeDefined()
  })
})

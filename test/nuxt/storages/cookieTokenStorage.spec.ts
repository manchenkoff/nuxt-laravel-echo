import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useNuxtApp } from '#app'
import { cookieTokenStorage } from '~/src/runtime/storages/cookieTokenStorage'

const useCookieMock = vi.hoisted(() => vi.fn())

mockNuxtImport('useCookie', () => useCookieMock)

describe('cookieTokenStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('returns cookie value when it exists', async () => {
      useCookieMock.mockReturnValue({ value: 'test-token' })

      const app = useNuxtApp()

      const result = await cookieTokenStorage.get(app)

      expect(useCookieMock).toHaveBeenCalledWith('sanctum.token.cookie', { readonly: true })
      expect(result).toBe('test-token')
    })

    it('returns undefined when cookie value is null', async () => {
      useCookieMock.mockReturnValue({ value: null })

      const result = await cookieTokenStorage.get(useNuxtApp())

      expect(result).toBeUndefined()
    })

    it('returns undefined when cookie value is undefined', async () => {
      useCookieMock.mockReturnValue({ value: undefined })

      const result = await cookieTokenStorage.get(useNuxtApp())

      expect(result).toBeUndefined()
    })
  })

  describe('set', () => {
    it('sets cookie value', async () => {
      const cookieMock = { value: undefined as string | undefined }

      useCookieMock.mockReturnValue(cookieMock)

      await cookieTokenStorage.set(useNuxtApp(), 'new-token')

      expect(useCookieMock).toHaveBeenCalledWith('sanctum.token.cookie', { secure: true })
      expect(cookieMock.value).toBe('new-token')
    })

    it('clears cookie when token is undefined', async () => {
      const cookieMock = { value: 'old-token' as string | undefined }

      useCookieMock.mockReturnValue(cookieMock)

      await cookieTokenStorage.set(useNuxtApp(), undefined)

      expect(cookieMock.value).toBeUndefined()
    })
  })
})

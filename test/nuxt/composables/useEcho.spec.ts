import { useNuxtApp } from '#app'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type Echo from 'laravel-echo'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEcho } from '~/src/runtime/composables/useEcho'

const mockEchoInstance = { test: true } as unknown as Echo<'null'>

mockNuxtImport(useNuxtApp, original => vi.fn(original))

describe('useEcho', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the Echo instance from Nuxt app', () => {
    const useNuxtAppFn = vi
      .mocked(useNuxtApp)
      .getMockImplementation()!

    vi.mocked(useNuxtApp).mockImplementation(
      (...args) => ({
        ...useNuxtAppFn(...args),
        $echo: mockEchoInstance,
      }),
    )

    const result = useEcho()

    expect(result).toBe(mockEchoInstance)
  })
})

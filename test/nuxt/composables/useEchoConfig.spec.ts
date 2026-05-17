import { useRuntimeConfig } from '#imports'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEchoConfig } from '~/src/runtime/composables/useEchoConfig'
import type { ModuleOptions } from '~/src/runtime/types/options'

mockNuxtImport(useRuntimeConfig, original => vi.fn(original))

describe('useEchoConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the echo runtime config', async () => {
    const payload = {
      public: {
        echo: {
          broadcaster: 'reverb',
          logLevel: 3,
        }
      }
    } as unknown as ModuleOptions

    const useRuntimeConfigFn = vi
      .mocked(useRuntimeConfig)
      .getMockImplementation()!

    vi.mocked(useRuntimeConfig).mockImplementation(
      (...args) => ({
        ...useRuntimeConfigFn(...args),
        ...payload,
      }),
    )

    const result = useEchoConfig()

    expect(result).toEqual({
      broadcaster: 'reverb' as const,
      logLevel: 3,
    })

    expect(useRuntimeConfig).toHaveBeenCalled()
  })
})

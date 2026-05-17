import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEchoAppConfig } from '../../../src/runtime/composables/useEchoAppConfig'

const useAppConfigMock = vi.hoisted(() => vi.fn())

mockNuxtImport('useAppConfig', () => useAppConfigMock)

describe('useEchoAppConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the echo app config when defined', () => {
    useAppConfigMock.mockReturnValue({ echo: { tokenStorage: {} } })

    const result = useEchoAppConfig()

    expect(result).toEqual({ tokenStorage: {} })
    expect(useAppConfigMock).toHaveBeenCalled()
  })

  it('returns empty object when echo is not defined', () => {
    useAppConfigMock.mockReturnValue({})

    const result = useEchoAppConfig()

    expect(result).toEqual({})
    expect(useAppConfigMock).toHaveBeenCalled()
  })
})

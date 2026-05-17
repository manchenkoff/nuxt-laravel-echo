import type { NuxtApp } from '#app'
import type { ConsolaInstance } from 'consola'
import type { FetchContext } from 'ofetch'
import { vi } from 'vitest'

export function createMock<T>(mock: object = {}): T {
  return mock as T
}

export function createAppMock(mock: object = {}): NuxtApp {
  return createMock<NuxtApp>({
    callHook: vi.fn(),
    runWithContext: vi.fn().mockImplementation((fn: () => void) => { fn() }),
    ...mock,
  })
}

export function createLoggerMock(mock: object = {}): ConsolaInstance {
  return createMock<ConsolaInstance>({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    trace: vi.fn(),
    ...mock,
  })
}

export function createFetchCtxMock(mock: object = {}): FetchContext {
  return createMock<FetchContext>({
    options: { headers: new Headers() },
    ...mock,
  })
}

import type { FetchContext } from 'ofetch'
import type { ConsolaInstance } from 'consola'
import type { NuxtApp } from '#app'

/**
 * Handlers to work with authentication token.
 */
export interface TokenStorage {
  /**
   * Function to load a token from the storage.
   */
  get: (app: NuxtApp) => Promise<string | undefined>
  /**
   * Function to save a token to the storage.
   */
  set: (app: NuxtApp, token?: string) => Promise<void>
}

/**
 * Request interceptor.
 */
export type EchoInterceptor = (
  app: NuxtApp,
  ctx: FetchContext,
  logger: ConsolaInstance
) => Promise<void>

/**
 * Interceptors to be used by the ofetch client.
 */
export interface EchoInterceptors {
  /**
   * Function to execute before sending a request.
   */
  onRequest?: EchoInterceptor
  /**
   * Function to execute after receiving a response.
   */
  onResponse?: EchoInterceptor
}

/**
 * Echo configuration for the application side with user-defined handlers.
 */
export interface EchoAppConfig {
  /**
   * Token storage handlers to be used by the client.
   */
  tokenStorage?: TokenStorage
  /**
   * Request interceptors to be used by the client.
   */
  interceptors?: EchoInterceptors
}

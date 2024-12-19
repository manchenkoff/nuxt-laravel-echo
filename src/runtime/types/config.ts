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
 * Echo configuration for the application side with user-defined handlers.
 */
export interface EchoAppConfig {
  /**
   * Token storage handlers to be used by the client.
   */
  tokenStorage?: TokenStorage
}

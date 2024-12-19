export interface Authentication {
  /**
   * Authentication mode 'cookie' or 'token'
   * @default 'cookie'
   */
  mode: 'cookie' | 'token'
  /**
   * The base URL of Laravel application.
   * @default 'http://localhost:80'
   */
  baseUrl: string
  /**
   * The endpoint used for channels authentication.
   * @default '/broadcasting/auth'
   */
  authEndpoint?: string
  /**
   * The endpoint used for CSRF token retrieval.
   * @default '/sanctum/csrf-cookie'
   */
  csrfEndpoint?: string
  /**
   * The name of the CSRF cookie.
   * @default 'XSRF-TOKEN'
   */
  csrfCookie?: string
  /**
   * The name of the CSRF header.
   * @default 'X-XSRF-TOKEN'
   */
  csrfHeader?: string
}

export interface ModuleOptions {
  /**
   * The Laravel Broadcasting app key for a secure connection.
   * @default undefined
   */
  key?: string
  /**
   * The Laravel broadcaster type to use.
   * @default 'reverb'
   */
  broadcaster: 'reverb' | 'pusher'
  /**
   * The host to connect to WebSocket.
   * @default 'localhost'
   */
  host?: string
  /**
   * The port to connect to WebSocket.
   * @default 8080
   */
  port?: number
  /**
   * The scheme to use for the connection.
   * @default 'https'
   */
  scheme: 'http' | 'https'
  /**
   * The application cluster to connect to.
   * @default undefined
   */
  cluster?: string
  /**
   * The transports to enable for the connection.
   * @default ['ws','wss']
   */
  transports?: string[]
  /**
   * Authentication options for Private and Presence channels.
   */
  authentication?: Authentication
  /**
   * The log level to use for the logger.
   *
   * 0: Fatal and Error
   * 1: Warnings
   * 2: Normal logs
   * 3: Informational logs
   * 4: Debug logs
   * 5: Trace logs
   *
   * More details at https://github.com/unjs/consola?tab=readme-ov-file#log-level
   * @default 3
   */
  logLevel: number
  /**
   * Additional properties to extend the Echo instance options.
   * @default undefined
   */
  properties?: object
}

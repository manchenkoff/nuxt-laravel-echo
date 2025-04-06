import { addTypeTemplate, type Resolver } from '@nuxt/kit'

/**
 * Defines module's type augmentation for Nuxt build
 * @param resolver
 */
export const registerTypeTemplates = (resolver: Resolver) => {
  addTypeTemplate({
    filename: 'types/echo.d.ts',
    getContents: () => `// Generated by nuxt-laravel-echo module
import type { EchoAppConfig } from '${resolver.resolve('./runtime/types/config.ts')}';

declare module 'nuxt/schema' {
    interface AppConfig {
        echo?: EchoAppConfig;
    }
    interface AppConfigInput {
        echo?: EchoAppConfig;
    }
}

declare module '@nuxt/schema' {
    interface AppConfig {
        echo?: EchoAppConfig;
    }
    interface AppConfigInput {
        echo?: EchoAppConfig;
    }
}

export {};`,
  })
}

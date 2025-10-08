# Nuxt Laravel Echo

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt module for Laravel Echo integration to get a seamless experience with application broadcasting.

- [Documentation](https://echo.manchenkoff.me)
- [Features](#features)
- [Quick Setup](#quick-setup)
- [Release Notes](/CHANGELOG.md)

## Features

- Sanctum-based authentication
- CSRF cookie management for Private and Presence channels
- CSR-only mode
- TypeScript support

**Note:** Before using this module, make sure you have a [Laravel Echo](https://laravel.com/docs/11.x/broadcasting) server running and properly configured.

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-laravel-echo
```

Then provide the configuration in your `nuxt.config.js`:

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-laravel-echo'],

  echo: {
    key: 'REPLACE_ME', // Your Laravel Echo app key
    authentication: {
      baseUrl: 'laravel.test', // Your Laravel app URL
    },
  },
})
```

Also, to enable Dev server compatibility with Pusher, you need to add the following Vite configuration to your `nuxt.config.js`:

```typescript
export default defineNuxtConfig({
  vite: {
    optimizeDeps: {
      include: ['pusher-js'],
    },
  },
})
```

That's it! You can now use Nuxt Laravel Echo in your Nuxt app ✨

## Contribution

If you want to contribute to this project and make it better, your help is very welcome. Check the [Contribution Guide](/CONTRIBUTING.md) for more information.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-laravel-echo/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-laravel-echo
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-laravel-echo.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-laravel-echo
[license-src]: https://img.shields.io/npm/l/nuxt-laravel-echo.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-laravel-echo
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com

### Powered by
[![JetBrains logo.](https://resources.jetbrains.com/storage/products/company/brand/logos/jetbrains.svg)](https://jb.gg/OpenSource)


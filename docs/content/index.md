---
seo:
  title: Nuxt - Laravel Echo
  description: Nuxt module for Laravel Echo integration to get a seamless experience with application broadcasting.
---

::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal
---
#top
:hero-background

#title
Use broadcasting [easily]{.text-primary}.

#description
The only module you need to set up your Laravel Broadcasting for Nuxt application!

#links
  :::u-button
  ---
  to: /getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  icon: i-simple-icons-github
  color: neutral
  variant: outline
  size: xl
  to: https://github.com/sponsors/manchenkoff?o=esb
  target: _blank
  ---
  Support project
  :::

  :::u-button
  ---
  icon: i-simple-icons-buymeacoffee
  color: neutral
  variant: outline
  size: xl
  to: https://buymeacoffee.com/manchenkoff
  target: _blank
  ---
  Buy me a coffee
  :::


#default
  :::prose-pre
  ---
  code: npx nuxi@latest module add nuxt-laravel-echo
  filename: Install module
  ---

  ```bash
  npx nuxi@latest module add nuxt-laravel-echo
  ```
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
Features

#links
  :::u-button
  ---
  color: neutral
  size: lg
  to: /getting-started
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Explore Nuxt Laravel Echo
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-palette
  ---
  #title
  Sanctum-based

  #description
  Module leverages Sanctum security for Private and Presence channels 
  :::

  :::u-page-feature
  ---
  icon: i-lucide-type
  ---
  #title
  CSRF management

  #description
  All Private/Presence channels cookie management is on us, focus on broadcasting!
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  CSR-only

  #description
  Since Laravel Echo relies on the browser, this module works only in Client mode (SSR is disabled)
  :::

  :::u-page-feature
  ---
  icon: i-lucide-search
  ---
  #title
  TypeScript

  #description
  Code of this module is written entirely in TypeScript and supports autocompletion
  :::

  :::u-page-feature
  ---
  icon: i-lucide-navigation
  ---
  #title
  Predefined configuration

  #description
  You just set your Laravel URL and Echo key and you are ready to go! 
  :::

  :::u-page-feature
  ---
  icon: i-lucide-moon
  ---
  #title
  Open-source

  #description
  Source code is forever-free and open for contributions!
  :::
::

::u-page-section{class="dark:bg-gradient-to-b from-neutral-950 to-neutral-900"}
  :::u-page-c-t-a
  ---
  links:
    - label: Start broadcasting
      to: '/getting-started'
      trailingIcon: i-lucide-arrow-right
    - label: View on GitHub
      to: 'https://github.com/manchenkoff/nuxt-laravel-echo'
      target: _blank
      variant: subtle
      icon: i-simple-icons-github
  title: Ready to send an amazing event?
  description: Broadcast hundreds of events with Laravel, Echo and Nuxt today!
  class: dark:bg-neutral-950
  ---

  :stars-background
  :::
::


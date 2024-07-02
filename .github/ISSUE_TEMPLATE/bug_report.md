---
name: Bug report
about: Create a report for a bug or incorrect behavior of the project
title: "[Bug] Short description"
labels: bug
assignees: manchenkoff
---

**Describe the bug**

A clear and concise description of what the bug is.

**To Reproduce**

Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**

A clear and concise description of what you expected to happen.

**Screenshots**

If applicable, add screenshots to help explain your problem.

**Module information**

- Version: <INSTALLED_MODULE_VERSION>
- Complete configuration of `echo` from your `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  modules: ["nuxt-laravel-echo"],

  echo: {
    baseUrl: "http://localhost:80",
  },
});
```

**Nuxt environment:**

- Version: <YOUR_NUXT_VERSION>
- SSR Enabled: <YES/NO>
- Environment: <LOCAL/PRODUCTION>

**Additional context**

Add any other context about the problem here. For instance, you can attach the details about the request/response of the application or logs from the backend to make this problem easier to understand.

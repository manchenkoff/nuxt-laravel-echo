import { createPage, url, type NuxtPage } from '@nuxt/test-utils/e2e'

function base64(value: string): string {
  return Buffer.from(value).toString('base64')
}

export async function actAsGuest(route: string = '/'): Promise<NuxtPage> {
  return await createPage(url(route))
}

export async function actAsUser(route: string = '/'): Promise<NuxtPage> {
  const page = await createPage(url('/'))

  await page.context().addCookies([
    { name: 'laravel_session', value: base64('1'), url: url('/') },
  ])

  if (route !== '/') {
    await page.goto(url(route))
  }

  return page
}

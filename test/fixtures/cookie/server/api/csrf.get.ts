import { setCookie, setResponseStatus } from 'h3'

function generateRandomToken(): string {
  return Array
    .from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export default defineEventHandler((event) => {
  setCookie(event, 'XSRF-TOKEN', generateRandomToken(), {
    httpOnly: false,
    path: '/',
    sameSite: 'lax',
  })

  setResponseStatus(event, 204)
  return null
})

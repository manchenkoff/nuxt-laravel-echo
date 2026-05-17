import { getCookie, readBody, setResponseStatus, createError } from 'h3'

const SESSION_COOKIE_NAME = 'laravel_session'

export default defineEventHandler(async (event) => {
  const sessionCookie = getCookie(event, SESSION_COOKIE_NAME)

  if (!sessionCookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody<{ socket_id: string, channel_name: string }>(event)

  if (!body.socket_id || !body.channel_name) {
    setResponseStatus(event, 422)
    return { message: 'Missing socket_id or channel_name' }
  }

  setResponseStatus(event, 200)

  return {
    auth: `mock-signature-${body.socket_id}`,
  }
})

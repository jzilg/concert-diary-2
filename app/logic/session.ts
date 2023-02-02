import { createCookieSessionStorage } from '@remix-run/node'
import config from '~/config'

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    maxAge: 60 * 60, // 5min
    path: '/',
    httpOnly: true,
    secrets: [config.sessionCookieSecret],
    secure: !config.modeIsDevelopment,

    // all of these are optional
    // sameSite: 'lax',
  },
})

export {
  getSession,
  commitSession,
  destroySession,
}

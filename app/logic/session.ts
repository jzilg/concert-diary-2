import { createCookieSessionStorage } from '@remix-run/node'
import config from '~/config'

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    maxAge: 5 * 60 /* sec */,
    path: '/',
    httpOnly: true,
    secrets: [config.sessionCookieSecret],
    secure: !config.modeIsDevelopment,
  },
})

export { getSession, commitSession, destroySession }

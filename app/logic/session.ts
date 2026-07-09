import { createCookieSessionStorage, type Session } from 'react-router'
import config from '~/config'

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__session',
      maxAge: 5 * 60 /* sec */,
      path: '/',
      httpOnly: true,
      secrets: [config.sessionCookieSecret],
      secure: !config.modeIsDevelopment,
    },
  })

export const getUserIdFromSession = (session: Session) => {
  const data = session.get('userId')

  return typeof data === 'string' ? data : undefined
}

export { getSession, commitSession, destroySession }

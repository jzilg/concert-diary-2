export default Object.freeze({
  modeIsDevelopment: process.env.NODE_ENV === 'development',
  dbClient: process.env.DB_CLIENT || '',
  dbAuthSource: process.env.DB_AUTH_SOURCE || '',
  dbAuthUser: process.env.DB_AUTH_USER || '',
  dbAuthPassword: process.env.DB_AUTH_PASSWORD || '',
  sessionCookieSecret: process.env.SESSION_COOKIE_SECRET || '',
  registerToken: process.env.REGISTER_TOKEN || '',
})

/** biome-ignore-all lint/complexity/useLiteralKeys: conflict with ts compiler */

export default Object.freeze({
  modeIsDevelopment: process.env['NODE_ENV'] === 'development',
  sessionCookieSecret: process.env['SESSION_COOKIE_SECRET'] || '',
  registerToken: process.env['REGISTER_TOKEN'] || '',
  dropboxAccessToken: process.env['DROPBOX_ACCESS_TOKEN'] || '',
})

import { data as json } from 'react-router'

const uncachedJson = <Data>(cookie: string, data: Data) =>
  json(data, {
    headers: {
      'Set-Cookie': cookie,
      'Cache-Control': 'private, no-store',
    },
  })

export default uncachedJson

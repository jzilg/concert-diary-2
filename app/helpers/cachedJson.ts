import MD5 from 'crypto-js/md5'
import { data as json } from 'react-router'

function cachedJson<Data>(request: Request, cookie: string, data: Data) {
  const hash = MD5(JSON.stringify(data)).toString()

  if (hash === request.headers.get('If-None-Match')) {
    return new Response(undefined, {
      status: 304,
      headers: {
        'Set-Cookie': cookie,
      },
    })
  }

  return json(data, {
    headers: {
      'Set-Cookie': cookie,
      'Cache-Control': 'max-age=0, must-revalidate',
      ETag: hash,
    },
  })
}

export default cachedJson

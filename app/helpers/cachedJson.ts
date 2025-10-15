import MD5 from 'crypto-js/md5'
import { data as json } from 'react-router'

function cachedJson<Data>(request: Request, data: Data) {
  const hash = MD5(JSON.stringify(data)).toString()

  if (hash === request.headers.get('If-None-Match')) {
    return new Response(undefined, {
      status: 304,
    })
  }

  return json(data, {
    headers: {
      'Cache-Control': 'max-age=0, must-revalidate',
      ETag: hash,
    },
  })
}

export default cachedJson

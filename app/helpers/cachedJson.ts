import MD5 from 'crypto-js/md5'
import { json } from '@remix-run/node'

const cachedJson = (request: Request, data: unknown): Response => {
  const hash = MD5(JSON.stringify(data)).toString()

  if (hash === request.headers.get('If-None-Match')) {
    return new Response(null, {
      status: 304,
    })
  }

  return json(data, {
    headers: {
      'Cache-Control': 'max-age=0, must-revalidate',
      etag: hash,
    },
  })
}

export default cachedJson

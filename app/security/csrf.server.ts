import { randomBytes, timingSafeEqual } from 'node:crypto'
import type { Session } from 'react-router'
import config from '~/config'
import { csrfFieldName } from '~/security/csrf'

export { csrfFieldName } from '~/security/csrf'

const csrfSessionKey = 'csrfToken'

const forbidden = () =>
  new Response('Forbidden', {
    status: 403,
    statusText: 'Forbidden',
  })

const getExpectedOrigin = (request: Request) => {
  const configuredOrigin = config.appOrigin.trim()

  if (configuredOrigin === '') {
    if (config.modeIsDevelopment) {
      return new URL(request.url).origin
    }

    throw new Response('APP_ORIGIN must be configured', {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }

  try {
    const configuredUrl = new URL(configuredOrigin)

    if (configuredOrigin !== configuredUrl.origin) {
      throw new Error('APP_ORIGIN must contain only the origin')
    }

    return configuredUrl.origin
  } catch {
    throw new Response('APP_ORIGIN is invalid', {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
}

const tokensMatch = (
  expected: string,
  submitted: FormDataEntryValue | null,
) => {
  if (typeof submitted !== 'string') {
    return false
  }

  const expectedBuffer = Buffer.from(expected)
  const submittedBuffer = Buffer.from(submitted)

  return (
    expectedBuffer.length === submittedBuffer.length &&
    timingSafeEqual(expectedBuffer, submittedBuffer)
  )
}

export const getCsrfToken = (session: Session) => {
  const token = session.get(csrfSessionKey)

  if (typeof token === 'string' && token !== '') {
    return token
  }

  const newToken = randomBytes(32).toString('base64url')
  session.set(csrfSessionKey, newToken)

  return newToken
}

export const validateCsrfRequest = async (
  request: Request,
  session: Session,
) => {
  const origin = request.headers.get('Origin')

  if (origin === null || origin !== getExpectedOrigin(request)) {
    throw forbidden()
  }

  const fetchSite = request.headers.get('Sec-Fetch-Site')

  if (
    fetchSite !== null &&
    fetchSite !== 'same-origin' &&
    fetchSite !== 'none'
  ) {
    throw forbidden()
  }

  const formData = await request.formData()
  const expectedToken = session.get(csrfSessionKey)

  if (
    typeof expectedToken !== 'string' ||
    !tokensMatch(expectedToken, formData.get(csrfFieldName))
  ) {
    throw forbidden()
  }

  return formData
}

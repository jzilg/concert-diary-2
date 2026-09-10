import { randomBytes, timingSafeEqual } from 'node:crypto'
import config from '~/config'
import { csrfFieldName } from '~/security/csrf'

export { csrfFieldName } from '~/security/csrf'

export const csrfSessionKey = 'csrfToken'

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

export const getCsrfToken = () => randomBytes(32).toString('base64url')

export const validateCsrfRequest = async (
  request: Request,
  expectedToken: unknown,
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

  if (
    typeof expectedToken !== 'string' ||
    !tokensMatch(expectedToken, formData.get(csrfFieldName))
  ) {
    throw forbidden()
  }

  return formData
}

export const extractStringFromBody = (body: FormData) => (name: string) => {
  const value = body.get(name)

  return typeof value !== 'string' ? '' : value
}

export const extractListFromBody = (body: FormData) => (name: string) => {
  const string = extractStringFromBody(body)(name)

  return string.length > 0 ? string.split(', ') : []
}

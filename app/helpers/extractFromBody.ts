export const extractStringFromBody = (body: FormData) => (name: string): string => {
  const value = body.get(name)

  if (value === null) {
    return ''
  }

  return typeof value === 'string' ? value : ''
}

export const extractListFromBody = (body: FormData) => (name: string): string[] => {
  const string = extractStringFromBody(body)(name)

  return string.length > 0 ? string.split(', ') : []
}

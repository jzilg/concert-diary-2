export const splitArray = (data: unknown) => {
  const array = typeof data === 'string' ? data.split(', ') : []

  return array.filter(Boolean)
}

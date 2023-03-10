import concertsProvider from '~/providers/concertsProvider'
import type User from '~/entities/User'
import type Concert from '~/entities/Concert'

// eslint-disable-next-line import/prefer-default-export
export const getSortedConcertsOfUser = async (userId: User['id']): Promise<Concert[]> => {
  const concerts = await concertsProvider(userId).getAll()
  const sortedConcerts = [...concerts].sort(((concert0, concert1) => {
    const timestamp0 = new Date(concert0.date).getTime()
    const timestamp1 = new Date(concert1.date).getTime()

    return timestamp1 - timestamp0
  }))

  return sortedConcerts
}

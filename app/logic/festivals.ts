import festivalsProvider from '~/providers/festivalsProvider'
import type User from '~/entities/User'
import type Festival from '~/entities/Festival'

// eslint-disable-next-line import/prefer-default-export
export const getSortedFestivalsOfUser = async (userId: User['id']): Promise<Festival[]> => {
  const festivals = await festivalsProvider(userId).getAll()
  const sortedFestivals = [...festivals].sort(((festival0, festival1) => {
    const timestamp0 = new Date(festival0.date.from).getTime()
    const timestamp1 = new Date(festival1.date.from).getTime()

    return timestamp1 - timestamp0
  }))

  return sortedFestivals
}

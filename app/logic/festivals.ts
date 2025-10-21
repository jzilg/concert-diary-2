import type { User } from '~/entities/User'
import festivalsProvider from '~/providers/festivalsProvider'

export const getSortedFestivalsOfUser = async (userId: User['id']) => {
  const festivals = await festivalsProvider(userId).getAll()
  const sortedFestivals = festivals.toSorted((festival0, festival1) => {
    const timestamp0 = new Date(festival0.date.from).getTime()
    const timestamp1 = new Date(festival1.date.from).getTime()

    return timestamp1 - timestamp0
  })

  return sortedFestivals
}

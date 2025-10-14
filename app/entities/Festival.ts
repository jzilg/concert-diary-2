import createId from 'uniqid'
import { z } from 'zod'
import dateRegEx from '~/helpers/dateRegEx'

type Festival = {
  id: string
  date: {
    from: string
    until: string
  }
  name: string
  bands: string[]
  companions: string[]
}

export const createFestival = (festivalData: Partial<Festival>): Festival => {
  const schema = z.object({
    id: z.string().default(createId()),
    date: z.object({
      from: z.string().regex(dateRegEx),
      until: z.string().regex(dateRegEx),
    }),
    name: z.string().min(1),
    bands: z.array(z.string()),
    companions: z.array(z.string()),
  })

  const validatedFestivalData = schema.parse(festivalData)

  return Object.freeze(validatedFestivalData)
}

export default Festival

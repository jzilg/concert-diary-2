import createId from 'uniqid'
import { z } from 'zod'
import dateRegEx from '~/helpers/dateRegEx'

type Concert = {
  id: string
  date: string
  band: string
  supportBands: string[]
  location: string
  companions: string[]
}

export const createConcert = (concertData: Partial<Concert>): Concert => {
  const schema = z.object({
    id: z.string().default(createId()),
    band: z.string().min(1),
    date: z.string().regex(dateRegEx),
    location: z.string(),
    supportBands: z.array(z.string()),
    companions: z.array(z.string()),
  })

  const validatedConcertData = schema.parse(concertData)

  return Object.freeze(validatedConcertData)
}

export default Concert

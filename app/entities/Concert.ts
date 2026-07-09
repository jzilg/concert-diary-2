import createId from 'uniqid'
import { z } from 'zod'
import dateRegEx from '~/helpers/dateRegEx'

export type Concert = {
  id: string
  date: string
  band: string
  supportBands: string[]
  location: string
  companions: string[]
}

export const createConcert = (
  concertData: Record<keyof Concert, unknown>,
): Concert => {
  const schema = z.object({
    id: z.string().default(createId()),
    band: z.string().min(1),
    date: z.string().regex(dateRegEx),
    location: z.string(),
    supportBands: z.array(z.string()),
    companions: z.array(z.string()),
  })

  return schema.parse(concertData)
}

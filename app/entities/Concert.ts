import * as validate from 'yup'
import createId from 'uniqid'
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
  const schema = validate.object({
    id: validate
      .string()
      .default(createId()),
    band: validate
      .string()
      .min(1)
      .required(),
    date: validate
      .string()
      .matches(dateRegEx)
      .required(),
    location: validate
      .string()
      .required(),
    supportBands: validate
      .array(validate
        .string()
        .required())
      .required(),
    companions: validate
      .array(validate
        .string()
        .required())
      .required(),
  }).noUnknown()

  const validatedConcertData = schema.validateSync(concertData)

  return Object.freeze(validatedConcertData)
}

export default Concert

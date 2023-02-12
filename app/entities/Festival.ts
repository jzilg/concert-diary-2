import * as validate from 'yup'
import createId from 'uniqid'
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
  const schema = validate.object({
    id: validate
      .string()
      .default(createId()),
    date: validate
      .object({
        from: validate
          .string()
          .matches(dateRegEx)
          .required(),
        until: validate
          .string()
          .matches(dateRegEx)
          .required(),
      }),
    name: validate
      .string()
      .min(1)
      .required(),
    bands: validate
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

  const validatedFestivalData = schema.validateSync(festivalData)

  return Object.freeze(validatedFestivalData)
}

export default Festival

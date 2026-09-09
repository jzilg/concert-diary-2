import type { FC } from 'react'
import { csrfFieldName } from '~/security/csrf'

type Props = {
  token: string
}

const CsrfInput: FC<Props> = ({ token }) => (
  <input name={csrfFieldName} type="hidden" value={token} />
)

export default CsrfInput

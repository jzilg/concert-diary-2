import type { ReactNode } from 'react'

const renderIf = (element: ReactNode, condition: boolean): ReactNode =>
  condition ? element : null

export default renderIf

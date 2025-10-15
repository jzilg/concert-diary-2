import type { ReactNode } from 'react'

const renderIf = (element: ReactNode, condition: boolean) =>
  condition ? element : undefined

export default renderIf

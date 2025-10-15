import type { FC } from 'react'
import { redirect } from 'react-router'

export const loader = () => redirect('/concerts')

const Index: FC = () => {
  return undefined
}

export default Index

import type { FC } from 'react'
import { redirect, useLoaderData } from 'react-router'

export const loader = () => redirect('/concerts')

const Index: FC = () => {
  useLoaderData()

  return undefined
}

export default Index

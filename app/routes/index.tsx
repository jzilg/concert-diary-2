import type { FC } from 'react'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader: LoaderFunction = () => redirect('/concerts')

const Index: FC = () => {
  useLoaderData()

  return null
}

export default Index

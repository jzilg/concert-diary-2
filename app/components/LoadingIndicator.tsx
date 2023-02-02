import type { FC } from 'react'
import { useFetchers, useTransition } from '@remix-run/react'

const LoadingIndicator: FC = () => {
  const { submission } = useTransition()
  const fetchers = useFetchers()
  const everyFetcherIsIdle = fetchers.every((fetcher) => fetcher.state === 'idle')

  if (submission === undefined && everyFetcherIsIdle) {
    return null
  }

  return (
    <div className="fixed top-2 left-2">Loading...</div>
  )
}

export default LoadingIndicator

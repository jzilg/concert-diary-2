import type { FC } from 'react'
import { useFetchers, useNavigation } from 'react-router'

const LoadingIndicator: FC = () => {
  const { state: navigationState } = useNavigation()
  const fetchers = useFetchers()
  const everyFetcherIsIdle = fetchers.every(
    (fetcher) => fetcher.state === 'idle',
  )

  if (navigationState === 'idle' && everyFetcherIsIdle) {
    return null
  }

  return <div className="fixed top-2 left-2">Loading...</div>
}

export default LoadingIndicator

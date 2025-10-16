import type { FC } from 'react'
import { useFetchers, useNavigation } from 'react-router'

const LoadingIndicator: FC = () => {
  const { state: navigationState } = useNavigation()
  const fetchers = useFetchers()
  const everyFetcherIsIdle = fetchers.every(
    (fetcher) => fetcher.state === 'idle',
  )

  if (navigationState === 'idle' && everyFetcherIsIdle) {
    return undefined
  }

  return (
    <div className="fixed top-2 w-full flex justify-center fade-in">
      <div className="size-8 border-5  border-t-blue-600 dark:border-t-amber-500 rounded-full animate-spin"></div>
      <div className="sr-only">Loading...</div>
    </div>
  )
}

export default LoadingIndicator

import type { FC, PropsWithChildren } from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import { ToastContainer } from 'react-toastify'
import type { Route } from './+types/root'
import 'react-toastify/dist/ReactToastify.css'
import './app.css'
import LoadingIndicator from '~/components/LoadingIndicator'

export const meta: Route.MetaFunction = () => [{ title: 'Concert Diary' }]

export const links: Route.LinksFunction = () => [
  {
    rel: 'shortcut icon',
    href: 'favicon.png',
    sizes: '196x196',
  },
]

export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,maximum-scale=1"
      />
      <Meta />
      <Links />
    </head>
    <body className="bg-gray-50 dark:bg-slate-900 dark:text-white">
      <LoadingIndicator />
      <ToastContainer />
      {children}
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
)

const App: FC = () => <Outlet />

export const ErrorBoundary: FC<Route.ErrorBoundaryProps> = ({ error }) => {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}

export default App

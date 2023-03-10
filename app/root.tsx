import type { FC } from 'react'
import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { ToastContainer } from 'react-toastify'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import LoadingIndicator from '~/components/LoadingIndicator'
import toastifyStyles from 'react-toastify/dist/ReactToastify.css'
import styles from './styles/app.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Concert Diary',
  viewport: 'width=device-width,initial-scale=1,maximum-scale=1',
})

export const links: LinksFunction = () => [
  {
    rel: 'shortcut icon',
    href: 'favicon.png',
    sizes: '196x196',
  },
  {
    rel: 'stylesheet',
    href: styles,
  },
  {
    rel: 'stylesheet',
    href: toastifyStyles,
  },
]

const App: FC = () => (
  <html lang="en">
    <head>
      <Meta />
      <Links />
    </head>
    <body className="bg-gray-50">
      <LoadingIndicator />
      <ToastContainer />
      <Outlet />
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </body>
  </html>
)

export default App

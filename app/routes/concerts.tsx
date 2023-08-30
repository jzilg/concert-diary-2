import type { FC } from 'react'
import Header from '~/components/Header'
import { Outlet } from '@remix-run/react'

const Concerts: FC = () => (
  <>
    <Header />
    <main className="container mx-auto pb-10">
      <Outlet />
    </main>
  </>
)

export default Concerts

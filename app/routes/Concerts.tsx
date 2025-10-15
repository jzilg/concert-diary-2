import type { FC } from 'react'
import { Outlet } from 'react-router'
import Header from '~/components/Header'

const Concerts: FC = () => (
  <>
    <Header />
    <main className="container mx-auto pb-10">
      <Outlet />
    </main>
  </>
)

export default Concerts

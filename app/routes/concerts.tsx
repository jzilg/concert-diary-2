import type { FC } from 'react'
import Header from '~/components/Header'
import { Outlet } from '@remix-run/react'

const Concerts: FC = () => (
  <>
    <Header />
    <div className="container mx-auto pb-10">
      <Outlet />
    </div>
  </>
)

export default Concerts

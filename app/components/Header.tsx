import type { FC } from 'react'
import Navigation from '~/components/Navigation'

const Header: FC = () => (
  <header className="container mx-auto flex items-center mt-10 px-6">
    <div className="grow">
      <h1 className="text-4xl font-bold">Concert Diary</h1>
    </div>
    <Navigation />
  </header>
)

export default Header

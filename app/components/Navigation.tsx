import type { FC } from 'react'
import { BoxArrowRight } from 'react-bootstrap-icons'
import NavLink from '~/components/NavLink'

const Navigation: FC = () => {
  const navLinks = [
    {
      url: '/concerts',
      label: 'Concerts',
    },
    {
      url: '/festivals',
      label: 'Festivals',
    },
    {
      url: '/statistics',
      label: 'Statistics',
    },
    {
      url: '/logout',
      label: (
        <>
          Logout
          <BoxArrowRight />
        </>
      ),
    },
  ]

  const linkElements = navLinks.map((link) => (
    <li key={`${link.url}-${link.label}`}>
      <NavLink to={link.url}>
        {link.label}
      </NavLink>
    </li>
  ))

  return (
    <nav>
      <ul className="flex flex-wrap">
        {linkElements}
      </ul>
    </nav>
  )
}

export default Navigation

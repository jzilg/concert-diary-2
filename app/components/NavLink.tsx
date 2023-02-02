/* eslint-disable react/jsx-props-no-spreading */
import type { FC, RefAttributes } from 'react'
import type { RemixLinkProps } from '@remix-run/react/dist/components'
import { Link } from '@remix-run/react'

export type Props = RemixLinkProps & RefAttributes<HTMLAnchorElement>

const NavLink: FC<Props> = (props) => {
  const { children, className } = props

  return (
    <Link
      className={`inline-flex gap-2 items-center px-4 py-3 text-blue-600 visited:text-blue-900 hover:underline ${className ?? ''}`}
      {...props}
    >
      {children}
    </Link>
  )
}

export default NavLink

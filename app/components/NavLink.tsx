/* eslint-disable react/jsx-props-no-spreading */
import type { ComponentProps, FC } from 'react'
import { Link } from 'react-router'

export type Props = ComponentProps<typeof Link>;

const NavLink: FC<Props> = (props) => {
  const { children, className } = props

  return (
    <Link
      className={`inline-flex gap-2 items-center px-4 py-3 text-blue-600 dark:text-amber-500 hover:underline outline-0 ${className ?? ''}`}
      {...props}
    >
      {children}
    </Link>
  )
}

export default NavLink

import type { ComponentProps, FC } from 'react'
import { Link } from 'react-router'

export type Props = ComponentProps<typeof Link>

const NavLink: FC<Props> = (props) => {
  const { children } = props

  return (
    <Link
      className="inline-flex gap-2 items-center px-4 py-3 underline underline-offset-4 decoration-2 decoration-amber-400 hover:text-amber-400 transition-colors"
      {...props}
    >
      {children}
    </Link>
  )
}

export default NavLink

/* eslint-disable react/jsx-props-no-spreading, react/button-has-type */
import type { ButtonHTMLAttributes, FC } from 'react'

export type Props = ButtonHTMLAttributes<HTMLButtonElement>

const Button: FC<Props> = (props) => {
  const { children, className } = props

  return (
    <button
      className={`bg-green-500 dark:bg-green-700 inline-flex gap-2 items-center text-white rounded-full px-4 py-3 ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

import type { ButtonHTMLAttributes, FC } from 'react'

export type Props = ButtonHTMLAttributes<HTMLButtonElement>

const Button: FC<Props> = (props) => {
  const { children } = props

  return (
    <button
      className="bg-linear-to-t from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 dark:from-green-700 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 transition-colors inline-flex gap-2 items-center text-white rounded-full px-4 py-3 outline-offset-2 cursor-pointer"
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

import type { ButtonHTMLAttributes, FC } from 'react'

export type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

type Variant = 'primary' | 'alert'

const Button: FC<Props> = (props) => {
  const { children, variant = 'primary' } = props

  const variantClassesMap: Record<Variant, string> = {
    primary:
      'bg-linear-to-t from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 dark:from-green-700 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 text-white',
    alert:
      'bg-linear-to-t from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 dark:from-red-700 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 text-white',
  }

  return (
    <button
      className={`${variantClassesMap[variant]} transition-colors items-center gap-2 inline-flex rounded-full px-4 py-3 outline-offset-2 cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

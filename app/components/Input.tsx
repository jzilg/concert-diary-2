/* eslint-disable react/jsx-props-no-spreading */
import type { FC, InputHTMLAttributes } from 'react'

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const { className } = props

  return (
    <input
      {...props}
      className={`${className ?? ''} border-gray-300 dark:border-slate-700 rounded-md block w-full h-10 px-2 border dark:bg-slate-800 focus:border-blue-600 dark:focus:border-amber-400 outline-none transition-all`}
    />
  )
}

export default Input

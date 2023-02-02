/* eslint-disable react/jsx-props-no-spreading */
import type { FC, InputHTMLAttributes } from 'react'

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const { className } = props

  return (
    <input
      {...props}
      className={`${className ?? ''} border-gray-300 rounded-md block w-full h-10 px-2 border`}
    />
  )
}

export default Input

import type { FC } from 'react'
import { useState, useEffect } from 'react'

export type InputList = string[]

type Props = {
    list: InputList
    onChange: (list: InputList) => void
    placeholder?: string
}

const ListInput: FC<Props> = (props) => {
  const { list, onChange, placeholder } = props
  const separator = ', '
  const initValueString = list.join(separator)
  const [valueString, setValueString] = useState(initValueString)

  useEffect(() => {
    setValueString(list.join(separator))
  }, [list])

  return (
    <input
      type="text"
      value={valueString}
      placeholder={placeholder}
      onChange={(event) => {
        const newValueString = event.target.value
        const newList: InputList = newValueString
          .replace(/( )*,( )*/g, separator) // remove extra spaces around comma
          .split(separator)

        setValueString(newValueString)
        onChange(newList)
      }}
    />
  )
}

ListInput.defaultProps = {
  placeholder: '',
}

export default ListInput

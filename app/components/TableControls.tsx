import type { FC } from 'react'
import { Link } from '@remix-run/react'
import { PencilSquare, Trash } from 'react-bootstrap-icons'

type Props = {
    editUrl: string
    deleteFn: () => void
}

const TableControls: FC<Props> = (props) => {
  const {
    editUrl,
    deleteFn,
  } = props

  return (
    <ul className="flex justify-end">
      <li>
        <Link
          to={editUrl}
          title="Edit"
          className="inline-flex p-4 hover:text-white hover:bg-blue-600 transition-colors"
        >
          <PencilSquare />
        </Link>
      </li>
      <li>
        <button
          type="button"
          title="Delete"
          className="p-4 hover:text-white hover:bg-red-600 transition-colors"
          onClick={() => {
            deleteFn()
          }}
        >
          <Trash />
        </button>
      </li>
    </ul>
  )
}

export default TableControls

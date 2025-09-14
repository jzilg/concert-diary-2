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
    <ul className="sm:flex">
      <li>
        <Link
          to={editUrl}
          title="Edit"
          className="inline-flex p-4 dark:bg-slate-800 bg-white hover:text-white hover:bg-blue-600 transition-colors border-l border-t dark:border-slate-900 rounded-tl-md"
        >
          <PencilSquare />
        </Link>
      </li>
      <li>
        <button
          type="button"
          title="Delete"
          className="p-4 bg-white dark:bg-slate-800 hover:text-white hover:bg-red-600 transition-colors border-t border-l dark:border-slate-900"
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

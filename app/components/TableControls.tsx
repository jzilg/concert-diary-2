import type { FC } from 'react'
import { PencilSquare, Trash } from 'react-bootstrap-icons'
import { Link } from 'react-router'

type Props = {
  editUrl: string
  deleteFn: () => void
  title: string
}

const TableControls: FC<Props> = (props) => {
  const { editUrl, deleteFn, title } = props

  return (
    <ul className="sm:flex">
      <li>
        <Link
          to={editUrl}
          title={`Edit ${title}`}
          aria-label={`Edit ${title}`}
          className="inline-flex p-4 dark:bg-slate-800 bg-white hover:text-white focus-visible:text-white hover:bg-blue-600 focus-visible:bg-blue-600 transition-colors border-l border-t dark:border-slate-900 rounded-tl-md"
        >
          <PencilSquare aria-hidden />
        </Link>
      </li>
      <li>
        <button
          type="button"
          title={`Delete ${title}`}
          aria-label={`Delete ${title}`}
          className="p-4 bg-white dark:bg-slate-800 hover:text-white focus-visible:text-white hover:bg-red-600 focus-visible:bg-red-600 transition-colors border-t border-l dark:border-slate-900 cursor-pointer"
          onClick={() => {
            deleteFn()
          }}
        >
          <Trash aria-hidden />
        </button>
      </li>
    </ul>
  )
}

export default TableControls

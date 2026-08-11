import type { FC } from 'react'
import { PencilSquare } from 'react-bootstrap-icons'
import { Link } from 'react-router'
import type { Festival } from '~/entities/Festival'

export type Props = {
  festivals: Festival[]
}

const FestivalsTable: FC<Props> = (props) => {
  const { festivals } = props

  const rowElements = festivals.map((festival: Festival) => {
    const { id, name } = festival
    const bands = festival.bands.join(', ')
    const companions = festival.companions.join(', ')
    const startDate = new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
    }).format(new Date(festival.date.from))
    const endDate = new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
    }).format(new Date(festival.date.until))
    const date = `from ${startDate} until ${endDate}`
    const editUrl = `/festivals/${id}`

    return (
      <li
        key={id}
        className="grid grid-cols-[1fr_auto] gap-3 items-center p-6 border-b dark:border-slate-900 transition-colors"
      >
        <div>
          <p>
            <span className="font-bold">{name}</span> with {bands}
          </p>
          <p>
            {date} accompanied by {companions}
          </p>
        </div>
        <div>
          <Link
            to={editUrl}
            title={`Edit ${name}`}
            aria-label={`Edit ${name}`}
            className="inline-flex p-4 dark:bg-slate-800 bg-white hover:text-white focus-visible:text-white hover:bg-blue-600 focus-visible:bg-blue-600 outline-offset-2 transition-colors rounded-xl"
          >
            <PencilSquare aria-hidden />
          </Link>
        </div>
      </li>
    )
  })

  return (
    <ul className="bg-white dark:bg-slate-800 rounded-2xl">{rowElements}</ul>
  )
}

export default FestivalsTable

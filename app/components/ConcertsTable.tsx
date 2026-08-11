import { Activity, type FC } from 'react'
import { PencilSquare } from 'react-bootstrap-icons'
import { Link } from 'react-router'
import type { Concert } from '~/entities/Concert'

export type Props = {
  concerts: Concert[]
}

const ConcertsTable: FC<Props> = (props) => {
  const { concerts } = props

  const rowElements = concerts.map((concert: Concert) => {
    const { id, band, location } = concert
    const supportBands = concert.supportBands.join(', ')
    const companions = concert.companions.join(', ')
    const date = new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
    }).format(new Date(concert.date))
    const editUrl = `/concerts/${id}`

    return (
      <li
        key={id}
        className="grid grid-cols-[1fr_auto] gap-3 items-center p-6 border-b dark:border-slate-900 transition-colors"
      >
        <div>
          <p>
            <span className="font-bold">{band}</span>{' '}
            <Activity mode={supportBands.length > 0 ? 'visible' : 'hidden'}>
              supported by
            </Activity>{' '}
            <span className="font-bold">{supportBands}</span>
          </p>
          <p>
            at {location} on {date}
          </p>
          <p>
            <Activity mode={companions.length > 0 ? 'visible' : 'hidden'}>
              accompanied by
            </Activity>{' '}
            {companions}
          </p>
        </div>
        <div>
          <Link
            to={editUrl}
            title={`Edit ${band}`}
            aria-label={`Edit ${band}`}
            className="inline-flex p-4 dark:bg-slate-800 bg-white hover:text-white focus-visible:text-white hover:bg-blue-600 focus-visible:bg-blue-600 outline-offset-2 transition-colors rounded-xl"
          >
            <PencilSquare aria-hidden />
          </Link>
        </div>
      </li>
    )
  })

  return (
    <ul className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
      {rowElements}
    </ul>
  )
}

export default ConcertsTable

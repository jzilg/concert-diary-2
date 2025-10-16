import { Activity, type FC } from 'react'
import type { Concert } from '~/entities/Concert'
import TableControls from './TableControls'

export type Props = {
  concerts: Concert[]
  deleteConcert: (id: Concert['id']) => void
}

const ConcertsTable: FC<Props> = (props) => {
  const { concerts, deleteConcert } = props

  const rowElements = concerts.map((concert: Concert) => {
    const { id, band, location } = concert
    const supportBands = concert.supportBands.join(', ')
    const companions = concert.companions.join(', ')
    const date = new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
    }).format(new Date(concert.date))
    const editUrl = `/concerts/${id}`

    const deleteFn = (): void => {
      if (
        window.confirm(
          `Do you really want to delete the ${concert.band} concert`,
        )
      ) {
        deleteConcert(id)
      }
    }

    return (
      <div
        key={id}
        className="hover:bg-gray-100 dark:hover:bg-slate-700 grid grid-cols-[1fr_auto] items-center border-b dark:border-slate-900"
      >
        <div className="p-6">
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
        <div className="self-end">
          <TableControls editUrl={editUrl} deleteFn={deleteFn} />
        </div>
      </div>
    )
  })

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg">{rowElements}</div>
  )
}

export default ConcertsTable

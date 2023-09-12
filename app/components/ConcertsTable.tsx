import type { FC } from 'react'
import renderIf from '~/helpers/renderIf'
import type Concert from '../entities/Concert'
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
    const date = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(new Date(concert.date))
    const editUrl = `/concerts/${id}`

    const deleteFn = (): void => {
      if (window.confirm(`Do you really want to delete the ${concert.band} concert`)) {
        deleteConcert(id)
      }
    }

    return (
      <div key={id} className="hover:bg-gray-100 dark:hover:bg-slate-700 grid grid-cols-[1fr_auto] items-center border-b dark:border-slate-900">
        <div className="p-6">
          <p>
            <span className="font-bold">{band}</span>
            {renderIf(<span> supported by </span>, supportBands.length > 0)}
            <span className="font-bold">{supportBands}</span>
          </p>
          <p>
            <span> at </span>
            <span>{location}</span>
            <span> on </span>
            <span>{date}</span>
          </p>
          <p>
            {renderIf(<span> accomblished by </span>, companions.length > 0)}
            <span>{companions}</span>
          </p>
        </div>
        <div>
          <TableControls
            editUrl={editUrl}
            deleteFn={deleteFn}
          />
        </div>
      </div>
    )
  })

  return (
    <div className="bg-white dark:bg-slate-800">
      {rowElements}
    </div>
  )
}

export default ConcertsTable

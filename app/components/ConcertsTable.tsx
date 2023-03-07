import type { FC } from 'react'
import type { SubmitFunction } from '@remix-run/react'
import type Concert from '../entities/Concert'
import TableControls from './TableControls'

export type Props = {
    concerts: Concert[]
    deleteConcert: SubmitFunction
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
      deleteConcert({ id }, {
        method: 'delete',
      })
    }

    return (
      <div key={id} className="hover:bg-gray-100 grid grid-cols-[1fr_auto] items-center border-b">
        <div className="p-6">
          <p>
            <span className="font-bold">{band}</span>
            <span> supported by </span>
            <span className="font-bold">{supportBands}</span>
          </p>
          <p>
            <span> at </span>
            <span>{location}</span>
            <span> on </span>
            <span>{date}</span>
          </p>
          <p>
            <span> accomblished by </span>
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
    <div className="bg-white">
      {rowElements}
    </div>
  )
}

export default ConcertsTable

import type { FC } from 'react'
import type { SubmitFunction } from '@remix-run/react'
import type Festival from '../entities/Festival'
import TableControls from './TableControls'

export type Props = {
    festivals: Festival[]
    deleteFestival: SubmitFunction
}

const FestivalsTable: FC<Props> = (props) => {
  const { festivals, deleteFestival } = props

  const rowElements = festivals.map((festival: Festival) => {
    const { id, name } = festival
    const bands = festival.bands.join(', ')
    const companions = festival.companions.join(', ')
    const startDate = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(new Date(festival.date.from))
    const endDate = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(new Date(festival.date.until))
    const date = `from ${startDate} until ${endDate}`
    const editUrl = `/festivals/${id}`

    const deleteFn = (): void => {
      deleteFestival({ id }, {
        method: 'delete',
      })
    }

    return (
      <div key={id} className="hover:bg-gray-100 grid grid-cols-[1fr_auto] items-center border-b">
        <div className="p-6">
          <p>
            <span className="font-bold">{name}</span>
            <span> with </span>
            <span>{bands}</span>
          </p>
          <p>
            <span>{date}</span>
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

export default FestivalsTable

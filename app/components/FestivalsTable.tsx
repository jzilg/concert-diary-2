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
    const date = `${startDate} - ${endDate}`
    const editUrl = `/festivals/${id}`

    const deleteFn = (): void => {
      deleteFestival({ id }, {
        method: 'delete',
      })
    }

    return (
      <tr key={id} className="hover:bg-gray-100">
        <td className="px-3 py-0 border-b">{name}</td>
        <td className="px-3 py-0 border-b">{bands}</td>
        <td className="px-3 py-0 border-b">{date}</td>
        <td className="px-3 py-0 border-b">{companions}</td>
        <td className="border-b py-0">
          <TableControls
            editUrl={editUrl}
            deleteFn={deleteFn}
          />
        </td>
      </tr>
    )
  })

  return (
    <table className="w-full table-fixed border-separate border-spacing-0">
      <thead className="text-left">
        <tr className="sticky top-0 bg-gray-50">
          <th className="py-2 px-3 border-b">Name</th>
          <th className="py-2 px-3 border-b">Bands</th>
          <th className="py-2 px-3 border-b">Date</th>
          <th className="py-2 px-3 border-b" colSpan={2}>Companions</th>
        </tr>
      </thead>
      <tbody>
        {rowElements}
      </tbody>
    </table>
  )
}

export default FestivalsTable

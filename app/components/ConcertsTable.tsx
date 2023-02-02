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
      <tr key={id} className="hover:bg-gray-100">
        <td className="px-3 py-0 border-b">{band}</td>
        <td className="px-3 py-0 border-b">{supportBands}</td>
        <td className="px-3 py-0 border-b">{location}</td>
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
          <th className="py-2 px-3 border-b">Band</th>
          <th className="py-2 px-3 border-b">Support</th>
          <th className="py-2 px-3 border-b">Location</th>
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

export default ConcertsTable

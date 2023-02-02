import type { FC } from 'react'
import type MostCommonCompanion from '../entities/MostCommonCompanion'

export type Props = {
    mostCommonCompanions: MostCommonCompanion[]
}

const MostCommonCompanionsTable: FC<Props> = (props) => {
  const { mostCommonCompanions } = props

  const rowElements = mostCommonCompanions.map((mostCommonCompanion) => {
    const {
      name,
      totalCount,
      festivalCount,
      concertCount,
    } = mostCommonCompanion

    return (
      <tr key={name} className="hover:bg-gray-100">
        <td className="px-3 py-2 border-b">{name}</td>
        <td className="px-3 py-2 border-b text-center">{totalCount}</td>
        <td className="px-3 py-2 border-b text-center">{concertCount}</td>
        <td className="px-3 py-2 border-b text-center">{festivalCount}</td>
      </tr>
    )
  })

  return (
    <table className="w-full  border-separate border-spacing-0">
      <caption>
        <h3 className="font-bold text-xl mb-3">Most Common Companion</h3>
      </caption>
      <thead>
        <tr>
          <th className="py-2 px-3 border-b text-left">Name</th>
          <th className="py-2 px-3 border-b">Total</th>
          <th className="py-2 px-3 border-b">Concerts</th>
          <th className="py-2 px-3 border-b">Festivals</th>
        </tr>
      </thead>
      <tbody>
        {rowElements}
      </tbody>
    </table>
  )
}

export default MostCommonCompanionsTable

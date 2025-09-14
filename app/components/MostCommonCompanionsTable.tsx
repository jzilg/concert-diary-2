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
      <tr key={name} className="hover:bg-gray-100 dark:hover:bg-slate-700">
        <td className="px-3 sm:px-6 py-4 border-b dark:border-slate-900">{name}</td>
        <td className="px-3 sm:px-6 py-4 border-b dark:border-slate-900 text-center">{totalCount}</td>
        <td className="px-3 sm:px-6 py-4 border-b dark:border-slate-900 text-center">{concertCount}</td>
        <td className="px-3 sm:px-6 py-4 border-b dark:border-slate-900 text-center">{festivalCount}</td>
      </tr>
    )
  })

  return (
    <table className="w-full bg-white dark:bg-slate-800 border-separate border-spacing-0 shadow-lg">
      <caption className="text-left sm:text-center px-6">
        <h3 className="font-bold text-xl mb-3">Most Common Companion</h3>
      </caption>
      <thead>
        <tr>
          <th className="px-3 sm:px-6 py-4 border-b dark:border-slate-900 text-left">Name</th>
          <th className="px-3 sm:px-6 py-4 border-b dark:border-slate-900">Total</th>
          <th className="px-3 sm:px-6 py-4 border-b dark:border-slate-900">Concerts</th>
          <th className="px-3 sm:px-6 py-4 border-b dark:border-slate-900">Festivals</th>
        </tr>
      </thead>
      <tbody>
        {rowElements}
      </tbody>
    </table>
  )
}

export default MostCommonCompanionsTable

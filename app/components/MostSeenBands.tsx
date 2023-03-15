import type { FC } from 'react'
import type MostSeenBand from '../entities/MostSeenBand'

type Props = {
    mostSeenBands: MostSeenBand[]
}

const MostSeenBands: FC<Props> = (props) => {
  const { mostSeenBands } = props

  const rowElements = mostSeenBands.map((mostSeenBand) => {
    const {
      name,
      mainCount,
      supportCount,
      festivalCount,
      totalCount,
    } = mostSeenBand

    return (
      <tr key={name} className="hover:bg-gray-100 dark:hover:bg-slate-700">
        <td className="px-6 py-4 border-b dark:border-slate-900">{name}</td>
        <td className="px-6 py-4 text-center border-b dark:border-slate-900">{totalCount}</td>
        <td className="px-6 py-4 text-center border-b dark:border-slate-900">{mainCount}</td>
        <td className="px-6 py-4 text-center border-b dark:border-slate-900">{festivalCount}</td>
        <td className="px-6 py-4 text-center border-b dark:border-slate-900">{supportCount}</td>
      </tr>
    )
  })

  return (
    <table className="w-full bg-white dark:bg-slate-800 table-fixed border-separate border-spacing-0">
      <caption>
        <h3 className="font-bold text-xl mb-3">Most Seen Bands</h3>
      </caption>
      <thead>
        <tr>
          <th className="px-6 py-4 border-b dark:border-slate-900 text-left">Band</th>
          <th className="px-6 py-4 border-b dark:border-slate-900">Sum</th>
          <th className="px-6 py-4 border-b dark:border-slate-900">Main Act</th>
          <th className="px-6 py-4 border-b dark:border-slate-900">Festival Act</th>
          <th className="px-6 py-4 border-b dark:border-slate-900">Support Act</th>
        </tr>
      </thead>
      <tbody>
        {rowElements}
      </tbody>
    </table>
  )
}

export default MostSeenBands

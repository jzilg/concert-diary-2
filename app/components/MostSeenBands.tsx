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
      <tr key={name} className="hover:bg-gray-100">
        <td className="px-3 py-2 border-b">{name}</td>
        <td className="px-3 py-2 text-center border-b">{totalCount}</td>
        <td className="px-3 py-2 text-center border-b">{mainCount}</td>
        <td className="px-3 py-2 text-center border-b">{festivalCount}</td>
        <td className="px-3 py-2 text-center border-b">{supportCount}</td>
      </tr>
    )
  })

  return (
    <table className="w-full table-fixed border-separate border-spacing-0">
      <caption>
        <h3 className="font-bold text-xl mb-3">Most Seen Bands</h3>
      </caption>
      <thead>
        <tr>
          <th className="py-2 px-3 border-b text-left">Band</th>
          <th className="py-2 px-3 border-b">Sum</th>
          <th className="py-2 px-3 border-b">Main Act</th>
          <th className="py-2 px-3 border-b">Festival Act</th>
          <th className="py-2 px-3 border-b">Support Act</th>
        </tr>
      </thead>
      <tbody>
        {rowElements}
      </tbody>
    </table>
  )
}

export default MostSeenBands
